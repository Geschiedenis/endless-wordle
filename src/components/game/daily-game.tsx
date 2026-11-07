"use client";

import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { Grid } from "@/components/game/grid";
import { Keyboard } from "@/components/game/keyboard";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { localePath, SITE_URL } from "@/i18n/config";
import { format, rich } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { useDaily } from "@/hooks/use-daily";
import { usePhysicalKeyboard } from "@/hooks/use-physical-keyboard";
import { DAILY_GUESSES, msUntilNextDay, type DailyView } from "@/lib/game/daily";
import { buildDailyShareText } from "@/lib/game/share";
import { isHighContrast } from "@/lib/preferences";

/** The daily word: six guesses at one word, the same for everyone, once a day. */
export function DailyGame() {
  const { dict } = useI18n();
  const { phase, daily, guesses, current, pending, keys, shaking, toast, announcement, addLetter, removeLetter, submit, reload } =
    useDaily();

  usePhysicalKeyboard({ onLetter: addLetter, onEnter: () => void submit(), onBackspace: removeLetter });

  const title = daily ? format(dict.daily.heading, { number: daily.number }) : dict.meta.daily;
  const finished = daily && daily.status !== "playing" && !pending;

  return (
    <main className="relative flex h-dvh flex-col gap-2 overflow-hidden px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
      {/* The game's own gutter is 8px on phones, so this tops it up to the usual 16px. */}
      <TopBar className="px-2 sm:px-0" />

      <header className="flex flex-col items-center gap-0.5 py-1 text-center">
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
        <p className="text-xs text-balance text-muted-foreground">{dict.daily.intro}</p>
      </header>

      {phase === "error" ? (
        <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p>{dict.game.loadError}</p>
          <Button onClick={() => void reload()}>{dict.game.tryAgain}</Button>
        </div>
      ) : (
        <Grid
          solvedWords={[]}
          wordNumber={1}
          rows={DAILY_GUESSES}
          guesses={guesses}
          current={current}
          revealRow={pending ? guesses.length - 1 : null}
          revealSolved={pending?.solved ?? false}
          shaking={shaking}
        />
      )}

      {finished ? (
        <DailyResult daily={daily} title={title} onNewDay={reload} />
      ) : (
        <Keyboard statuses={keys} onLetter={addLetter} onEnter={() => void submit()} onBackspace={removeLetter} />
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

/** Takes the keyboard's place once the day's word is done, so the board stays in view. */
function DailyResult({ daily, title, onNewDay }: { daily: DailyView; title: string; onNewDay: () => unknown }) {
  const { locale, dict } = useI18n();
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const share = useRef<HTMLButtonElement>(null);
  const solved = daily.status === "solved";

  // Lets keyboard and screen reader users act on the result straight away.
  useEffect(() => {
    share.current?.focus();
  }, []);

  /** Phones get the system share sheet; elsewhere the text is copied. Same as the endless game. */
  async function shareResult() {
    const text = buildDailyShareText({
      locale,
      title,
      rows: daily.guesses.map((guess) => guess.feedback),
      solved,
      url: `${SITE_URL}${localePath(locale, "/daily")}`,
      highContrast: isHighContrast(),
    });
    const useShareSheet = typeof navigator.share === "function" && matchMedia("(pointer: coarse)").matches;
    try {
      if (useShareSheet) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareStatus(dict.share.copied);
    } catch (error) {
      // Closing the share sheet isn't a failure.
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus(dict.share.failed);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-2 py-1 text-center">
      {solved ? (
        <p className="text-2xl font-bold">{format(dict.daily.solved, { guesses: daily.guesses.length })}</p>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">{dict.gameOver.wordWas}</p>
          <p className="text-3xl font-bold tracking-[0.2em] uppercase">{daily.answer}</p>
          <p className="text-sm text-muted-foreground">{dict.daily.lost}</p>
        </div>
      )}
      <Countdown onNewDay={onNewDay} />

      <div className="grid w-full grid-cols-2 gap-2">
        <Button ref={share} variant="outline" onClick={() => void shareResult()} className="h-12 text-base font-semibold">
          <Share2 aria-hidden="true" />
          {dict.share.button}
        </Button>
        <Button asChild className="h-12 text-base font-semibold">
          <Link href="/play">{dict.daily.playEndless}</Link>
        </Button>
      </div>
      {shareStatus && <p className="text-sm text-muted-foreground">{shareStatus}</p>}
    </div>
  );
}

/** Time until the next word, at the player's midnight. Loads the new word when it arrives. */
function Countdown({ onNewDay }: { onNewDay: () => unknown }) {
  const { dict } = useI18n();
  const [left, setLeft] = useState(() => msUntilNextDay(new Date()));
  const previous = useRef(left);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = msUntilNextDay(new Date());
      // Just past midnight the time left jumps back up to a whole day.
      if (next > previous.current) onNewDay();
      previous.current = next;
      setLeft(next);
    }, 1000);
    return () => clearInterval(timer);
  }, [onNewDay]);

  const seconds = Math.floor(left / 1000);
  const time = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
  return (
    <p className="text-sm text-muted-foreground">
      {rich(dict.daily.nextIn, { time: <span className="font-semibold text-foreground tabular-nums">{time}</span> })}
    </p>
  );
}
