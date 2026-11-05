import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/link";
import type { Metadata } from "next";
import { LOCALE_NAMES, SITE_URL, localePath } from "@/i18n/config";
import { getDictionary, getLocale, pageMetadata } from "@/i18n/server";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/" });
}

export default async function LandingPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  /** Describes the site as a free browser game, for search results. */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Endless Wordle",
    url: `${SITE_URL}${localePath(locale, "/")}`,
    description: dict.meta.description,
    inLanguage: locale,
    availableLanguage: Object.values(LOCALE_NAMES),
    applicationCategory: "GameApplication",
    genre: "Word game",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <div className="flex min-h-dvh flex-1 flex-col px-4">
      <script
        type="application/ld+json"
        // Escaping < keeps the JSON from ever closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      {/* The page shows the big logo itself, so the bar leaves its middle empty. */}
      <TopBar showLogo={false} />
      <main className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
        <Logo />
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Endless Wordle</h1>
        <p className="mt-3 max-w-sm text-balance text-muted-foreground">{dict.home.tagline}</p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Button asChild className="h-12 text-base font-semibold">
            <Link href="/play">{dict.home.play}</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 text-base">
            <Link href="/how-to-play">{dict.home.howToPlay}</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
