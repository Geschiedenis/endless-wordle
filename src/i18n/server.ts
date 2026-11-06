import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import type { Metadata } from "next";
import { isLocale, languageAlternates, LOCALES, localePath, OG_LOCALES, type Locale } from "./config";
import { DICTIONARIES, type Dictionary } from "./dictionaries";
import { format } from "./format";

/** The page's language, from the [lang] segment. Unknown languages are a 404. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()];
}

type Meta = Dictionary["meta"];

interface PageMetadataOptions {
  /** The page's path without a language, such as "/play". */
  path: string;
  /** Page name for the title. Leave out for the home page, which uses its own title. */
  page?: keyof Meta;
  /** Falls back to the site's general description. */
  description?: "playDescription" | "howToPlayDescription" | "faqDescription" | "tipsDescription";
  /** False for account pages, which shouldn't appear in search results. */
  index?: boolean;
}

/**
 * Metadata for a page, in the page's language: title, description, the page's
 * address in every language, and the details link previews use.
 */
export async function pageMetadata({ path, page, description, index = true }: PageMetadataOptions): Promise<Metadata> {
  const locale = await getLocale();
  const meta = DICTIONARIES[locale].meta;
  const title = page ? format(meta.pageTitle, { page: meta[page] }) : meta.homeTitle;
  const text = description ? meta[description] : meta.description;
  const url = localePath(locale, path);
  // The language's preview image, from app/[lang]/opengraph-image.tsx. Set here
  // because a page's own openGraph settings replace the one it would inherit.
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: meta.imageAlt };
  return {
    title,
    description: text,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: "Endless Lingle",
      title,
      description: text,
      url,
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((other) => other !== locale).map((other) => OG_LOCALES[other]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description: text, images: [image] },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}
