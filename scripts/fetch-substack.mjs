import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mapFeedToPosts } from "./parse-feed.mjs";

const FEED_URL = "https://thefamilyaiguide.substack.com/feed";
const FETCH_TIMEOUT_MS = 15_000;
const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/content/generated/posts.json",
);

async function fetchFeed() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(FEED_URL, {
      signal: controller.signal,
      headers: { accept: "application/rss+xml, application/xml, text/xml" },
    });

    if (!response.ok) {
      throw new Error(`Feed responded ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function writePosts(posts) {
  const payload = { fetchedAt: new Date().toISOString(), posts };
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

/**
 * A Substack outage must never break a deploy, so a failed fetch falls back to
 * the committed snapshot and exits successfully. It only fails hard when there
 * is no snapshot to fall back to, since the build would break anyway.
 */
async function main() {
  try {
    const xml = await fetchFeed();
    const posts = mapFeedToPosts(xml);

    if (posts.length === 0) {
      throw new Error("Feed contained no usable posts");
    }

    await writePosts(posts);
    console.log(`✓ Fetched ${posts.length} post(s) from Substack.`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    if (existsSync(OUTPUT_PATH)) {
      console.warn(`⚠ Substack fetch failed (${reason}).`);
      console.warn("→ Keeping the existing posts snapshot.");
      return;
    }

    console.error(`✗ Substack fetch failed (${reason}) and no snapshot exists.`);
    process.exitCode = 1;
  }
}

await main();
