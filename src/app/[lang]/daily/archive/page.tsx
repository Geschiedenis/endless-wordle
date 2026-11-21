import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ChevronRight } from "lucide-react";
import { formatDay } from "@/components/archive-format";
import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { ARCHIVE } from "@/content/archive";
import { format } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { getLocale, pageMetadata } from "@/i18n/server";
import { lastArchivedNumber } from "@/lib/game/daily";
import { archiveEntries } from "@/lib/server/daily-archive";

/** The list grows every day, so it's worked out per request (and cached per day). */
export const instant = false;

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/daily/archive", page: "archive", description: "archiveDescription" });
}

/** Every past daily word, newest first, each linking to its own page. */
export default async function ArchivePage() {
  const locale = await getLocale();
  const t = ARCHIVE[locale];
  return (
    <PageShell wide>
      <PageHeading>{t.title}</PageHeading>
      <p className="mt-2 text-muted-foreground">{t.intro}</p>
      <Suspense fallback={<div className="mt-8 h-96" />}>
        <ArchiveList />
      </Suspense>
    </PageShell>
  );
}

async function ArchiveList() {
  await connection();
  const locale = await getLocale();
  const t = ARCHIVE[locale];
  const entries = await archiveEntries(locale, lastArchivedNumber());
  if (entries.length === 0) return <p className="mt-8 text-muted-foreground">{t.empty}</p>;
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
      {entries.map(({ number, day, word }) => (
        <li key={number}>
          <Link
            href={`/daily/archive/${number}`}
            className="flex items-center justify-between gap-4 rounded-xl border surface p-4 transition-colors hover:bg-muted/60"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-sm text-muted-foreground">
                {format(t.dayTitle, { number })} · {formatDay(day, locale)}
              </span>
              <span className="text-lg font-bold tracking-[0.15em] uppercase">{word}</span>
            </span>
            <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
