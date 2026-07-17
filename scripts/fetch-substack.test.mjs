import { describe, expect, it } from "vitest";
import { shouldFailOnStaleSnapshot } from "./fetch-substack.mjs";

describe("shouldFailOnStaleSnapshot", () => {
  /**
   * The incident this guards: a manual refresh run fell back to the snapshot,
   * reported success, and the homepage silently kept showing a stale post.
   */
  it("fails a run whose only purpose was refreshing posts", () => {
    expect(shouldFailOnStaleSnapshot("schedule")).toBe(true);
    expect(shouldFailOnStaleSnapshot("workflow_dispatch")).toBe(true);
  });

  it("does not fail a push, so a feed outage cannot block shipping code", () => {
    expect(shouldFailOnStaleSnapshot("push")).toBe(false);
  });

  it("does not fail when run outside Actions", () => {
    expect(shouldFailOnStaleSnapshot(undefined)).toBe(false);
    expect(shouldFailOnStaleSnapshot("")).toBe(false);
  });
});
