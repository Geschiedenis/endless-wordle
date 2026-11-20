import { cn } from "@/lib/utils";

/**
 * Bars for how many words were solved in 1, 2, 3… guesses, the longest bar in green.
 * Used on the profile and in the daily word archive. No hooks, so it works on the
 * server and in the browser.
 */
export function DistributionBars({ counts, locale }: { counts: number[]; locale: string }) {
  const most = Math.max(...counts);
  return (
    <ol className="flex flex-col gap-1.5">
      {counts.map((count, index) => (
        <li key={index} className="flex items-center gap-2 text-sm">
          <span className="w-3 shrink-0 text-right font-semibold tabular-nums">{index + 1}</span>
          <span className="flex-1">
            <span
              // At least wide enough to hold its number, so empty rows still show a bar.
              style={{ width: `max(1.75rem, ${most > 0 ? (count / most) * 100 : 0}%)` }}
              className={cn(
                "flex h-6 items-center justify-end rounded-sm px-2 text-xs font-bold tabular-nums",
                most > 0 && count === most ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
              )}
            >
              {count.toLocaleString(locale)}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
