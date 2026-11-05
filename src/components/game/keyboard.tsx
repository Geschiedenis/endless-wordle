"use client";

import { Delete } from "lucide-react";
import type { LetterFeedback } from "@/lib/game/types";
import { cn } from "@/lib/utils";

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

interface KeyboardProps {
  statuses: Record<string, LetterFeedback>;
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}

const KEY_CLASS =
  "flex h-[clamp(2.5rem,7dvh,3.5rem)] min-w-0 flex-1 items-center justify-center rounded-md bg-(--tile-bg,var(--key)) text-sm font-semibold text-(--tile-fg,var(--on-key)) uppercase select-none touch-manipulation transition-colors active:opacity-70 relative";

/**
 * Taking focus would make a physical Enter press retype the last tapped key, so
 * mouse and touch leave focus where it is. Tab still reaches every key.
 */
const keepFocus = (event: React.MouseEvent) => event.preventDefault();

export function Keyboard({ statuses, onLetter, onEnter, onBackspace }: KeyboardProps) {
  return (
    <div role="group" aria-label="Keyboard" className="mx-auto flex w-full max-w-lg flex-col gap-1.5">
      {ROWS.map((row, rowIndex) => (
        <div key={row} className={cn("flex gap-1", rowIndex === 1 && "px-[5%]")}>
          {rowIndex === 2 && (
            <button
              type="button"
              aria-label="Enter, submit guess"
              onClick={onEnter}
              onMouseDown={keepFocus}
              className={cn(KEY_CLASS, "flex-[1.6] text-xs")}
            >
              Enter
            </button>
          )}
          {Array.from(row, (letter) => (
            <button
              key={letter}
              type="button"
              aria-label={`${letter.toUpperCase()}${statuses[letter] ? `, ${statuses[letter]}` : ""}`}
              data-state={statuses[letter]}
              onClick={() => onLetter(letter)}
              onMouseDown={keepFocus}
              className={KEY_CLASS}
            >
              {letter}
            </button>
          ))}
          {rowIndex === 2 && (
            <button
              type="button"
              aria-label="Backspace, delete letter"
              onClick={onBackspace}
              onMouseDown={keepFocus}
              className={cn(KEY_CLASS, "flex-[1.6]")}
            >
              <Delete aria-hidden="true" className="size-5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
