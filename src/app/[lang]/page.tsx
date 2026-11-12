import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronDown, Gift, Infinity as InfinityIcon, Languages, Play, Zap } from "lucide-react";
import { BONUS_ROW, DemoBoard, type DemoRow } from "@/components/demo-board";
import { HeroFan } from "@/components/hero-fan";
import { WIDE_CONTENT } from "@/components/page-shell";
import { LanguageCards } from "@/components/language-cards";
import { SiteFooter } from "@/components/site-footer";
import { TopBar } from "@/components/top-bar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/content/faq";
import { HOME, HOME_FAQ_ITEMS } from "@/content/home";
import { LOCALE_NAMES, SITE_URL, localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { format, rich } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { getDictionary, getLocale, pageMetadata } from "@/i18n/server";
import { BASE_GUESSES, MAX_BONUS_GUESSES } from "@/lib/game/constants";
import { HOW_TO_PLAY_EXAMPLES } from "@/lib/game/examples";
import { computeFeedback } from "@/lib/game/feedback";
import { HOVER_ZOOM } from "@/lib/hover-zoom";
import { cn } from "@/lib/utils";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/" });
}

export default async function LandingPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const home = HOME[locale];

  /** Describes the site as a free browser game, for search results. */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Endless Lingle",
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
    <div className="flex flex-1 flex-col px-4">
      <script
        type="application/ld+json"
        // Escaping < keeps the JSON from ever closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <TopBar logo="center" className="z-20" />
      <main className="flex flex-col">
        {/* The first screen, less the top bar. svh, not dvh, so it doesn't resize while a phone's address bar hides. */}
        <section className="relative -mx-4 flex min-h-[calc(100svh-3rem)] flex-col items-center justify-center px-4 pb-40 text-center">
          {/* Behind the rest of the first screen. */}
          <HeroFan />
          <div className="relative z-10 flex w-full flex-col items-center">
            <h1 className="hero-rise text-4xl font-bold tracking-tight sm:text-5xl">Endless Lingle</h1>
            <p className="hero-fade mt-3 max-w-sm text-balance text-muted-foreground">{dict.home.tagline}</p>
            <div className="hero-fade mt-8 flex w-full max-w-xs flex-col gap-3 [--delay:240ms]">
              <Button asChild className="h-12 text-base font-semibold">
                <Link href="/play">
                  <Play aria-hidden="true" className="fill-current" />
                  {dict.home.play}
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 text-base">
                <Link href="/daily">
                  <CalendarDays aria-hidden="true" />
                  {dict.home.daily}
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 text-base">
                <Link href="/how-to-play">
                  <BookOpen aria-hidden="true" />
                  {dict.home.howToPlay}
                </Link>
              </Button>
            </div>
          </div>
          {/* The fan fades into the sections below, with a link down to them on top. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-background via-background/90 to-transparent"
          />
          <a
            href="#how-it-works"
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-0.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {home.more}
            <ChevronDown aria-hidden="true" className="size-4 motion-safe:animate-bounce" />
          </a>
        </section>

        <div className={cn("mx-auto flex w-full flex-col gap-20 pt-24 pb-16 sm:gap-28 sm:pt-32", WIDE_CONTENT)}>
          <HowItWorks locale={locale} dict={dict} />
          <Features locale={locale} />
          <MiniCross locale={locale} />
          <section aria-labelledby="languages">
            <SectionHeading id="languages" intro={home.languagesIntro}>
              {home.languagesTitle}
            </SectionHeading>
            <div className="mt-8">
              <LanguageCards current={locale} names={home.languageNames} />
            </div>
          </section>
          <HomeFaq locale={locale} />
          <section aria-labelledby="ready" className="flex flex-col items-center text-center">
            <SectionHeading id="ready" intro={dict.howTo.readyBody}>
              {dict.howTo.readyTitle}
            </SectionHeading>
            <Button asChild className="mt-6 h-12 w-full max-w-xs text-base font-semibold">
              <Link href="/play">
                <Play aria-hidden="true" className="fill-current" />
                {dict.howTo.playNow}
              </Link>
            </Button>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SectionHeading({ id, intro, children }: { id: string; intro?: string; children: ReactNode }) {
  return (
    <div className="text-center">
      <h2 id={id} className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
        {children}
      </h2>
      {intro && <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">{intro}</p>}
    </div>
  );
}

/** Three steps, each with a small example drawn with the game's own tiles. */
function HowItWorks({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const home = HOME[locale];
  const { first, second, answer } = HOW_TO_PLAY_EXAMPLES[locale];
  const scored = (word: string): DemoRow => ({ word, states: computeFeedback(word, answer) });
  const visuals = [
    <DemoBoard key="guess" rows={[scored(first), scored(second), scored(answer)]} />,
    <div key="bonus" className="flex flex-col items-center gap-3">
      <StatBox label={dict.stats.guessesLeft}>
        {BASE_GUESSES}
        <span className="ml-1 text-base text-primary">+{MAX_BONUS_GUESSES}</span>
      </StatBox>
      <DemoBoard rows={Array.from({ length: 2 }, () => BONUS_ROW)} />
    </div>,
    <div key="streak" className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <StatBox label={dict.stats.word}>13</StatBox>
        <StatBox label={dict.stats.streak}>12</StatBox>
      </div>
      <DemoBoard rows={[scored(answer)]} />
    </div>,
  ];

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-6">
      <SectionHeading id="how-title" intro={home.howIntro}>
        {home.howTitle}
      </SectionHeading>
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {home.steps.map(({ title, body }, index) => (
          <li key={title} className={cn("flex flex-col rounded-xl border bg-muted/30 p-5", HOVER_ZOOM)}>
            <span
              aria-hidden="true"
              className="mb-3 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
            >
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1.5 text-muted-foreground">
              {format(body, { base: BASE_GUESSES, max: MAX_BONUS_GUESSES })}
            </p>
            {/* The text explains each step, so the example is decoration for screen readers.
                Pushed to the bottom, so the examples line up across the cards. */}
            <div className="mt-auto pt-5">
              <div
                aria-hidden="true"
                className="demo-board demo-board-small flex min-h-44 items-center justify-center rounded-lg bg-background/60 p-4"
              >
                {visuals[index]}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StatBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-muted px-3 py-1.5">
      <span className="text-xl font-bold tabular-nums">{children}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

const FEATURE_ICONS = [InfinityIcon, Gift, Languages, Zap];

function Features({ locale }: { locale: Locale }) {
  const home = HOME[locale];
  return (
    <section aria-labelledby="features">
      <SectionHeading id="features">{home.featuresTitle}</SectionHeading>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {home.features.map(({ title, body }, index) => {
          const Icon = FEATURE_ICONS[index];
          return (
            <li key={title} className={cn("flex gap-4 rounded-xl border bg-muted/30 p-5", HOVER_ZOOM)}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{format(body, { max: MAX_BONUS_GUESSES })}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * The picture on the Endless Mini Cross card: an empty mini crossword the way that
 * game shows one, with the first word across highlighted. "#" is a black square, and
 * the numbers are the clue numbers.
 */
const MINI_CROSS_GRID = [
  ["1", "2", "3", "4", ""],
  ["5", "", "", "", "#"],
  ["6", "", "", "", "7"],
  ["#", "8", "", "", ""],
  ["9", "", "", "", ""],
];

/** Promotes our other game, Endless Mini Cross. */
function MiniCross({ locale }: { locale: Locale }) {
  const { title, body, cta, url, imageLabel } = HOME[locale].miniCross;
  return (
    <section aria-labelledby="minicross" className="w-full">
      <div className={cn("flex flex-col overflow-hidden rounded-2xl border bg-muted/30 shadow-sm md:flex-row", HOVER_ZOOM)}>
        <div className="flex items-center justify-center bg-muted/50 p-8 md:w-2/5">
          <div role="img" aria-label={imageLabel} className="grid grid-cols-5 gap-1 rounded-xl bg-[#2b2b2f] p-1.5">
            {MINI_CROSS_GRID.map((cells, row) =>
              cells.map((cell, column) => (
                <span
                  key={`${row}-${column}`}
                  className={cn(
                    "relative size-11 rounded-md md:size-10",
                    cell === "#"
                      ? "bg-[#0c0c0c]"
                      : row === 0
                        ? // The selected word.
                          "bg-[#d4d4d8] shadow-[0_2px_0_#a1a1aa]"
                        : "bg-white shadow-[0_2px_0_#a1a1aa]",
                  )}
                >
                  {cell !== "#" && cell && (
                    <span className="absolute top-1 left-1.5 text-[11px] leading-none font-bold text-[#18181b]">
                      {cell}
                    </span>
                  )}
                </span>
              )),
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-3 p-6 sm:p-8">
          <h2 id="minicross" className="text-2xl font-bold tracking-tight text-balance">
            {title}
          </h2>
          <p className="text-muted-foreground">{body}</p>
          <Button asChild className="mt-2 h-11 px-5 text-base font-semibold">
            <a href={url} target="_blank" rel="noopener">
              {cta}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

/** A few questions from the FAQ page, laid out the same way, with a link to the rest. */
function HomeFaq({ locale }: { locale: Locale }) {
  const home = HOME[locale];
  const faq = FAQ[locale];
  const links = {
    howToPlay: <Link href="/how-to-play">{faq.links.howToPlay}</Link>,
    tips: <Link href="/tips">{faq.links.tips}</Link>,
    privacy: <Link href="/privacy">{faq.links.privacy}</Link>,
  };
  return (
    <section aria-labelledby="faq">
      <SectionHeading id="faq">{home.faqTitle}</SectionHeading>
      {/* Answers stay in the page while closed, so search engines still find them. */}
      <Accordion type="multiple" className="mt-8 flex flex-col gap-3 [&_a]:underline [&_a]:underline-offset-2">
        {HOME_FAQ_ITEMS.map((index) => {
          const { question, answer } = faq.items[index];
          return (
            <AccordionItem
              key={question}
              value={`q${index}`}
              className="overflow-hidden rounded-xl border bg-muted/30 transition-colors last:border-b data-[state=open]:bg-muted/50"
            >
              <AccordionTrigger className="items-center px-5 py-4 text-base font-semibold hover:bg-muted/50 hover:no-underline focus-visible:ring-inset">
                {question}
              </AccordionTrigger>
              <AccordionContent forceMount className="px-5 pt-0 pb-5 text-base text-muted-foreground">
                {rich(answer, links)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <div className="mt-5 text-center">
        <Button asChild variant="outline" className="h-10 px-4">
          <Link href="/faq">
            {home.faqAll}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
