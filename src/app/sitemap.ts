import type { MetadataRoute } from "next";
import { languageAlternates, LOCALES, localePath, PUBLIC_PATHS, SITE_URL } from "@/i18n/config";
import { lastArchivedNumber } from "@/lib/game/daily";

/**
 * Every public page in every language, each listing its other languages, plus a page
 * per past daily word. Those are listed as of when the sitemap was made; newer days are
 * found through the archive page, which links to all of them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const archiveDays = Array.from({ length: lastArchivedNumber() }, (_, i) => `/daily/archive/${i + 1}`);
  return [...PUBLIC_PATHS, ...archiveDays].flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([locale, url]) => [locale, `${SITE_URL}${url}`]),
    );
    return LOCALES.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      changeFrequency:
        path === "/daily"
          ? ("daily" as const)
          : path === "/privacy" || path === "/terms" || path.startsWith("/daily/archive/")
            ? ("yearly" as const)
            : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/play" || path === "/daily" ? 0.9 : 0.5,
      alternates: { languages },
    }));
  });
}
