import type { Note } from "@/types/content";

/**
 * Substack publishes no API or RSS feed for Notes, so unlike posts this cannot
 * be generated at build time. Update this by hand when you want to feature a
 * new note; everything else links out to the Substack profile.
 *
 * TODO(katherine/natalia): This is seeded with a note from the June plan.
 * Replace `body` and `publishedAt` with your current note before launch.
 */
export const LATEST_NOTE: Note = {
  body: "The 'should kids use AI' debate is over. AI is in the classroom, the toy box, and the group chat, and banning it isn't realistic. Raising kids with the judgment, emotional fluency, and curiosity to use it well is. That's harder than a rule, but far more hopeful, because it's something we build together. It starts, every time, with a conversation.",
  publishedAt: "2026-06-29",
};
