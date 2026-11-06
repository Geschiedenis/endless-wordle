"use client";

import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { splitGuessesLeft } from "@/lib/game/guesses-left";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  wordNumber?: number;
  streak?: number;
  guessesLeft?: number;
  /** Guesses on this word in total, bonus included. Needed to tell the bonus apart. */
  guessesAllowed?: number;
}

/**
 * Word, streak and guesses left. Bonus guesses show inside the guesses count, as
 * "5 +1": regular guesses left, then bonus guesses left.
 */
export function StatsBar({ wordNumber, streak, guessesLeft, guessesAllowed }: StatsBarProps) {
  const { dict } = useI18n();
  const known = guessesLeft !== undefined && guessesAllowed !== undefined;
  const { regular, bonus } = known ? splitGuessesLeft(guessesAllowed, guessesLeft) : { regular: 0, bonus: 0 };

  return (
    <dl className="mx-auto grid w-full max-w-lg grid-cols-3 gap-1 text-center">
      <Stat label={dict.stats.word} value={wordNumber ?? "–"} />
      <Stat label={dict.stats.streak} value={streak ?? "–"} />
      <Stat
        label={dict.stats.guessesLeft}
        srLabel={bonus > 0 ? format(dict.stats.guessesLeftWithBonus, { total: guessesLeft!, bonus }) : undefined}
        urgent={known && guessesLeft <= 1}
        value={
          !known ? (
            "–"
          ) : (
            <>
              {regular}
              {bonus > 0 && <span className="ml-1 text-sm text-primary">+{bonus}</span>}
            </>
          )
        }
      />
    </dl>
  );
}

function Stat({
  label,
  srLabel,
  value,
  urgent,
}: {
  label: string;
  /** Replaces the label and value for screen readers, when the visual form is shorthand. */
  srLabel?: string;
  value: React.ReactNode;
  urgent?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse rounded-md bg-muted px-1 py-1">
      <dt className="text-[0.6875rem] leading-tight text-muted-foreground">
        <span aria-hidden={srLabel ? true : undefined}>{label}</span>
        {srLabel && <span className="sr-only">{srLabel}</span>}
      </dt>
      <dd
        aria-hidden={srLabel ? true : undefined}
        className={cn("text-lg leading-tight font-bold tabular-nums", urgent && "text-destructive")}
      >
        {value}
      </dd>
    </div>
  );
}
