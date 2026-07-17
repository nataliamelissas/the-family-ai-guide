import { XMLParser } from "fast-xml-parser";

export const DEFAULT_MAX_POSTS = 5;
export const DEFAULT_EXCERPT_LENGTH = 280;

const ELLIPSIS = "…";

const HTML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

const SCRIPT_AND_STYLE_PATTERN = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const HTML_ENTITY_PATTERN = /&(?:amp|lt|gt|quot|#39|apos|nbsp);/g;
const NUMERIC_ENTITY_PATTERN = /&#(\d+);/g;
const WHITESPACE_PATTERN = /\s+/g;

/**
 * Post bodies open with a standalone byline paragraph ("<p>Written by: Natalia
 * Soto</p>"). Matching the whole element keeps this precise: flattening the
 * text first and pattern-matching names would eat real prose that follows.
 */
const LEADING_BYLINE_ELEMENT_PATTERN =
  /^\s*<p>\s*(?:written\s+by|by)\s*:[^<]*<\/p>\s*/i;

/** Converts an HTML fragment into readable plain text. */
export function stripHtml(html) {
  if (typeof html !== "string") {
    return "";
  }

  return html
    .replace(SCRIPT_AND_STYLE_PATTERN, " ")
    .replace(HTML_TAG_PATTERN, " ")
    .replace(HTML_ENTITY_PATTERN, (entity) => HTML_ENTITIES[entity] ?? entity)
    .replace(NUMERIC_ENTITY_PATTERN, (_match, code) =>
      String.fromCharCode(Number(code)),
    )
    .replace(WHITESPACE_PATTERN, " ")
    .trim();
}

/** Removes a leading byline paragraph from a post body. */
export function stripLeadingByline(html) {
  if (typeof html !== "string") {
    return "";
  }
  return html.replace(LEADING_BYLINE_ELEMENT_PATTERN, "");
}

/** Truncates on a word boundary so excerpts never cut mid-word. */
export function truncate(text, maxLength = DEFAULT_EXCERPT_LENGTH) {
  if (text.length <= maxLength) {
    return text;
  }

  const clipped = text.slice(0, maxLength);
  const lastSpaceIndex = clipped.lastIndexOf(" ");
  const safeText =
    lastSpaceIndex > 0 ? clipped.slice(0, lastSpaceIndex) : clipped;

  return `${safeText.trimEnd()}${ELLIPSIS}`;
}

/**
 * Substack puts the author's own subtitle in the feed's description, which is
 * better excerpt copy than anything sliced out of the body. The body is only
 * used when a post has no subtitle.
 *
 * Takes a normalized shape so both the RSS and rss2json mappers share it.
 */
export function toExcerpt(
  { subtitle, body } = {},
  excerptLength = DEFAULT_EXCERPT_LENGTH,
) {
  const subtitleText = stripHtml(subtitle ?? "");
  if (subtitleText !== "") {
    return truncate(subtitleText, excerptLength);
  }

  return truncate(stripHtml(stripLeadingByline(body ?? "")), excerptLength);
}

function toIsoDate(pubDate) {
  const date = new Date(pubDate);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function toArray(value) {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function toPost({ guid, title, link, publishedAt, subtitle, body }, excerptLength) {
  const url = typeof link === "string" ? link : "";

  return {
    id: typeof guid === "string" && guid ? guid : url,
    title: typeof title === "string" ? title.trim() : "",
    url,
    publishedAt,
    excerpt: toExcerpt({ subtitle, body }, excerptLength),
  };
}

/** Items without a title or link would render broken, so they are dropped. */
function isRenderable(post) {
  return post.title !== "" && post.url !== "";
}

/** Maps a Substack RSS document into typed posts, newest first. */
export function mapFeedToPosts(xml, options = {}) {
  const {
    maxPosts = DEFAULT_MAX_POSTS,
    excerptLength = DEFAULT_EXCERPT_LENGTH,
  } = options;

  const parser = new XMLParser({
    ignoreAttributes: true,
    parseTagValue: false,
    trimValues: true,
  });

  const feed = parser.parse(xml);

  return toArray(feed?.rss?.channel?.item)
    .map((item) =>
      toPost(
        {
          guid: item.guid,
          title: item.title,
          link: item.link,
          publishedAt: toIsoDate(item.pubDate),
          subtitle: item.description,
          body: item["content:encoded"],
        },
        excerptLength,
      ),
    )
    .filter(isRenderable)
    .slice(0, maxPosts);
}

/**
 * rss2json reports pubDate as "2026-07-17 01:31:17": UTC, but with no marker
 * saying so. Date parsing would treat that as local time and silently shift
 * the post's date, so the zone is made explicit before parsing.
 */
const RSS2JSON_DATE_PATTERN = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/;

export function rss2JsonDateToIso(pubDate) {
  if (typeof pubDate !== "string") {
    return "";
  }

  const match = RSS2JSON_DATE_PATTERN.exec(pubDate);
  return match ? toIsoDate(`${match[1]}T${match[2]}Z`) : toIsoDate(pubDate);
}

/**
 * Maps an rss2json payload into the same typed posts as the RSS mapper.
 * Used when Substack's Cloudflare blocks a direct fetch from CI.
 */
export function mapRss2JsonToPosts(payload, options = {}) {
  const {
    maxPosts = DEFAULT_MAX_POSTS,
    excerptLength = DEFAULT_EXCERPT_LENGTH,
  } = options;

  if (payload?.status !== "ok") {
    throw new Error(`rss2json returned status "${payload?.status}"`);
  }

  return toArray(payload.items)
    .map((item) =>
      toPost(
        {
          guid: item.guid,
          title: item.title,
          link: item.link,
          publishedAt: rss2JsonDateToIso(item.pubDate),
          subtitle: item.description,
          body: item.content,
        },
        excerptLength,
      ),
    )
    .filter(isRenderable)
    .slice(0, maxPosts);
}
