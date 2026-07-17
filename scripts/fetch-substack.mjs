import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { mapFeedToPosts, mapRss2JsonToPosts } from "./parse-feed.mjs";

const FEED_URL = "https://thefamilyaiguide.substack.com/feed";
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`;
const FETCH_TIMEOUT_MS = 20_000;

const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/content/generated/posts.json",
);

/**
 * Runs triggered by a schedule or by hand exist only to pull in new posts, so
 * failing to refresh is the whole job failing: it should turn the run red and
 * send the usual failure email. A push is different. Its point is shipping a
 * code change, and blocking that over a feed outage would be worse than
 * deploying with slightly older posts.
 */
const REFRESH_ONLY_EVENTS = new Set(["schedule", "workflow_dispatch"]);

export function shouldFailOnStaleSnapshot(eventName) {
  return REFRESH_ONLY_EVENTS.has(eventName ?? "");
}

function annotate(level, message) {
  const inActions = process.env.GITHUB_ACTIONS === "true";
  const fallbackPrefix = level === "error" ? "✗ " : "⚠ ";
  const prefix = inActions ? `::${level}::` : fallbackPrefix;
  const log = level === "error" ? console.error : console.warn;
  log(`${prefix}${message}`);
}

async function getText(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      accept: "application/rss+xml, application/xml, text/xml, application/json",
    },
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

export async function main() {
  const failures = [];

  for (const source of SOURCES) {
    try {
      const posts = await source.fetch();
      await writePosts(posts, source.name);
      console.log(`✓ Fetched ${posts.length} post(s) via ${source.name}.`);
      if (failures.length > 0) {
        // Cloudflare always blocks the direct feed from CI, so reaching the
        // fallback is the routine path there. Warning on it every run would
        // train us to ignore the warning that actually matters below.
        console.log(`  (skipped ${failures.join("; ")})`);
      }
      return;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      failures.push(`${source.name}: ${reason}`);
    }
  }

  const summary = failures.join("; ");

  if (!existsSync(OUTPUT_PATH)) {
    annotate("error", `Could not fetch posts (${summary}) and no snapshot exists.`);
    process.exitCode = 1;
    return;
  }

  if (shouldFailOnStaleSnapshot(process.env.GITHUB_EVENT_NAME)) {
    annotate(
      "error",
      `Could not refresh posts (${summary}). The site keeps showing older posts until this is fixed.`,
    );
    process.exitCode = 1;
    return;
  }

  annotate(
    "warning",
    `Could not refresh posts (${summary}). Deploying with the existing snapshot so this change still ships.`,
  );
}

// Guarded so tests can import the helpers without running the fetch.
const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  await main();
}
