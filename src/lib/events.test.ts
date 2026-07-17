import { describe, expect, it } from "vitest";
import { findUpcomingEvent } from "@/lib/events";
import type { EventItem } from "@/types/content";

function makeEvent(id: string, startsAt: string): EventItem {
  return {
    id,
    title: `Event ${id}`,
    description: "A description.",
    startsAt,
    location: null,
    locationUrl: null,
    registrationUrl: null,
  };
}

const NOW = new Date(2026, 6, 17);

describe("findUpcomingEvent", () => {
  it("returns null when there are no events", () => {
    expect(findUpcomingEvent([], NOW)).toBeNull();
  });

  it("returns null when every event has passed", () => {
    const events = [
      makeEvent("old", "2026-01-05"),
      makeEvent("older", "2025-11-02"),
    ];

    expect(findUpcomingEvent(events, NOW)).toBeNull();
  });

  it("returns the soonest future event, regardless of list order", () => {
    const events = [
      makeEvent("later", "2026-11-20"),
      makeEvent("soonest", "2026-09-11"),
      makeEvent("past", "2026-02-01"),
    ];

    expect(findUpcomingEvent(events, NOW)?.id).toBe("soonest");
  });

  it("still promotes an event during the day it happens on", () => {
    const events = [makeEvent("today", "2026-07-17")];
    const midMorning = new Date(2026, 6, 17, 10, 30);

    expect(findUpcomingEvent(events, midMorning)?.id).toBe("today");
  });

  it("ignores events with an unparseable date", () => {
    expect(findUpcomingEvent([makeEvent("bad", "not-a-date")], NOW)).toBeNull();
  });
});
