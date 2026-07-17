type ClassNameValue = string | false | null | undefined;

/** Joins conditional CSS class names, dropping falsy values. */
export function classNames(...values: ClassNameValue[]): string {
  return values.filter(Boolean).join(" ");
}
