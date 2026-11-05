"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { BASE_GUESSES, WORD_LENGTH } from "@/lib/game/constants";
import type { LetterFeedback, ScoredGuess } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { BOUNCE_STAGGER_MS, FLIP_MS, FLIP_STAGGER_MS } from "@/hooks/use-game";

type TileState = LetterFeedback | "typed" | "empty";

interface GridProps {
  rows: number;
  guesses: ScoredGuess[];
  current: string;
  /** Index of the row currently flipping, if any. */
  revealRow: number | null;
  /** True when the flipping row solves the word. */
  revealSolved: boolean;
  shaking: boolean;
}

const LETTER_POSITIONS = Array.from({ length: WORD_LENGTH }, (_, i) => i);

export function Grid({ rows, guesses, current, revealRow, revealSolved, shaking }: GridProps) {
  const activeRowIndex = Math.min(guesses.length, rows - 1);
  const activeRow = useRef<HTMLDivElement>(null);

  // With bonus rows the grid scrolls, so keep the row being played in view.
  useEffect(() => {
    activeRow.current?.scrollIntoView({ block: "nearest" });
  }, [activeRowIndex, rows]);

  return (
    <div className="game-grid min-h-0 flex-1 overflow-y-auto">
      <div
        role="group"
        aria-label={`Guesses, ${rows} rows`}
        className="game-rows mx-auto flex w-fit flex-col"
      >
        {Array.from({ length: rows }, (_, row) => {
          const scored = guesses[row];
          const isCurrent = row === guesses.length;
          const word = scored?.word ?? (isCurrent ? current : "");
          return (
            <div
              key={row}
              ref={row === activeRowIndex ? activeRow : undefined}
              role="group"
              aria-label={`Row ${row + 1}${row >= BASE_GUESSES ? ", bonus guess" : ""}`}
              className={cn("game-row flex", isCurrent && shaking && "row-shake")}
            >
              {LETTER_POSITIONS.map((position) => (
                <Tile
                  key={position}
                  row={row}
                  position={position}
                  letter={word[position] ?? ""}
                  state={scored?.feedback[position] ?? (word[position] ? "typed" : "empty")}
                  bonus={row >= BASE_GUESSES}
                  reveal={row === revealRow}
                  win={row === revealRow && revealSolved}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tile({
  row,
  position,
  letter,
  state,
  bonus,
  reveal,
  win,
}: {
  row: number;
  position: number;
  letter: string;
  state: TileState;
  bonus: boolean;
  reveal: boolean;
  win: boolean;
}) {
  const scored = state !== "empty" && state !== "typed";
  const label = `Row ${row + 1}, letter ${position + 1}: ${letter ? letter.toUpperCase() : "empty"}${
    scored ? `, ${state}` : ""
  }`;

  const timing = {
    "--flip-ms": `${FLIP_MS}ms`,
    "--flip-delay": `${position * FLIP_STAGGER_MS}ms`,
    "--bounce-delay": `${FLIP_MS + FLIP_STAGGER_MS * (WORD_LENGTH - 1) + position * BOUNCE_STAGGER_MS}ms`,
  } as CSSProperties;

  return (
    <div
      role="img"
      aria-label={label}
      data-state={state}
      data-bonus={bonus}
      style={reveal ? timing : undefined}
      className={cn("tile", reveal && "tile-reveal", win && "tile-win")}
    >
      <span aria-hidden="true">{letter}</span>
    </div>
  );
}
