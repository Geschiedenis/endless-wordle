"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { Flag } from "@/components/flag";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LOCALE_COOKIE, localePath, splitLocale, type Locale } from "@/i18n/config";
import { DICTIONARIES } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/provider";
import { rememberLocale } from "@/i18n/remember";
import { suggestLocale, type GeoResponse } from "@/i18n/suggest";
import { apiRequest } from "@/lib/game/api-client";
import { getConsent, subscribeToConsent } from "@/lib/consent";

/**
 * Offers the site in the visitor's own language, worked out from their country or
 * their browser. Only for visitors who haven't chosen a language yet, and only once
 * they've answered the cookie question, so the two don't pile up. Either button
 * saves a choice, so it's asked once.
 */
export function LanguageSuggestion() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    if (hasChosenLanguage()) return;
    let cancelled = false;
    let started = false;

    const check = async () => {
      if (started || !getConsent()) return;
      started = true;
      const response = await apiRequest<GeoResponse>("/api/geo");
      const country = response.ok ? response.data.country : null;
      const next = suggestLocale({ current: locale, country, browserLanguages: navigator.languages });
      if (!cancelled && !hasChosenLanguage()) setSuggested(next);
    };

    void check();
    const unsubscribe = subscribeToConsent(() => void check());
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [locale]);

  if (!suggested) return null;
  const text = DICTIONARIES[suggested].suggestion;

  function switchLanguage(next: Locale) {
    rememberLocale(next);
    // A full page load, like the flag menu: everything starts over in the new language.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${localePath(next, splitLocale(pathname).path)}${window.location.search}`);
  }

  function stay() {
    rememberLocale(locale);
    setSuggested(null);
  }

  return (
    <aside
      aria-label={text.title}
      lang={suggested}
      className="slide-up fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 sm:inset-x-auto sm:right-4 sm:w-96"
    >
      <Alert className="shadow-lg">
        <Languages aria-hidden="true" />
        <AlertTitle className="line-clamp-none">{text.title}</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          <p>{text.body}</p>
          <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
            <Button onClick={() => switchLanguage(suggested)} className="h-10 px-4">
              <Flag locale={suggested} className="h-[15px] w-5 rounded-[3px]" />
              {text.switch}
            </Button>
            <Button variant="outline" lang={locale} onClick={stay} className="h-10 px-4 text-foreground">
              {DICTIONARIES[locale].suggestion.stay}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </aside>
  );
}

function hasChosenLanguage(): boolean {
  return document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${LOCALE_COOKIE}=`));
}
