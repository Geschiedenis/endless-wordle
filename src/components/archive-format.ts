/** The day of a daily word as the language writes it, such as "18 November 2026". */
export function formatDay(day: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    Date.parse(`${day}T00:00:00Z`),
  );
}
