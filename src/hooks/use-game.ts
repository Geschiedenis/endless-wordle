"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gameApi } from "@/lib/game/api-client";
import { WORD_LENGTH } from "@/lib/game/constants";
import { keyStatuses } from "@/lib/game/keyboard";
import type { GameView, GuessResponse, ScoredGuess } from "@/lib/game/types";

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
  | "error"; // could not load a game

const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useGame() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [game, setGame] = useState<GameView | null>(null);
  const [current, setCurrent] = useState("");
  /** The guess being revealed. game only catches up once the flip has finished. */
  const [pending, setPending] = useState<GuessResponse["result"] | null>(null);
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

  const startNewGame = useCallback(async () => {
    setPhase("loading");
    setPending(null);
    setCurrent("");
    const response = await gameApi.newGame();
    if (response.ok) {
      setGame(response.data.game);
      setPhase("ready");
    } else {
      setPhase("error");
    }
  }, []);

  /** Resumes the game in the cookie, or starts one if there isn't any. */
  const load = useCallback(async () => {
    setPhase("loading");
    const response = await gameApi.state();
    if (response.ok) {
      setGame(response.data.game);
      setPhase("ready");
    } else if (response.error === "no_game") {
      await startNewGame();
    } else {
      setPhase("error");
    }
  }, [startNewGame]);

  useEffect(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;
    void load();
  }, [load]);

  const acceptingInput = phase === "ready" && game?.status === "playing";

  const addLetter = useCallback(
    (letter: string) => {
      if (!acceptingInput) return;
      setCurrent((word) => (word.length < WORD_LENGTH ? word + letter.toLowerCase() : word));
    },
    [acceptingInput],
  );

  const removeLetter = useCallback(() => {
    if (!acceptingInput) return;
    setCurrent((word) => word.slice(0, -1));
  }, [acceptingInput]);

  const finishReveal = useCallback(
    ({ result, game: next }: GuessResponse) => {
      setAnnouncement(describeGuess(result, next));

      if (!result.solved) {
        setGame(next);
        setPending(null);
        setPhase("ready");
        return;
      }

      const bonus = result.bonusEarned ?? 0;
      showToast(bonus > 0 ? `Solved! +${bonus} bonus ${plural(bonus, "guess", "guesses")}` : "Solved!");
      setPhase("solved");
      setTimeout(
        () => {
          setGame(next);
          setPending(null);
          setPhase("ready");
        },
        prefersReducedMotion() ? SOLVED_PAUSE_MS : SOLVED_PAUSE_MS + BOUNCE_STAGGER_MS * WORD_LENGTH,
      );
    },
    [showToast],
  );

  const submit = useCallback(async () => {
    if (!acceptingInput) return;
    if (current.length < WORD_LENGTH) {
      shake();
      showToast("Not enough letters");
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
      setTimeout(() => finishReveal(response.data), prefersReducedMotion() ? 0 : REVEAL_MS);
      return;
    }

    switch (response.error) {
      case "not_in_word_list":
        shake();
        showToast("Not in word list");
        setPhase("ready");
        break;
      case "no_game":
        showToast("Your game expired, so here's a new one");
        await startNewGame();
        break;
      case "game_over":
        await load();
        break;
      case "rate_limited":
        showToast("Slow down a little, then try again");
        setPhase("ready");
        break;
      default:
        showToast("Something went wrong. Try again.");
        setPhase("ready");
    }
  }, [acceptingInput, current, finishReveal, load, shake, showToast, startNewGame]);

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
    guesses,
    current,
    pending,
    keys,
    shaking,
    toast,
    announcement,
    addLetter,
    removeLetter,
    submit,
    startNewGame,
    retryLoad: load,
  };
}

function plural(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}

/** Screen reader summary, since the flip itself is purely visual. */
function describeGuess(result: GuessResponse["result"], next: GameView): string {
  const letters = result.feedback
    .map((status, i) => `${result.word[i].toUpperCase()} ${status}`)
    .join(", ");
  if (result.solved) {
    return `${letters}. Solved. Word ${next.wordNumber} starts with ${next.guessesAllowed} guesses.`;
  }
  if (next.status === "lost") return `${letters}. No guesses left.`;
  const left = next.guessesRemaining;
  return `${letters}. ${left} ${plural(left, "guess", "guesses")} left.`;
}
