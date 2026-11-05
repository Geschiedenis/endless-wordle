"use client";

import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { MAX_BONUS_GUESSES } from "@/lib/game/constants";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  wordNumber?: number;
  streak?: number;
  guessesLeft?: number;
  bonus?: number;
}

export function StatsBar({ wordNumber, streak, guessesLeft, bonus }: StatsBarProps) {
  const { dict } = useI18n();
  return (
    <dl className="mx-auto grid w-full max-w-lg grid-cols-4 gap-1 text-center">
      <Stat label={dict.stats.word} value={wordNumber ?? "–"} />
      <Stat label={dict.stats.streak} value={streak ?? "–"} />
      <Stat
        label={dict.stats.guessesLeft}
        value={guessesLeft ?? "–"}
        urgent={guessesLeft !== undefined && guessesLeft <= 1}
      />
      <Stat
        label={dict.stats.bonus}
        srLabel={format(dict.stats.bonusDescription, { max: MAX_BONUS_GUESSES })}
        value={bonus === undefined ? "–" : `+${bonus}`}
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
  srLabel?: string;
  value: string | number;
  urgent?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse rounded-md bg-muted px-1 py-1">
      <dt className="text-[0.6875rem] leading-tight text-muted-foreground">
        <span aria-hidden={srLabel ? true : undefined}>{label}</span>
        {srLabel && <span className="sr-only">{srLabel}</span>}
      </dt>
      <dd className={cn("text-lg leading-tight font-bold tabular-nums", urgent && "text-destructive")}>
        {value}
      </dd>
    </div>
  );
}
