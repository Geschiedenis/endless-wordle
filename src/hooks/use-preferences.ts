"use client";

import { useSyncExternalStore } from "react";
import { isBonusOn, isDarkTheme, isHighContrast, subscribeToPreferences } from "@/lib/preferences";

/** Pages are prerendered in the default theme, which is dark, without high contrast. */
const darkOnServer = () => true;
const offOnServer = () => false;

export function useDarkTheme(): boolean {
  return useSyncExternalStore(subscribeToPreferences, isDarkTheme, darkOnServer);
}

export function useHighContrast(): boolean {
  return useSyncExternalStore(subscribeToPreferences, isHighContrast, offOnServer);
}

/** Bonus guesses are on by default. */
export function useBonusGuesses(): boolean {
  return useSyncExternalStore(subscribeToPreferences, isBonusOn, () => true);
}
