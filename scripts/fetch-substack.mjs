import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mapFeedToPosts, mapRss2JsonToPosts } from "./parse-feed.mjs";

const FEED_URL = "https://thefamilyaiguide.substack.com/feed";
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`;
const FETCH_TIMEOUT_MS = 20_000;

const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/content/generated/posts.json",
);

/** Surfaces in the Actions run summary rather than scrolling past in a log. */
function warn(message) {
  const prefix = process.env.GITHUB_ACTIONS === "true" ? "::warning::" : "⚠ ";
  console.warn(`${prefix}${message}`);
}

async function getText(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { accept: "application/rss+xml, application/xml, text/xml, application/json" },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

/** The direct feed. Works from a normal network. */
async function fetchDirect() {
  const posts = mapFeedToPosts(await getText(FEED_URL));
  if (posts.length === 0) {
    throw new Error("feed contained no usable posts");
  }
  return posts;
}

/**
 * Substack sits behind Cloudflare, which serves GitHub Actions IP ranges a JS
 * challenge that CI cannot solve, so every direct fetch from a runner 403s.
 * rss2json reads the same public feed from an address that is not challenged.
 */
async function fetchViaRss2Json() {
  const posts = mapRss2JsonToPosts(JSON.parse(await getText(RSS2JSON_URL)));
  if (posts.length === 0) {
    throw new Error("rss2json returned no usable posts");
  }
  return posts;
}

async function writePosts(posts, source) {
  const payload = { fetchedAt: new Date().toISOString(), source, posts };
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

const SOURCES = [
  { name: "substack", fetch: fetchDirect },
  { name: "rss2json", fetch: fetchViaRss2Json },
];

/**
 * Tries each source in order and keeps the committed snapshot if all fail, so
 * an outage degrades to slightly stale posts instead of a broken deploy. The
 * fallback is always announced: a silent fallback looks identical to success
 * while the site quietly stops updating.
 */
async function main() {
  const failures = [];

  for (const source of SOURCES) {
    try {
      const posts = await source.fetch();
      await writePosts(posts, source.name);
      console.log(`✓ Fetched ${posts.length} post(s) via ${source.name}.`);
      if (failures.length > 0) {
        warn(`Primary feed unavailable (${failures.join("; ")}). Used ${source.name}.`);
      }
      return;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      failures.push(`${source.name}: ${reason}`);
    }
  }

  const summary = failures.join("; ");

  if (existsSync(OUTPUT_PATH)) {
    warn(`Could not refresh posts (${summary}). Serving the existing snapshot, so the site may show an older post.`);
    return;
  }

  console.error(`✗ Could not fetch posts (${summary}) and no snapshot exists.`);
  process.exitCode = 1;
}

await main();
