import type { MetadataRoute } from "next";
import { languageAlternates, LOCALES, localePath, PUBLIC_PATHS, SITE_URL } from "@/i18n/config";

/** Every public page in every language, each listing its other languages. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([locale, url]) => [locale, `${SITE_URL}${url}`]),
    );
    return LOCALES.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      changeFrequency: path === "/privacy" || path === "/terms" ? ("yearly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/play" ? 0.9 : 0.5,
      alternates: { languages },
    }));
  });
}
