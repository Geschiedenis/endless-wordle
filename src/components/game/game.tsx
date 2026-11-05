"use client";

import { useEffect, useEffectEvent } from "react";
import Link from "next/link";
import { AuthMenu } from "@/components/auth-menu";
import { GameOver } from "@/components/game/game-over";
import { Grid } from "@/components/game/grid";
import { Keyboard } from "@/components/game/keyboard";
import { Logo } from "@/components/logo";
import { StatsBar } from "@/components/game/stats-bar";
import { PreferenceToggles } from "@/components/preference-toggles";
import { Button } from "@/components/ui/button";
import { BASE_GUESSES } from "@/lib/game/constants";
import { useGame } from "@/hooks/use-game";

export function Game() {
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
    // The account menu has its own keyboard handling.
    if ((event.target as Element | null)?.closest?.('[role="menu"]')) return;

    // Enter or Space on a focused control should activate that control only.
    const onControl = (event.target as Element | null)?.closest?.("a, button");
    if (onControl && (event.key === "Enter" || event.key === " ")) return;

    if (event.key === "Enter") {
      event.preventDefault();
      if (!event.repeat) void submit();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      removeLetter();
    } else if (/^[a-zA-Z]$/.test(event.key)) {
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
  // The stats shouldn't lag behind a guess that is already on the grid.
  const guessesLeft = game && game.guessesRemaining - (pending ? 1 : 0);

  return (
    <main className="flex h-dvh flex-col gap-2 overflow-hidden px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
      <header className="mx-auto flex w-full max-w-lg items-center justify-between">
        <h1 className="text-base font-bold tracking-tight whitespace-nowrap sm:text-lg">
          <Link href="/" className="flex items-center gap-2 rounded-sm" aria-label="Endless Wordle, back to home">
            <Logo size={24} />
            Endless Wordle
          </Link>
        </h1>
        <div className="flex items-center gap-1">
          <AuthMenu />
          <PreferenceToggles />
        </div>
      </header>

      <StatsBar
        wordNumber={game?.wordNumber}
        streak={game?.wordsSolved}
        guessesLeft={guessesLeft ?? undefined}
        bonus={game?.bonusGuesses}
      />

      {phase === "error" ? (
        <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p>The game couldn&apos;t load.</p>
          <Button onClick={() => void retryLoad()}>Try again</Button>
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
