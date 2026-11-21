import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Infinity as InfinityIcon, Languages, Mail, Zap } from "lucide-react";
import { MiniCrossCard } from "@/components/mini-cross-card";
import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { PlayCta } from "@/components/play-cta";
import { Button } from "@/components/ui/button";
import { ABOUT } from "@/content/about";
import { format } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { getDictionary, getLocale, pageMetadata } from "@/i18n/server";
import { BASE_GUESSES, MAX_BONUS_GUESSES } from "@/lib/game/constants";
import { HOVER_ZOOM } from "@/lib/hover-zoom";
import { LEGAL } from "@/lib/legal";
import { cn } from "@/lib/utils";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/about", page: "about", description: "aboutDescription" });
}

const SECTION_TITLE = "text-2xl font-bold tracking-tight";

/** One icon per item in ABOUT.different, in order. Infinity, languages and lightning match the home page's features. */
const DIFFERENT_ICONS = [InfinityIcon, CalendarDays, Languages, Zap];

/** What the game is, what makes it different and who makes it. */
export default async function AboutPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = ABOUT[locale];
  const numbers = { base: BASE_GUESSES, max: MAX_BONUS_GUESSES };

  return (
    <PageShell wide>
      <PageHeading>{t.title}</PageHeading>
      <p className="mt-2 text-muted-foreground">{format(t.intro, numbers)}</p>

      <section aria-labelledby="different" className="mt-14 sm:mt-16">
        <h2 id="different" className={SECTION_TITLE}>
          {t.differentTitle}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {t.different.map(({ title, body }, index) => {
            const Icon = DIFFERENT_ICONS[index];
            return (
              <li key={title} className={cn("flex gap-4 rounded-xl border surface p-5", HOVER_ZOOM)}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{format(body, numbers)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="maker" className="mt-14 sm:mt-16">
        <h2 id="maker" className={SECTION_TITLE}>
          {t.makerTitle}
        </h2>
        {/* A profile card: photo, name and role, a few words, and a way to get in touch. */}
        <div className="mt-6 flex flex-col gap-6 rounded-2xl border surface p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <Image
            src="/about/bastiaan.jpg"
            alt={LEGAL.operator}
            width={320}
            height={320}
            className="size-32 shrink-0 rounded-2xl object-cover shadow-md sm:size-40"
          />
          <div className="flex flex-col items-start gap-4">
            <p className="text-xl font-semibold">{LEGAL.operator}</p>
            <p className="text-muted-foreground">
              {format(t.makerBody, { operator: LEGAL.operator, country: t.country })}
            </p>
            <Button asChild variant="outline" className="h-10 px-4">
              <Link href="/contact">
                <Mail aria-hidden="true" />
                {t.contactCta}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-14 sm:mt-16">
        <MiniCrossCard locale={locale} />
      </div>

      <PlayCta label={dict.howTo.playNow} note={dict.howTo.readyBody} />
    </PageShell>
  );
}
