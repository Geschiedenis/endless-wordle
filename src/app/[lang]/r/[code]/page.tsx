import { Suspense } from "react";
import type { Metadata } from "next";
import { Flag } from "@/components/flag";
import { PageShell } from "@/components/page-shell";
import { ResultGrid } from "@/components/result-grid";
import { Button } from "@/components/ui/button";
import { isLocale, localePath, LOCALE_NAMES, type Locale } from "@/i18n/config";
import { DICTIONARIES } from "@/i18n/dictionaries";
import { format, plural } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { decodeResult } from "@/lib/game/share-code";

type Params = Promise<{ lang: string; code: string }>;

/**
 * Built per request. The whole page depends on the link, and the shared parts (top bar,
 * footer, cookie dialog) read the address, which isn't known ahead of time here.
 * Rendering it all at once also puts the title and preview image in <head>, where
 * WhatsApp, Facebook and others look for them.
 */
export const instant = false;

/**
 * Where a shared result link lands. The link's preview image shows the grid and score
 * (see opengraph-image.tsx here), and the page invites the visitor to play. These pages
 * aren't meant for search results: each is just one person's score.
 */
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang, code } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = DICTIONARIES[locale];
  const result = decodeResult(code);
  const words = result ? plural(dict.gameOver.words, result.wordsSolved) : null;
  const title = words
    ? `${format(dict.share.resultHeading, { words })} | Endless Lingle`
    : dict.share.resultTitle;
  const description = `${dict.share.resultChallenge} ${dict.home.tagline}`;
  const image = words
    ? [
        {
          url: `/${locale}/r/${code}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: format(dict.share.resultImage, { words }),
        },
      ]
    : undefined;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: "Endless Lingle",
      title,
      description,
      url: localePath(locale, `/r/${code}`),
      images: image,
    },
    twitter: { card: "summary_large_image", title, description, images: image },
  };
}

export default function ResultPage({ params }: { params: Params }) {
  return (
    <PageShell>
      {/* The page around it is built ahead of time; the result itself depends on the link. */}
      <Suspense fallback={<div className="h-64" />}>
        <Result params={params} />
      </Suspense>
    </PageShell>
  );
}

async function Result({ params }: { params: Params }) {
  const { lang, code } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = DICTIONARIES[locale];
  const result = decodeResult(code);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
      {result ? (
        <>
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flag locale={locale} />
              {dict.share.resultTitle} · {LOCALE_NAMES[locale]}
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              {format(dict.share.resultHeading, {
                words: plural(dict.gameOver.words, result.wordsSolved),
              })}
            </h1>
          </div>
          {result.words.length > 0 && (
            <div className="rounded-xl border bg-muted/30 p-5">
              <ResultGrid words={result.words} />
            </div>
          )}
          <p className="text-lg font-semibold">{dict.share.resultChallenge}</p>
        </>
      ) : (
        <p role="alert" className="text-muted-foreground">
          {dict.share.resultInvalid}
        </p>
      )}
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button asChild className="h-12 text-base font-semibold">
          <Link href="/play">{dict.howTo.playNow}</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 text-base">
          <Link href="/how-to-play">{dict.home.howToPlay}</Link>
        </Button>
      </div>
    </div>
  );
}
