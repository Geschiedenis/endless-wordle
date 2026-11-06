"use client";

import { useEffect, useEffectEvent } from "react";
import { GameOver } from "@/components/game/game-over";
import { Grid } from "@/components/game/grid";
import { Keyboard } from "@/components/game/keyboard";
import { StatsBar } from "@/components/game/stats-bar";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/i18n/config";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { rememberLocale } from "@/i18n/remember";
import { BASE_GUESSES } from "@/lib/game/constants";
import { normalizeLetter } from "@/lib/game/languages";
import { useGame } from "@/hooks/use-game";
import { cn } from "@/lib/utils";

export function Game() {
  const { locale, dict } = useI18n();
  const {
    phase,
    game,
    solvedWords,
    guesses,
    current,
    pending,
    keys,
    shaking,
    toast,
    announcement,
    scoreSaved,
    addLetter,
    removeLetter,
    submit,
    startNewGame,
    retryLoad,
  } = useGame();

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    // Menus and dialogs have their own keyboard handling.
    if (
      (event.target as Element | null)?.closest?.(
        '[role="menu"], [role="dialog"]',
      )
    )
      return;

    // Enter or Space on a focused control should activate that control only.
    const onControl = (event.target as Element | null)?.closest?.("a, button");
    if (onControl && (event.key === "Enter" || event.key === " ")) return;

    if (event.key === "Enter") {
      event.preventDefault();
      if (!event.repeat) void submit();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      removeLetter();
    } else if (normalizeLetter(locale, event.key)) {
      // Typing means the player is back in the game, so Enter should submit next.
      if (onControl instanceof HTMLElement) onControl.blur();
      addLetter(event.key);
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const lost = game?.status === "lost" && !pending;
  const mismatch = phase === "mismatch";
  // The stats shouldn't lag behind a guess that is already on the grid.
  const guessesLeft = game && game.guessesRemaining - (pending ? 1 : 0);

  return (
    <main className="relative flex h-dvh flex-col gap-2 overflow-hidden px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
      <h1 className="sr-only">Endless Lingle</h1>
      {/* The game's own gutter is 8px on phones, so this tops it up to the usual 16px. */}
      <TopBar className="px-2 sm:px-0" />

      <StatsBar
        wordNumber={game?.wordNumber}
        streak={game?.wordsSolved}
        guessesLeft={guessesLeft ?? undefined}
        guessesAllowed={game?.guessesAllowed}
      />

      {/* While a game in another language waits for a decision, it stays visible behind the question, dimmed and out of reach. */}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 transition-opacity",
          mismatch && "pointer-events-none opacity-40 select-none",
        )}
        inert={mismatch || undefined}
        aria-hidden={mismatch || undefined}
      >
        {phase === "error" ? (
          <div
            role="alert"
            className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          >
            <p>{dict.game.loadError}</p>
            <Button onClick={() => void retryLoad()}>
              {dict.game.tryAgain}
            </Button>
          </div>
        ) : (
          <Grid
            solvedWords={solvedWords}
            wordNumber={game?.wordNumber ?? 1}
            rows={game?.guessesAllowed ?? BASE_GUESSES}
            guesses={guesses}
            current={current}
            revealRow={pending ? guesses.length - 1 : null}
            revealSolved={pending?.solved ?? false}
            shaking={shaking}
          />
        )}

        {lost && game?.answer ? (
          <GameOver
            answer={game.answer}
            wordsSolved={game.wordsSolved}
            scoreSaved={scoreSaved}
            onPlayAgain={() => void startNewGame()}
            sharedWords={
              // Only the words solved since the page loaded are known. If the page was
              // reloaded mid-game, the share sticks to the score.
              solvedWords.length === game.wordsSolved
                ? [
                    ...solvedWords.map((word) => ({
                      guesses: word.guesses.length,
                      solved: true,
                    })),
                    { guesses: game.guesses.length, solved: false },
                  ]
                : []
            }
          />
        ) : (
          <Keyboard
            statuses={keys}
            onLetter={addLetter}
            onEnter={() => void submit()}
            onBackspace={removeLetter}
          />
        )}
      </div>

      {mismatch && game && (
        <LanguageMismatch
          gameLanguage={game.language}
          onStartNew={() => void startNewGame()}
        />
      )}

      {/* Always mounted: screen readers only announce changes to an existing live region. */}
      <div aria-live="polite" role="status">
        {toast && (
          <div
            key={toast.id}
            className="toast fixed top-28 left-1/2 z-10 -translate-x-1/2 rounded-md bg-foreground px-3 py-2 text-sm font-semibold whitespace-nowrap text-background shadow-md"
          >
            {toast.message}
          </div>
        )}
      </div>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </main>
  );
}

/**
 * Shown when a game in another language is under way. Starting one in this page's
 * language would end it, so the player chooses.
 */
function LanguageMismatch({
  gameLanguage,
  onStartNew,
}: {
  gameLanguage: Locale;
  onStartNew: () => void;
}) {
  const { locale, dict } = useI18n();
  const current = dict.languages[gameLanguage];
  return (
    // Pinned to the bottom over the board, fading up into it like the footer over the home page fan.
    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background via-background/95 to-transparent px-4 pt-28 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {/* A soft dark shade behind the buttons. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(ellipse_at_bottom,var(--shade),transparent_70%)]"
      />
      <div
        role="alert"
        className="relative mx-auto flex w-full max-w-sm flex-col items-center gap-3 text-center"
      >
        <p className="text-lg font-semibold text-balance">
          {format(dict.game.mismatchTitle, { language: current })}
        </p>
        <p className="text-balance text-muted-foreground">
          {format(dict.game.mismatchBody, {
            newLanguage: dict.languages[locale],
          })}
        </p>
        <Button
          onClick={onStartNew}
          className="mt-2 h-12 w-full text-base font-semibold"
        >
          {format(dict.game.mismatchStartNew, {
            language: dict.languages[locale],
          })}
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full bg-background/60 text-base backdrop-blur-sm"
        >
          <a
            href={localePath(gameLanguage, "/play")}
            onClick={() => rememberLocale(gameLanguage)}
          >
            {format(dict.game.mismatchContinue, { language: current })}
          </a>
        </Button>
      </div>
    </div>
  );
}
