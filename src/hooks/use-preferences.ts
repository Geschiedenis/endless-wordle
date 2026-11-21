"use client";

import { useSyncExternalStore } from "react";
import { getThemeChoice, isBonusOn, isHighContrast, subscribeToPreferences, type ThemeChoice } from "@/lib/preferences";

/** Pages are prerendered for the default choices: the device's theme, no high contrast. */
const systemOnServer = (): ThemeChoice => "system";
const offOnServer = () => false;

export function useThemeChoice(): ThemeChoice {
  return useSyncExternalStore(subscribeToPreferences, getThemeChoice, systemOnServer);
}

export function useHighContrast(): boolean {
  return useSyncExternalStore(subscribeToPreferences, isHighContrast, offOnServer);
}

/** Bonus guesses are on by default. */
export function useBonusGuesses(): boolean {
  return useSyncExternalStore(subscribeToPreferences, isBonusOn, () => true);
}
