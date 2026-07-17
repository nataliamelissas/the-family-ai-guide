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
 * Substack puts the author's own subtitle in `description`, which is better
 * excerpt copy than anything sliced out of the body. The body is only used
 * when a post has no subtitle.
 */
export function toExcerpt(item, excerptLength = DEFAULT_EXCERPT_LENGTH) {
  const subtitle = stripHtml(item.description ?? "");
  if (subtitle !== "") {
    return truncate(subtitle, excerptLength);
  }

  const body = stripHtml(stripLeadingByline(item["content:encoded"] ?? ""));
  return truncate(body, excerptLength);
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

function toPost(item, excerptLength) {
  const url = typeof item.link === "string" ? item.link : "";

  return {
    id: typeof item.guid === "string" && item.guid ? item.guid : url,
    title: typeof item.title === "string" ? item.title.trim() : "",
    url,
    publishedAt: toIsoDate(item.pubDate),
    excerpt: toExcerpt(item, excerptLength),
  };
}

/**
 * Maps a Substack RSS document into typed posts, newest first.
 * Items without a title or link are dropped rather than rendered broken.
 */
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
  const items = toArray(feed?.rss?.channel?.item);

  return items
    .map((item) => toPost(item, excerptLength))
    .filter((post) => post.title !== "" && post.url !== "")
    .slice(0, maxPosts);
}
