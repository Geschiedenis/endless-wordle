import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { formatDay } from "@/components/archive-format";
import { DemoBoard } from "@/components/demo-board";
import { DistributionBars } from "@/components/distribution-bars";
import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { PlayCta } from "@/components/play-cta";
import { Button } from "@/components/ui/button";
import { ARCHIVE } from "@/content/archive";
import { isLocale, type Locale } from "@/i18n/config";
import { format } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { pageMetadata } from "@/i18n/server";
import { dailyDay, lastArchivedNumber } from "@/lib/game/daily";
import { dailyAnswer } from "@/lib/server/daily";
import { dailyWordStats, MIN_PLAYS_FOR_STATS } from "@/lib/server/daily-archive";

type Params = Promise<{ lang: string; number: string }>;

/** Which days exist depends on today, so these pages are built per request. */
export const instant = false;

/** The daily word's number, if that day is in the archive (over everywhere). */
function archivedNumber(raw: string): number | null {
  const number = Number(raw);
  return /^\d+$/.test(raw) && number >= 1 && number <= lastArchivedNumber() ? number : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, number: raw } = await params;
  await connection();
  const number = archivedNumber(raw);
  // Here as well as in the page: metadata is worked out before the page streams, so this
  // gives a real 404 status for days that aren't in the archive (yet).
  if (!number || !isLocale(lang)) notFound();
  const t = ARCHIVE[lang];
  const day = dailyDay(number);
  const values = { number, date: formatDay(day, lang), word: dailyAnswer(lang, day).toUpperCase() };
  const base = await pageMetadata({ path: `/daily/archive/${number}` });
  const title = `${format(t.dayMetaTitle, values)} | Endless Lingle`;
  const description = format(t.dayMetaDescription, values);
  return {
    ...base,
    title,
    description,
    openGraph: { ...base.openGraph, title, description },
    twitter: { ...base.twitter, title, description },
  };
}

/** One past daily word: the word, a link to its meaning, and how players did. */
export default async function ArchiveDayPage({ params }: { params: Params }) {
  // Checked before anything is sent, so a day that isn't in the archive gets a real 404.
  const { number: raw } = await params;
  await connection();
  if (!archivedNumber(raw)) notFound();
  return (
    <PageShell wide>
      <Suspense fallback={<div className="h-[32rem]" />}>
        <Day params={params} />
      </Suspense>
    </PageShell>
  );
}

async function Day({ params }: { params: Params }) {
  const { lang, number: raw } = await params;
  await connection();
  const number = archivedNumber(raw);
  if (!number || !isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = ARCHIVE[locale];
  const day = dailyDay(number);
  const word = dailyAnswer(locale, day);
  const stats = await dailyWordStats(locale, word);
  const last = lastArchivedNumber();
  const wiktionary = `https://${locale}.wiktionary.org/w/index.php?search=${encodeURIComponent(word)}`;

  return (
    <>
      <PageHeading backHref="/daily/archive">{format(t.dayTitle, { number })}</PageHeading>
      <p className="mt-2 text-muted-foreground">{format(t.dayIntro, { date: formatDay(day, locale) })}</p>

      <div className="demo-board mt-8 flex justify-center rounded-2xl border bg-muted/30 px-4 py-8">
        <DemoBoard rows={[{ word, states: ["correct", "correct", "correct", "correct", "correct"] }]} />
      </div>

      <section aria-labelledby="meaning" className="mt-10">
        <h2 id="meaning" className="text-2xl font-bold tracking-tight">
          {t.lookUp}
        </h2>
        <Button asChild variant="outline" className="mt-4 h-10 px-4">
          <a href={wiktionary} target="_blank" rel="noopener">
            <BookOpen aria-hidden="true" />
            {format(t.wiktionary, { word: word.toUpperCase() })}
          </a>
        </Button>
      </section>

      <section aria-labelledby="stats" className="mt-10">
        <h2 id="stats" className="text-2xl font-bold tracking-tight">
          {t.statsTitle}
        </h2>
        {stats && stats.plays >= MIN_PLAYS_FOR_STATS ? (
          <div className="mt-4 flex flex-col gap-6 rounded-2xl border bg-muted/30 p-5 sm:p-6">
            {/* No player count (and no counts in the bars) while traffic is still low:
                the rate, average and the bars' shape say enough. */}
            <dl className="grid grid-cols-2 gap-2 text-center">
              <Stat
                label={t.solvedRate}
                value={`${Math.round((stats.solved / stats.plays) * 100).toLocaleString(locale)}%`}
              />
              <Stat
                label={t.average}
                value={
                  stats.averageGuesses === null
                    ? "–"
                    : stats.averageGuesses.toLocaleString(locale, { maximumFractionDigits: 1 })
                }
              />
            </dl>
            <div>
              <h3 className="mb-3 text-sm font-medium">{t.distributionTitle}</h3>
              <DistributionBars counts={stats.distribution} locale={locale} hideCounts />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-muted-foreground">{t.noStats}</p>
        )}
      </section>

      <nav aria-label={t.all} className="mt-10 grid grid-cols-2 gap-3">
        {number > 1 ? (
          <Button asChild variant="ghost" className="h-11 justify-start text-muted-foreground hover:text-foreground">
            <Link href={`/daily/archive/${number - 1}`}>
              <ArrowLeft aria-hidden="true" />
              {t.previous}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {number < last && (
          <Button asChild variant="ghost" className="col-start-2 h-11 justify-end text-muted-foreground hover:text-foreground">
            <Link href={`/daily/archive/${number + 1}`}>
              {t.next}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        )}
      </nav>

      <PlayCta label={t.playToday} note={t.playTodayNote} href="/daily" />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col-reverse rounded-lg bg-muted px-1 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}
