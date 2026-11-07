"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { format, plural } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { BOUNCE_STAGGER_MS, FLIP_MS, FLIP_STAGGER_MS } from "@/hooks/use-game";
import { dailyApi } from "@/lib/game/api-client";
import { DAILY_GUESSES, localDay, type DailyGuessResponse, type DailyView } from "@/lib/game/daily";
import { WORD_LENGTH } from "@/lib/game/constants";
import { keyStatuses } from "@/lib/game/keyboard";
import { normalizeLetter } from "@/lib/game/languages";
import type { ScoredGuess } from "@/lib/game/types";

const REVEAL_MS = FLIP_MS + FLIP_STAGGER_MS * (WORD_LENGTH - 1);
/** A solved word stays put while its tiles bounce, before the result appears. */
const SOLVED_PAUSE_MS = 600 + BOUNCE_STAGGER_MS * WORD_LENGTH;
const TOAST_MS = 1800;
const SHAKE_MS = 500;

export type DailyPhase = "loading" | "ready" | "submitting" | "revealing" | "error";

const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The day's word in the page's language: loading it, guessing, and revealing each guess. */
export function useDaily() {
  const { locale, dict } = useI18n();
  const [phase, setPhase] = useState<DailyPhase>("loading");
  const [daily, setDaily] = useState<DailyView | null>(null);
  const [current, setCurrent] = useState("");
  /** The guess being revealed. daily only catches up once the flip has finished. */
  const [pending, setPending] = useState<DailyGuessResponse["result"] | null>(null);
  const [shaking, setShaking] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const loadStarted = useRef(false);

  const showToast = useCallback((message: string) => {
    clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), SHAKE_MS);
  }, []);

  /** Loads today's word, as the browser's own calendar sees it. Also used when the day rolls over. */
  const load = useCallback(async () => {
    setPhase("loading");
    setCurrent("");
    const response = await dailyApi.state(locale, localDay(new Date()));
    if (response.ok) {
      setDaily(response.data.daily);
      setPhase("ready");
    } else {
      setPhase("error");
    }
  }, [locale]);

  useEffect(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;
    void load();
  }, [load]);

  const acceptingInput = phase === "ready" && daily?.status === "playing";

  const addLetter = useCallback(
    (letter: string) => {
      const normalized = normalizeLetter(locale, letter);
      if (!acceptingInput || !normalized) return;
      setCurrent((word) => ([...word].length < WORD_LENGTH ? word + normalized : word));
    },
    [acceptingInput, locale],
  );

  const removeLetter = useCallback(() => {
    if (!acceptingInput) return;
    setCurrent((word) => word.slice(0, -1));
  }, [acceptingInput]);

  const submit = useCallback(async () => {
    if (!acceptingInput || !daily) return;
    if ([...current].length < WORD_LENGTH) {
      shake();
      showToast(dict.game.notEnoughLetters);
      return;
    }

    setPhase("submitting");
    // The day the word was loaded for, so a game that runs past midnight finishes on its own word.
    const response = await dailyApi.guess(locale, daily.day, current);

    if (response.ok) {
      const { result, daily: next } = response.data;
      clearTimeout(toastTimer.current);
      setToast(null);
      setPending(result);
      setCurrent("");
      setPhase("revealing");
      const reveal = prefersReducedMotion() ? 0 : REVEAL_MS + (result.solved ? SOLVED_PAUSE_MS : 0);
      setTimeout(() => {
        setAnnouncement(describeGuess(result, next, dict));
        setDaily(next);
        setPending(null);
        setPhase("ready");
      }, reveal);
      return;
    }

    switch (response.error) {
      case "not_in_word_list":
        shake();
        showToast(dict.game.notInWordList);
        setPhase("ready");
        break;
      case "game_over":
      case "game_conflict":
        await load();
        break;
      case "rate_limited":
        showToast(dict.game.slowDown);
        setPhase("ready");
        break;
      default:
        showToast(dict.game.somethingWrong);
        setPhase("ready");
    }
  }, [acceptingInput, current, daily, dict, load, locale, shake, showToast]);

  /** Guesses on the grid, including the one being revealed. */
  const guesses: ScoredGuess[] = useMemo(() => {
    const committed = daily?.guesses ?? [];
    return pending ? [...committed, pending] : committed;
  }, [daily, pending]);

  /** Keys only change colour once the flip has shown the player the result. */
  const keys = useMemo(
    () => keyStatuses(phase === "revealing" ? (daily?.guesses ?? []) : guesses),
    [phase, daily, guesses],
  );

  return { phase, daily, guesses, current, pending, keys, shaking, toast, announcement, addLetter, removeLetter, submit, reload: load };
}

/** Screen reader summary, since the flip itself is purely visual. */
function describeGuess(
  result: DailyGuessResponse["result"],
  next: DailyView,
  dict: Dictionary,
): string {
  const letters = result.feedback
    .map((status, i) => `${[...result.word][i].toUpperCase()} ${dict.game.feedback[status]}`)
    .join(", ");
  if (result.solved) return format(dict.daily.announceSolved, { letters });
  if (next.status === "lost") return format(dict.game.announceLost, { letters });
  return plural(dict.game.announceLeft, DAILY_GUESSES - next.guesses.length, { letters });
}
