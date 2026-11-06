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
    if ((event.target as Element | null)?.closest?.('[role="menu"], [role="dialog"]')) return;

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
    <main className="flex h-dvh flex-col gap-2 overflow-hidden px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
      <h1 className="sr-only">Endless Lingle</h1>
      {/* The game's own gutter is 8px on phones, so this tops it up to the usual 16px. */}
      <TopBar className="px-2 sm:px-0" />

      <StatsBar
        wordNumber={mismatch ? undefined : game?.wordNumber}
        streak={mismatch ? undefined : game?.wordsSolved}
        guessesLeft={mismatch ? undefined : (guessesLeft ?? undefined)}
        bonus={mismatch ? undefined : game?.bonusGuesses}
      />

      {phase === "error" ? (
        <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p>{dict.game.loadError}</p>
          <Button onClick={() => void retryLoad()}>{dict.game.tryAgain}</Button>
        </div>
      ) : mismatch && game ? (
        <LanguageMismatch gameLanguage={game.language} onStartNew={() => void startNewGame()} />
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

      {mismatch ? null : lost && game?.answer ? (
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
                  ...solvedWords.map((word) => ({ guesses: word.guesses.length, solved: true })),
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
function LanguageMismatch({ gameLanguage, onStartNew }: { gameLanguage: Locale; onStartNew: () => void }) {
  const { locale, dict } = useI18n();
  const current = dict.languages[gameLanguage];
  return (
    <div role="alert" className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-3 text-center">
      <p className="text-lg font-semibold text-balance">{format(dict.game.mismatchTitle, { language: current })}</p>
      <p className="text-muted-foreground text-balance">
        {format(dict.game.mismatchBody, { newLanguage: dict.languages[locale] })}
      </p>
      <Button onClick={onStartNew} className="mt-2 h-12 w-full text-base font-semibold">
        {format(dict.game.mismatchStartNew, { language: dict.languages[locale] })}
      </Button>
      <Button asChild variant="outline" className="h-11 w-full text-base">
        <a href={localePath(gameLanguage, "/play")} onClick={() => rememberLocale(gameLanguage)}>
          {format(dict.game.mismatchContinue, { language: current })}
        </a>
      </Button>
    </div>
  );
}
