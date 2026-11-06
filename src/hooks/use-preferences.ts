"use client";

import { useSyncExternalStore } from "react";
import { isDarkTheme, isHighContrast, subscribeToPreferences } from "@/lib/preferences";

/** Pages are prerendered in the default theme, which is dark, without high contrast. */
const darkOnServer = () => true;
const offOnServer = () => false;

export function useDarkTheme(): boolean {
  return useSyncExternalStore(subscribeToPreferences, isDarkTheme, darkOnServer);
}

export function useHighContrast(): boolean {
  return useSyncExternalStore(subscribeToPreferences, isHighContrast, offOnServer);
}
