import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hourglass } from "lucide-react";
import {
  BONUS_ROW,
  DemoBoard,
  EMPTY_ROW,
  type DemoRow,
} from "@/components/demo-board";
import { PageShell } from "@/components/page-shell";
import { PlayCta } from "@/components/play-cta";
import { PageHeading } from "@/components/page-heading";
import { TIPS } from "@/content/tips";
import type { Locale } from "@/i18n/config";
import { getDictionary, getLocale, pageMetadata } from "@/i18n/server";
import { BASE_GUESSES, MAX_BONUS_GUESSES } from "@/lib/game/constants";
import { TIP_EXAMPLES } from "@/lib/game/examples";
import { computeFeedback } from "@/lib/game/feedback";
import { keyStatuses } from "@/lib/game/keyboard";
import { LANGUAGES } from "@/lib/game/languages";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    path: "/tips",
    page: "tips",
    description: "tipsDescription",
  });
}

export default async function TipsPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const tips = TIPS[locale];
  const visuals = tipVisuals(locale, dict.stats.guessesLeft);

  return (
    <PageShell wide>
      <PageHeading>{tips.title}</PageHeading>
      <p className="mt-2 text-muted-foreground">{tips.intro}</p>

      <ol className="mt-8 flex flex-col gap-4">
        {tips.items.map(({ title, body }, index) => (
          <li key={title} className="rounded-xl border bg-muted/30 p-5">
            <div className="flex flex-col gap-1.5">
              <span
                aria-hidden="true"
                className="mb-1.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
              >
                {index + 1}
              </span>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p>{body}</p>
            </div>
            {visuals[index] && (
              // The text explains each tip, so the example is decoration for screen readers.
              <div
                aria-hidden="true"
                className="demo-board demo-board-small mt-4 flex justify-center rounded-lg bg-background/60 px-4 py-5"
              >
                {visuals[index]}
              </div>
            )}
          </li>
        ))}
      </ol>

      <PlayCta label={dict.howTo.playNow} note={dict.howTo.readyBody} />
    </PageShell>
  );
}

/**
 * One example per tip, in the same order as the tips. Words come from the language's
 * own lists (see TIP_EXAMPLES), scored by the game's own rules.
 */
function tipVisuals(locale: Locale, guessesLeftLabel: string): ReactNode[] {
  const { answer, weak, explore, mover, ending, double } = TIP_EXAMPLES[locale];
  const starter = TIPS[locale].starters[0];
  const scored = (word: string): DemoRow => ({
    word,
    states: computeFeedback(word, answer),
  });
  const keys = keyStatuses(
    [weak, explore].map((word) => ({
      word,
      feedback: computeFeedback(word, answer),
    })),
  );

  return [
    // 1. Start with common letters: the suggested starter, scored.
    <DemoBoard key="starter" rows={[scored(starter)]} />,
    // 2. Explore: a weak first guess, then five new letters that find more.
    <DemoBoard key="explore" rows={[scored(weak), scored(explore)]} />,
    // 3. Move yellow letters: a yellow letter turns green in a new spot.
    <DemoBoard key="mover" rows={[scored(explore), scored(mover)]} />,
    // 4. Letters can repeat.
    <DemoBoard
      key="double"
      rows={[
        {
          word: double,
          states: ["correct", "correct", "correct", "correct", "correct"],
        },
      ]}
    />,
    // 5. Common endings: the ending lit up.
    <DemoBoard
      key="ending"
      rows={[
        {
          word: ending,
          states: ["typed", "typed", "typed", "correct", "correct"],
        },
      ]}
    />,
    // 6. Bonus: a full bank of bonus rows, counted as in the game's stats bar.
    <div key="bonus" className="flex items-center gap-5">
      <div className="flex flex-col items-center rounded-lg bg-muted px-4 py-2">
        <span className="text-2xl font-bold tabular-nums">
          {BASE_GUESSES}
          <span className="ml-1 text-base text-primary">
            +{MAX_BONUS_GUESSES}
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          {guessesLeftLabel}
        </span>
      </div>
      <DemoBoard
        rows={[
          EMPTY_ROW,
          EMPTY_ROW,
          ...Array.from({ length: MAX_BONUS_GUESSES }, () => BONUS_ROW),
        ]}
      />
    </div>,
    // 7. Watch the keyboard: the keys after the two guesses from tip 2.
    <MiniKeyboard
      key="keyboard"
      rows={LANGUAGES[locale].keyboard}
      statuses={keys}
    />,
    // 8. Take your time.
    <div
      key="time"
      className="flex size-16 items-center justify-center rounded-full bg-muted"
    >
      <Hourglass className="size-8 text-muted-foreground" />
    </div>,
    // 9. High contrast: the same guess in both colour sets.
    <div key="contrast" className="flex flex-col gap-3">
      <DemoBoard rows={[scored(starter)]} />
      <div data-contrast="high">
        <DemoBoard rows={[scored(starter)]} />
      </div>
    </div>,
  ];
}

/** A small, static copy of the game's keyboard, coloured like after a few guesses. */
function MiniKeyboard({
  rows,
  statuses,
}: {
  rows: readonly string[];
  statuses: Record<string, string>;
}) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      {rows.map((row) => (
        <div key={row} className="flex justify-center gap-1">
          {[...row].map((letter) => (
            <span
              key={letter}
              data-state={statuses[letter]}
              className="relative flex h-8 min-w-0 flex-1 items-center justify-center rounded-md bg-(--tile-bg,var(--key)) text-xs font-semibold text-(--tile-fg,var(--on-key)) uppercase"
            >
              {letter}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
