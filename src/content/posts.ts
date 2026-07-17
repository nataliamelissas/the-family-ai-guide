import generatedPosts from "@/content/generated/posts.json";
import type { GeneratedPosts, Post } from "@/types/content";

/**
 * Typed boundary for the build-time generated feed snapshot.
 * Regenerate with `npm run fetch:substack`.
 */
const generated = generatedPosts as GeneratedPosts;

export const POSTS: ReadonlyArray<Post> = generated.posts;

export const LATEST_POST: Post | null = POSTS[0] ?? null;
