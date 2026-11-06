import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  BONUS_ROW,
  DemoBoard,
  DemoTile,
  EMPTY_ROW,
  type DemoRow,
} from "@/components/demo-board";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { format, rich } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { getDictionary, getLocale, pageMetadata } from "@/i18n/server";
import { BASE_GUESSES, MAX_BONUS_GUESSES } from "@/lib/game/constants";
import { HOW_TO_PLAY_EXAMPLES as EXAMPLES } from "@/lib/game/examples";
import { computeFeedback } from "@/lib/game/feedback";
import type { LetterFeedback } from "@/lib/game/types";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    path: "/how-to-play",
    page: "howToPlay",
    description: "howToPlayDescription",
  });
}

const EMPTY = EMPTY_ROW;
const BONUS = BONUS_ROW;

export default async function HowToPlayPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.howTo;
  const example = EXAMPLES[locale];
  const scored = (word: string): DemoRow => ({
    word,
    states: computeFeedback(word, example.answer),
  });
  const first = scored(example.first);
  const solved = scored(example.answer);
  const upper = (word: string) => word.toUpperCase();

  /** One letter of the first guess per colour, for the legend. */
  const letterWith = (state: LetterFeedback) =>
    example.first[first.states!.indexOf(state)];

  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.intro}</p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step
          number={1}
          title={t.step1Title}
          body={<p>{format(t.step1Body, { guesses: BASE_GUESSES })}</p>}
        >
          <Screen label={format(t.step1Image, { word: upper(example.first) })}>
            <DemoBoard rows={[{ word: example.first }, EMPTY, EMPTY]} />
          </Screen>
        </Step>

        <Step number={2} title={t.step2Title} body={<p>{t.step2Body}</p>}>
          <Screen label={format(t.step2Image, { word: upper(example.first) })}>
            <DemoBoard rows={[first]} />
          </Screen>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <Legend state="correct" letter={letterWith("correct")}>
              <ColourName normal={t.green} highContrast={t.orange} />{" "}
              {t.greenMeaning}
            </Legend>
            <Legend state="present" letter={letterWith("present")}>
              <ColourName normal={t.yellow} highContrast={t.blue} />{" "}
              {t.yellowMeaning}
            </Legend>
            <Legend state="absent" letter={letterWith("absent")}>
              <strong>{t.grey}</strong> {t.greyMeaning}
            </Legend>
          </ul>
        </Step>

        <Step number={3} title={t.step3Title} body={<p>{t.step3Body}</p>}>
          <Screen
            label={format(t.step3Image, {
              words: [example.first, example.second, example.answer]
                .map(upper)
                .join(", "),
            })}
          >
            <DemoBoard
              rows={[
                first,
                scored(example.second),
                solved,
                EMPTY,
                EMPTY,
                EMPTY,
              ]}
            />
          </Screen>
        </Step>

        <Step
          number={4}
          title={t.step4Title}
          body={
            <p>
              {format(t.step4Body, {
                max: MAX_BONUS_GUESSES,
                base: BASE_GUESSES,
                total: BASE_GUESSES + 3,
              })}
            </p>
          }
        >
          <Screen label={t.step4Image}>
            <DemoBoard
              rows={[
                EMPTY,
                EMPTY,
                EMPTY,
                EMPTY,
                EMPTY,
                EMPTY,
                BONUS,
                BONUS,
                BONUS,
              ]}
            />
          </Screen>
        </Step>

        <Step number={5} title={t.step5Title} body={<p>{t.step5Body}</p>}>
          <Screen label={format(t.step5Image, { word: upper(example.answer) })}>
            <div className="game-word">
              <p className="word-divider">
                {format(dict.game.word, { number: 1 })}
              </p>
              <DemoBoard rows={[solved]} />
              <p className="word-divider">
                {format(dict.game.word, { number: 2 })}
              </p>
              <DemoBoard rows={[EMPTY, EMPTY]} />
            </div>
          </Screen>
        </Step>

        <Step
          number={6}
          title={t.step6Title}
          body={
            <p>
              {rich(t.step6Body, {
                login: <Link href="/login">{t.step6Login}</Link>,
              })}
            </p>
          }
        >
          <Screen label={format(t.step6Image, { word: upper(example.lost) })}>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-sm text-muted-foreground">
                {dict.gameOver.wordWas}
              </p>
              <p className="text-2xl font-bold tracking-[0.2em] uppercase">
                {example.lost}
              </p>
              <p className="mt-1">
                {rich(dict.gameOver.youSolved, {
                  words: (
                    <strong>
                      {format(dict.gameOver.words.other, { count: 4 })}
                    </strong>
                  ),
                })}
              </p>
            </div>
          </Screen>
        </Step>
      </ol>

      <section className="mt-12 flex flex-col items-center gap-2 rounded-xl border bg-muted/40 px-4 py-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t.readyTitle}</h2>
        <p className="text-muted-foreground">{t.readyBody}</p>
        <Button
          asChild
          className="mt-3 h-12 w-full max-w-xs text-base font-semibold"
        >
          <Link href="/play">{t.playNow}</Link>
        </Button>
        <p className="mt-2 text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-2">
          {rich(t.moreTips, {
            tips: <Link href="/tips">{t.moreTipsLink}</Link>,
          })}
        </p>
      </section>
    </PageShell>
  );
}

/** A step as a card, like the tips: number, title and text, then the example below. */
function Step({
  number,
  title,
  body,
  children,
}: {
  number: number;
  title: string;
  body: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="rounded-xl border bg-muted/30 p-5 [&_a]:underline [&_a]:underline-offset-2">
      <div className="flex gap-4">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
        >
          {number}
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold">{title}</h2>
          {body}
        </div>
      </div>
      {children}
    </li>
  );
}

/** Frames an example like a screenshot of the game, the same way as on the tips page. */
function Screen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="demo-board demo-board-small mt-4 flex justify-center rounded-lg bg-background/60 px-4 py-5"
    >
      {children}
    </div>
  );
}

/** High-contrast mode swaps the colours, so the names swap with them. */
function ColourName({
  normal,
  highContrast,
}: {
  normal: string;
  highContrast: string;
}) {
  return (
    <strong>
      <span className="hc-hide">{normal}</span>
      <span className="hc-show">{highContrast}</span>
    </strong>
  );
}

function Legend({
  state,
  letter,
  children,
}: {
  state: LetterFeedback;
  letter: string;
  children: ReactNode;
}) {
  return (
    <li className="demo-board demo-board-small flex items-center gap-3">
      <span aria-hidden="true">
        <DemoTile letter={letter} state={state} />
      </span>
      <span>{children}</span>
    </li>
  );
}
