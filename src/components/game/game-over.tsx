"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, plural, rich } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { useSession } from "@/hooks/use-session";
import { localePath, SITE_URL, type Locale } from "@/i18n/config";
import { buildShareText, type SharedWord } from "@/lib/game/share";
import { encodeResult } from "@/lib/game/share-code";
import { isHighContrast } from "@/lib/preferences";
import { trackEvent } from "@/lib/analytics";
import { bestScore, saveScore } from "@/lib/records";

interface GameOverProps {
  answer: string;
  /** The game's language: each language keeps its own record. */
  language: Locale;
  wordsSolved: number;
  /** Undefined for guests, and after reloading a finished game. */
  scoreSaved?: boolean;
  onPlayAgain: () => void;
  /** Every word of the game, for the share text. Empty if not all of them are known. */
  sharedWords: SharedWord[];
}

/** Takes the keyboard's place, so the final grid stays visible on small screens. */
export function GameOver({ answer, language, wordsSolved, scoreSaved, onPlayAgain, sharedWords }: GameOverProps) {
  const playAgain = useRef<HTMLButtonElement>(null);
  const session = useSession();
  const { locale, dict } = useI18n();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  // The record before this game counted. Read once: saving it below doesn't change what
  // this screen shows, and reloading a finished game doesn't make it a new record again.
  const [previousBest] = useState(() => bestScore(language));
  const newRecord = wordsSolved > previousBest;

  useEffect(() => {
    saveScore(language, wordsSolved);
  }, [language, wordsSolved]);

  /**
   * Phones get the system share sheet, so the result can go straight into a chat.
   * Elsewhere the text is copied, which is what people expect on a computer.
   */
  async function share() {
    const text = buildShareText({
      locale,
      wordsLabel: plural(dict.gameOver.words, wordsSolved),
      words: sharedWords,
      // A link to this result, whose preview shows the grid and score.
      url: `${SITE_URL}${localePath(locale, `/r/${encodeResult({ wordsSolved, words: sharedWords })}`)}`,
      highContrast: isHighContrast(),
    });
    const useShareSheet = typeof navigator.share === "function" && matchMedia("(pointer: coarse)").matches;
    try {
      if (useShareSheet) {
        await navigator.share({ text });
        trackEvent("share", { mode: "endless", method: "share_sheet" });
        return;
      }
      await navigator.clipboard.writeText(text);
      trackEvent("share", { mode: "endless", method: "clipboard" });
      setShareStatus(dict.share.copied);
    } catch (error) {
      // Closing the share sheet isn't a failure.
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus(dict.share.failed);
    }
  }

  // Lets keyboard and screen reader users act on the result straight away.
  useEffect(() => {
    playAgain.current?.focus();
  }, []);

  return (
    <div role="status" className="mx-auto flex w-full max-w-sm flex-col items-center gap-2 py-1 text-center">
      <div>
        <p className="text-sm text-muted-foreground">{dict.gameOver.wordWas}</p>
        <p className="text-3xl font-bold tracking-[0.2em] uppercase">{answer}</p>
      </div>
      <p>
        {rich(dict.gameOver.youSolved, {
          words: <strong className="font-bold">{plural(dict.gameOver.words, wordsSolved)}</strong>,
        })}
      </p>

      {newRecord ? (
        <p className="flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--present)_18%,transparent)] px-3 py-1 text-sm font-semibold">
          <Trophy aria-hidden="true" className="size-4 text-(--present)" />
          {dict.gameOver.newRecord}
        </p>
      ) : (
        previousBest > 0 && (
          <p className="text-sm text-muted-foreground">
            {format(dict.gameOver.best, { words: plural(dict.gameOver.words, previousBest) })}
          </p>
        )
      )}

      <p className="text-sm empty:hidden">
        {session.status === "guest" && session.accountsEnabled && (
          <>
            <Link href="/login?next=/play" className="font-medium underline underline-offset-2">
              {dict.gameOver.loginToSave}
            </Link>{" "}
            <span className="text-muted-foreground">{dict.gameOver.onNextGame}</span>
          </>
        )}
        {session.status === "user" && scoreSaved === true && dict.gameOver.scoreSaved}
        {session.status === "user" && scoreSaved === false && dict.gameOver.scoreNotSaved}
      </p>

      <div className="grid w-full grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => void share()} className="h-12 text-base font-semibold">
          <Share2 aria-hidden="true" />
          {dict.share.button}
        </Button>
        <Button ref={playAgain} onClick={onPlayAgain} className="h-12 text-base font-semibold">
          {dict.gameOver.playAgain}
        </Button>
      </div>
      {shareStatus && <p className="text-sm text-muted-foreground">{shareStatus}</p>}
    </div>
  );
}
