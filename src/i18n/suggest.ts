import { isLocale, type Locale } from "./config";

/** What /api/geo answers. */
export interface GeoResponse {
  /** Two-letter country code, or null when it isn't known, such as during local development. */
  country: string | null;
}

/**
 * Countries where one of the site's languages is clearly the main one. Countries
 * with several big languages, such as Belgium, Switzerland and Canada, are left
 * out: the browser's language decides there.
 */
const COUNTRY_LOCALES: Record<string, Locale> = {
  NL: "nl",
  SR: "nl",
  DE: "de",
  AT: "de",
  LI: "de",
  FR: "fr",
  MC: "fr",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  GT: "es",
  CU: "es",
  BO: "es",
  DO: "es",
  HN: "es",
  PY: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  UY: "es",
  US: "en",
  GB: "en",
  IE: "en",
  AU: "en",
  NZ: "en",
};

/**
 * The language to offer a visitor reading the site in `current`, or null to leave
 * them be. Where they are comes first, as people often keep an English browser in
 * their own country. Otherwise their browser's first language that the site has.
 */
export function suggestLocale({
  current,
  country,
  browserLanguages,
}: {
  current: Locale;
  /** Two-letter country code from the visitor's IP address, if known. */
  country: string | null;
  /** navigator.languages, such as ["nl-NL", "en"]. */
  browserLanguages: readonly string[];
}): Locale | null {
  const fromCountry = country ? COUNTRY_LOCALES[country.toUpperCase()] : undefined;
  if (fromCountry) return fromCountry === current ? null : fromCountry;

  const fromBrowser = browserLanguages.map((tag) => tag.split("-")[0].toLowerCase()).find(isLocale);
  return fromBrowser && fromBrowser !== current ? fromBrowser : null;
}
