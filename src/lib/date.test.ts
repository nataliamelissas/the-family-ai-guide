import { describe, expect, it } from "vitest";
import { formatLongDate, formatShortDate, toDateBadge } from "@/lib/date";

const EVENT_DATE = "2026-09-11";

describe("formatLongDate", () => {
  /**
   * Regression: `new Date("2026-09-11")` parses as UTC midnight, which renders
   * as September 10 in negative-offset timezones like Utah's. Date-only values
   * must stay on the calendar day they name, in every timezone.
   */
  it("keeps a date-only value on its calendar day", () => {
    expect(formatLongDate(EVENT_DATE)).toBe("Friday, September 11, 2026");
  });

  it("returns an empty string for an unparseable value", () => {
    expect(formatLongDate("not-a-date")).toBe("");
  });
});

describe("formatShortDate", () => {
  it("formats a date-only value without a weekday", () => {
    expect(formatShortDate(EVENT_DATE)).toBe("September 11, 2026");
  });

  it("formats a full ISO timestamp", () => {
    expect(formatShortDate("2026-07-03T12:00:00.000Z")).toBe("July 3, 2026");
  });
});

describe("toDateBadge", () => {
  it("splits a date into month and day parts", () => {
    expect(toDateBadge(EVENT_DATE)).toEqual({ month: "Sep", day: "11" });
  });
});
