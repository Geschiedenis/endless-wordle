import type { SharedWord } from "@/lib/game/share";
import { MAX_SHARED_WORDS } from "@/lib/game/share";
import { cn } from "@/lib/utils";

/**
 * A shared result as rows of small squares, like the share text: grey for each missed
 * guess, then green for a solve or red for the word that ended the game. No letters.
 */
export function ResultGrid({ words, className }: { words: SharedWord[]; className?: string }) {
  const shown = words.slice(-MAX_SHARED_WORDS);
  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      {words.length > shown.length && <span className="text-sm text-muted-foreground">⋯</span>}
      {shown.map((word, index) => (
        <div key={index} className="flex gap-1">
          {Array.from({ length: word.guesses }, (_, guess) => {
            const last = guess === word.guesses - 1;
            return (
              <span
                key={guess}
                className={cn(
                  "size-5 rounded-[4px]",
                  !last && "bg-(--absent)",
                  last && word.solved && "bg-(--correct)",
                  last && !word.solved && "bg-destructive",
                )}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
