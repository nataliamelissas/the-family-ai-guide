import { describe, expect, it } from "vitest";
import {
  mapFeedToPosts,
  stripHtml,
  stripLeadingByline,
  toExcerpt,
  truncate,
} from "./parse-feed.mjs";

function buildFeed(itemsXml) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>The Family AI Guide</title>
        ${itemsXml}
      </channel>
    </rss>`;
}

function buildItem({
  title = "A post",
  link = "https://thefamilyaiguide.substack.com/p/a-post",
  pubDate = "Fri, 03 Jul 2026 12:00:00 GMT",
  description = "",
  content = "",
}) {
  return `<item>
    <title><![CDATA[${title}]]></title>
    <link>${link}</link>
    <pubDate>${pubDate}</pubDate>
    <description><![CDATA[${description}]]></description>
    <content:encoded><![CDATA[${content}]]></content:encoded>
  </item>`;
}

describe("stripHtml", () => {
  it("flattens markup and decodes entities", () => {
    const html = "<p>Smart bassinets &amp; AI tutors</p><p>are&#8217;t simple</p>";
    expect(stripHtml(html)).toBe("Smart bassinets & AI tutors are’t simple");
  });

  it("drops script and style content", () => {
    expect(stripHtml("<style>p{color:red}</style><p>Hello</p>")).toBe("Hello");
  });

  it("returns an empty string for non-string input", () => {
    expect(stripHtml(undefined)).toBe("");
  });
});

describe("stripLeadingByline", () => {
  it("removes a leading byline paragraph", () => {
    const html = "<p>Written by: Natalia Soto</p><p>We have a tendency.</p>";
    expect(stripLeadingByline(html)).toBe("<p>We have a tendency.</p>");
  });

  it("removes the short 'By:' form", () => {
    const html = "<p>By: Katherine Wahlen</p><p>Growing up, my dad said.</p>";
    expect(stripLeadingByline(html)).toBe("<p>Growing up, my dad said.</p>");
  });

  it("leaves prose untouched when there is no byline", () => {
    const html = "<p>By the time we noticed, it was late.</p>";
    expect(stripLeadingByline(html)).toBe(html);
  });
});

describe("truncate", () => {
  it("leaves short text unchanged", () => {
    expect(truncate("Short enough", 50)).toBe("Short enough");
  });

  it("cuts on a word boundary and never mid-word", () => {
    const result = truncate("alpha bravo charlie delta", 15);
    expect(result).toBe("alpha bravo…");
    expect(result).not.toContain("charl");
  });
});

describe("toExcerpt", () => {
  it("prefers the author's subtitle over the body", () => {
    const item = {
      description: "Smart bassinets, AI tutors, and the question every parent faces.",
      "content:encoded": "<p>Written by: Natalia Soto</p><p>Body text.</p>",
    };
    expect(toExcerpt(item)).toBe(
      "Smart bassinets, AI tutors, and the question every parent faces.",
    );
  });

  it("falls back to the body when there is no subtitle", () => {
    const item = {
      description: "",
      "content:encoded": "<p>Written by: Natalia Soto</p><p>Body text here.</p>",
    };
    expect(toExcerpt(item)).toBe("Body text here.");
  });

  /**
   * Regression: an earlier byline strip matched name-like words in flattened
   * text and swallowed the first real word ("We have a…" became "have a…").
   */
  it("keeps the first word of the body when stripping a byline", () => {
    const item = {
      description: "",
      "content:encoded":
        "<p>Written by: Natalia Soto</p><p>We have a natural tendency to trust.</p>",
    };
    expect(toExcerpt(item)).toBe("We have a natural tendency to trust.");
  });
});

describe("mapFeedToPosts", () => {
  it("maps a feed item into a typed post", () => {
    const xml = buildFeed(
      buildItem({
        title: "Behind the Screens",
        link: "https://thefamilyaiguide.substack.com/p/behind-the-screens",
        pubDate: "Fri, 03 Jul 2026 12:00:00 GMT",
        description: "How AI works, and why it sounds so convincing.",
      }),
    );

    const [post] = mapFeedToPosts(xml);

    expect(post).toEqual({
      id: "https://thefamilyaiguide.substack.com/p/behind-the-screens",
      title: "Behind the Screens",
      url: "https://thefamilyaiguide.substack.com/p/behind-the-screens",
      publishedAt: "2026-07-03T12:00:00.000Z",
      excerpt: "How AI works, and why it sounds so convincing.",
    });
  });

  it("handles a channel with a single item", () => {
    const xml = buildFeed(buildItem({ title: "Only post" }));
    expect(mapFeedToPosts(xml)).toHaveLength(1);
  });

  it("drops items missing a title or link", () => {
    const xml = buildFeed(
      [
        buildItem({ title: "Good post" }),
        buildItem({ title: "", link: "https://example.com/no-title" }),
        buildItem({ title: "No link", link: "" }),
      ].join(""),
    );

    const posts = mapFeedToPosts(xml);
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe("Good post");
  });

  it("limits the number of posts returned", () => {
    const items = Array.from({ length: 8 }, (_, index) =>
      buildItem({
        title: `Post ${index}`,
        link: `https://thefamilyaiguide.substack.com/p/post-${index}`,
      }),
    ).join("");

    expect(mapFeedToPosts(buildFeed(items), { maxPosts: 3 })).toHaveLength(3);
  });

  it("returns an empty array for a feed with no items", () => {
    expect(mapFeedToPosts(buildFeed(""))).toEqual([]);
  });
});
