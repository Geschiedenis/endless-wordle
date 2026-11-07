"use client";

import { useEffect, useEffectEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { normalizeLetter } from "@/lib/game/languages";

/** Typing on a real keyboard, for the endless game and the daily word alike. */
export function usePhysicalKeyboard({
  onLetter,
  onEnter,
  onBackspace,
}: {
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}) {
  const { locale } = useI18n();

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    // Menus and dialogs have their own keyboard handling.
    if ((event.target as Element | null)?.closest?.('[role="menu"], [role="dialog"]')) return;

    // Enter or Space on a focused control should activate that control only.
    const onControl = (event.target as Element | null)?.closest?.("a, button");
    if (onControl && (event.key === "Enter" || event.key === " ")) return;

    if (event.key === "Enter") {
      event.preventDefault();
      if (!event.repeat) onEnter();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      onBackspace();
    } else if (normalizeLetter(locale, event.key)) {
      // Typing means the player is back in the game, so Enter should submit next.
      if (onControl instanceof HTMLElement) onControl.blur();
      onLetter(event.key);
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
}
