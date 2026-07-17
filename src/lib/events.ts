import { parseDate } from "@/lib/date";
import type { EventItem } from "@/types/content";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * An event stays "upcoming" until the end of the day it happens on, so the
 * banner and RSVP prompt don't vanish on the morning of the event itself.
 */
function endsAfter(event: EventItem, now: Date): boolean {
  const startsAt = parseDate(event.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return false;
  }
  return startsAt.getTime() + MS_PER_DAY > now.getTime();
}

/**
 * The soonest event that hasn't happened yet, or null once they all have.
 * Everything that promotes an event (banner, RSVP dialog) reads from this, so
 * a passed event disappears from the whole site at once.
 */
export function findUpcomingEvent(
  events: ReadonlyArray<EventItem>,
  now: Date,
): EventItem | null {
  const upcoming = events
    .filter((event) => endsAfter(event, now))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return upcoming[0] ?? null;
}
