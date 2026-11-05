"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { format, plural } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { gameApi } from "@/lib/game/api-client";
import { WORD_LENGTH } from "@/lib/game/constants";
import { keyStatuses } from "@/lib/game/keyboard";
import { normalizeLetter } from "@/lib/game/languages";
import type { GameView, GuessResponse, ScoredGuess, SolvedWord } from "@/lib/game/types";

/** Tile timing. The values reach the CSS animations through custom properties. */
export const FLIP_MS = 500;
export const FLIP_STAGGER_MS = 200;
export const BOUNCE_STAGGER_MS = 80;
const REVEAL_MS = FLIP_MS + FLIP_STAGGER_MS * (WORD_LENGTH - 1);
/** How long a solved word stays on screen before the next one appears. */
const SOLVED_PAUSE_MS = 800;
const TOAST_MS = 1800;
const SHAKE_MS = 500;

export type Phase =
  | "loading" // fetching or starting a game
  | "ready" // accepting input
  | "submitting" // waiting for the server
  | "revealing" // tiles are flipping
  | "solved" // brief pause on the solved word
  | "mismatch" // a game in another language is in progress; the player decides
  | "error"; // could not load a game

const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useGame() {
  const { locale, dict } = useI18n();
  const [phase, setPhase] = useState<Phase>("loading");
  const [game, setGame] = useState<GameView | null>(null);
  /** Words solved since this page loaded. The server only keeps the current word's guesses. */
  const [solvedWords, setSolvedWords] = useState<SolvedWord[]>([]);
  const [current, setCurrent] = useState("");
  /** The guess being revealed. game only catches up once the flip has finished. */
  const [pending, setPending] = useState<GuessResponse["result"] | null>(null);
  const [shaking, setShaking] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  /** Whether the finished game's score was stored. Undefined for guests or after a reload. */
  const [scoreSaved, setScoreSaved] = useState<boolean | undefined>(undefined);

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

  const startNewGame = useCallback(async () => {
    setPhase("loading");
    setPending(null);
    setSolvedWords([]);
    setCurrent("");
    setScoreSaved(undefined);
    const response = await gameApi.newGame(locale);
    if (response.ok) {
      setGame(response.data.game);
      setPhase("ready");
    } else {
      setPhase("error");
    }
  }, [locale]);

  /**
   * Resumes the game in progress, or starts one if there isn't any. A game in another
   * language that's under way waits for the player to choose, because starting a new
   * one ends it. One that hasn't started, or has ended, is simply replaced.
   */
  const load = useCallback(async () => {
    setPhase("loading");
    const response = await gameApi.state();
    if (response.ok) {
      const loaded = response.data.game;
      if (loaded.language !== locale) {
        const underWay = loaded.status === "playing" && (loaded.guesses.length > 0 || loaded.wordsSolved > 0);
        if (!underWay) return startNewGame();
        setGame(loaded);
        setPhase("mismatch");
        return;
      }
      // Another tab may have moved the game on or restarted it.
      setSolvedWords((words) => words.filter((word) => word.wordNumber < loaded.wordNumber));
      setGame(loaded);
      setPhase("ready");
    } else if (response.error === "no_game") {
      await startNewGame();
    } else {
      setPhase("error");
    }
  }, [locale, startNewGame]);

  useEffect(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;
    void load();
  }, [load]);

  const acceptingInput = phase === "ready" && game?.status === "playing";

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

  const finishReveal = useCallback(
    ({ result, game: next, scoreSaved: saved }: GuessResponse, earlierGuesses: ScoredGuess[]) => {
      setAnnouncement(describeGuess(dict, result, next));
      setScoreSaved(saved);

      if (!result.solved) {
        setGame(next);
        setPending(null);
        setPhase("ready");
        return;
      }

      const bonus = result.bonusEarned ?? 0;
      showToast(bonus > 0 ? plural(dict.game.solvedWithBonus, bonus) : dict.game.solved);
      setPhase("solved");
      setTimeout(
        () => {
          setSolvedWords((words) => [
            ...words,
            { wordNumber: next.wordNumber - 1, guesses: [...earlierGuesses, result] },
          ]);
          setGame(next);
          setPending(null);
          setPhase("ready");
        },
        prefersReducedMotion() ? SOLVED_PAUSE_MS : SOLVED_PAUSE_MS + BOUNCE_STAGGER_MS * WORD_LENGTH,
      );
    },
    [dict, showToast],
  );

  const submit = useCallback(async () => {
    if (!acceptingInput) return;
    if ([...current].length < WORD_LENGTH) {
      shake();
      showToast(dict.game.notEnoughLetters);
      return;
    }

    setPhase("submitting");
    const response = await gameApi.guess(current);

    if (response.ok) {
      clearTimeout(toastTimer.current);
      setToast(null);
      setPending(response.data.result);
      setCurrent("");
      setPhase("revealing");
      const earlierGuesses = game?.guesses ?? [];
      setTimeout(() => finishReveal(response.data, earlierGuesses), prefersReducedMotion() ? 0 : REVEAL_MS);
      return;
    }

    switch (response.error) {
      case "not_in_word_list":
        shake();
        showToast(dict.game.notInWordList);
        setPhase("ready");
        break;
      case "no_game":
        showToast(dict.game.expired);
        await startNewGame();
        break;
      case "game_over":
      case "game_conflict":
        setCurrent("");
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
  }, [acceptingInput, current, dict, finishReveal, game, load, shake, showToast, startNewGame]);

  /** Guesses on the grid, including the one being revealed. */
  const guesses: ScoredGuess[] = useMemo(() => {
    const committed = game?.guesses ?? [];
    return pending ? [...committed, pending] : committed;
  }, [game, pending]);

  /** Keys only change colour once the flip has shown the player the result. */
  const keys = useMemo(
    () => keyStatuses(phase === "revealing" ? (game?.guesses ?? []) : guesses),
    [phase, game, guesses],
  );

  return {
    phase,
    game,
    solvedWords,
    guesses,
    current,
    pending,
    keys,
    shaking,
    toast,
    announcement,
    scoreSaved,
    addLetter,
    removeLetter,
    submit,
    startNewGame,
    retryLoad: load,
  };
}

/** Screen reader summary, since the flip itself is purely visual. */
function describeGuess(dict: Dictionary, result: GuessResponse["result"], next: GameView): string {
  const letters = result.feedback
    .map((status, i) => `${[...result.word][i].toUpperCase()} ${dict.game.feedback[status]}`)
    .join(", ");
  if (result.solved) {
    return format(dict.game.announceSolved, { letters, number: next.wordNumber, guesses: next.guessesAllowed });
  }
  if (next.status === "lost") return format(dict.game.announceLost, { letters });
  return plural(dict.game.announceLeft, next.guessesRemaining, { letters });
}
