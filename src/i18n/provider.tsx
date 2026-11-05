"use client";

import { useParams } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "./config";
import { DICTIONARIES } from "./dictionaries";

/**
 * The page's language and text, for client components. Read from the [lang] route
 * parameter rather than a React context: parts of a page that render later, such as
 * the contents of a Suspense boundary, don't always see a context set in the layout.
 */
export function useI18n() {
  const { lang } = useParams<{ lang?: string }>();
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return { locale, dict: DICTIONARIES[locale] };
}
