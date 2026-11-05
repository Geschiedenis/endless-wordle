"use client";

import { usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { Flag } from "@/components/flag";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LOCALE_NAMES,
  LOCALES,
  localePath,
  splitLocale,
  type Locale,
} from "@/i18n/config";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { rememberLocale } from "@/i18n/remember";

/**
 * Switches the site's language and the game's word list. Remembers the choice in a
 * cookie, then reloads the same page in the new language. The game page asks before
 * replacing a game already under way in another language.
 */
export function LanguageMenu() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();

  function choose(next: Locale) {
    if (next === locale) return;
    rememberLocale(next);
    // A full page load on purpose: everything, including the game, starts over in the new language.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${localePath(next, splitLocale(pathname).path)}${window.location.search}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-1 px-2"
          aria-label={format(dict.header.language, { language: LOCALE_NAMES[locale] })}
        >
          <Flag locale={locale} />
          <ChevronDown aria-hidden="true" className="size-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {LOCALES.map((option) => (
          <DropdownMenuItem
            key={option}
            lang={option}
            onSelect={() => choose(option)}
            className="gap-2.5 py-2"
            aria-current={option === locale ? "true" : undefined}
          >
            <Flag locale={option} />
            <span className="flex-1">{LOCALE_NAMES[option]}</span>
            {option === locale && <Check aria-hidden="true" className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
