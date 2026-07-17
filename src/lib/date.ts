const LOCALE = "en-US";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const LONG_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const SHORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Date-only strings ("2026-09-11") are parsed by `new Date()` as UTC midnight,
 * which renders as the previous day in negative-offset timezones like Utah's.
 * Constructing from parts keeps the date local and correct.
 */
function parseDate(value: string): Date {
  const dateOnlyMatch = DATE_ONLY_PATTERN.exec(value);
  if (!dateOnlyMatch) {
    return new Date(value);
  }

  const [, year, month, day] = dateOnlyMatch;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function format(value: string, options: Intl.DateTimeFormatOptions): string {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(LOCALE, options).format(date);
}

/** e.g. "Friday, September 11, 2026". Used for events. */
export function formatLongDate(value: string): string {
  return format(value, LONG_DATE_OPTIONS);
}

/** e.g. "September 11, 2026". Used for posts and notes. */
export function formatShortDate(value: string): string {
  return format(value, SHORT_DATE_OPTIONS);
}

export interface DateBadge {
  month: string;
  day: string;
}

/** e.g. { month: "Sep", day: "11" }. Used for the event date badge. */
export function toDateBadge(value: string): DateBadge {
  return {
    month: format(value, { month: "short" }),
    day: format(value, { day: "numeric" }),
  };
}
