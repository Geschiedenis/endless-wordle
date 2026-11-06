"use client";

import { Flag } from "@/components/flag";
import { LOCALE_NAMES, LOCALES, localePath, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/remember";
import { HOVER_ZOOM } from "@/lib/hover-zoom";
import { cn } from "@/lib/utils";

/**
 * A card per language, linking to that language's home page. Plain links, so search
 * engines follow them to each version of the site. Like the flag menu, a click
 * remembers the choice and loads the page fresh in the new language.
 */
export function LanguageCards({ current, names }: { current: Locale; names: Record<Locale, string> }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {LOCALES.map((locale) => (
        <li key={locale} className={cn(locale === "es" && "col-span-2 sm:col-span-1")}>
          <a
            href={localePath(locale, "/")}
            hrefLang={locale}
            lang={locale}
            aria-current={locale === current ? "page" : undefined}
            onClick={() => rememberLocale(locale)}
            className={cn(
              "flex h-full flex-col items-center gap-2 rounded-xl border bg-muted/30 px-3 py-4 text-center focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:border-primary",
              HOVER_ZOOM,
            )}
          >
            <Flag locale={locale} className="h-6 w-8 rounded-[4px]" />
            <span className="font-semibold">{LOCALE_NAMES[locale]}</span>
            {/* The name in the page's own language, unless it's the same word. */}
            {names[locale] !== LOCALE_NAMES[locale] && (
              <span lang={current} className="text-xs text-muted-foreground">
                {names[locale]}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
