/**
 * Languages the site and the game come in. English lives at the plain paths
 * (/play), the others under their code (/nl/play). Shared by server and browser.
 */
export const LOCALES = ["en", "nl", "de", "fr", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Pages search engines should find, for the sitemap. Account pages are left out. */
export const PUBLIC_PATHS = ["/", "/play", "/daily", "/how-to-play", "/tips", "/faq", "/privacy", "/terms"] as const;

export const DEFAULT_LOCALE: Locale = "en";

/** The live site, for links that leave the page: search results, shared links and the sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://endlesslingle.com").replace(/\/$/, "");

/** Open Graph wants a region with the language. */
export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  nl: "nl_NL",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
};

/** Remembers the visitor's choice, so plain paths send them to their language. */
export const LOCALE_COOKIE = "ew-lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Each language's own name for itself, as shown in the language menu. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** The path in a language: localePath("nl", "/play") is "/nl/play". */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Splits "/nl/play" into nl and "/play". Paths without a language are English. */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) return { locale: first, path: `/${rest.join("/")}` };
  return { locale: null, path: pathname };
}

/** The same page in every language, so search engines show each visitor theirs. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, localePath(locale, path)])),
    "x-default": localePath(DEFAULT_LOCALE, path),
  };
}
