"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

interface GameOverProps {
  answer: string;
  wordsSolved: number;
  /** Undefined for guests, and after reloading a finished game. */
  scoreSaved?: boolean;
  onPlayAgain: () => void;
}

/** Takes the keyboard's place, so the final grid stays visible on small screens. */
export function GameOver({ answer, wordsSolved, scoreSaved, onPlayAgain }: GameOverProps) {
  const playAgain = useRef<HTMLButtonElement>(null);
  const session = useSession();

  // Lets keyboard and screen reader users act on the result straight away.
  useEffect(() => {
    playAgain.current?.focus();
  }, []);

  return (
    <div role="status" className="mx-auto flex w-full max-w-sm flex-col items-center gap-2 py-1 text-center">
      <div>
        <p className="text-sm text-muted-foreground">The word was</p>
        <p className="text-3xl font-bold tracking-[0.2em] uppercase">{answer}</p>
      </div>
      <p>
        You solved{" "}
        <strong className="font-bold">
          {wordsSolved} {wordsSolved === 1 ? "word" : "words"}
        </strong>
      </p>

      <p className="text-sm empty:hidden">
        {session.status === "guest" && session.accountsEnabled && (
          <>
            <Link href="/login?next=/play" className="font-medium underline underline-offset-2">
              Log in to save your score
            </Link>{" "}
            <span className="text-muted-foreground">on your next game.</span>
          </>
        )}
        {session.status === "user" && scoreSaved === true && "Score saved."}
        {session.status === "user" && scoreSaved === false && "Your score couldn't be saved."}
      </p>

      <Button ref={playAgain} onClick={onPlayAgain} className="h-12 w-full text-base font-semibold">
        Play again
      </Button>
    </div>
  );
}
