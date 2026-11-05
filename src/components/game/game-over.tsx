"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface GameOverProps {
  answer: string;
  wordsSolved: number;
  onPlayAgain: () => void;
}

/** Takes the keyboard's place, so the final grid stays visible on small screens. */
export function GameOver({ answer, wordsSolved, onPlayAgain }: GameOverProps) {
  const playAgain = useRef<HTMLButtonElement>(null);

  // Lets keyboard and screen reader users act on the result straight away.
  useEffect(() => {
    playAgain.current?.focus();
  }, []);

  return (
    <div role="status" className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 py-2 text-center">
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
      <Button ref={playAgain} onClick={onPlayAgain} className="h-12 w-full text-base font-semibold">
        Play again
      </Button>
    </div>
  );
}
