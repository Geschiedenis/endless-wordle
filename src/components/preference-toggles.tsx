"use client";

import { useSyncExternalStore } from "react";
import { Contrast, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isDarkTheme,
  isHighContrast,
  setDarkTheme,
  setHighContrast,
  subscribeToPreferences,
} from "@/lib/preferences";
import { useI18n } from "@/i18n/provider";

const onServer = () => false;
/** Pages are prerendered in the default theme, which is dark. */
const darkOnServer = () => true;

/** Keeps focus off the toggle after a click, so Enter still submits a guess. */
const keepFocus = (event: React.MouseEvent) => event.preventDefault();

export function PreferenceToggles() {
  const { dict } = useI18n();
  const dark = useSyncExternalStore(subscribeToPreferences, isDarkTheme, darkOnServer);
  const highContrast = useSyncExternalStore(subscribeToPreferences, isHighContrast, onServer);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={dark ? "secondary" : "ghost"}
        size="icon"
        className="size-9"
        aria-label={dict.header.darkMode}
        aria-pressed={dark}
        title={dict.header.darkMode}
        onMouseDown={keepFocus}
        onClick={() => setDarkTheme(!dark)}
      >
        <Moon aria-hidden="true" />
      </Button>
      <Button
        variant={highContrast ? "secondary" : "ghost"}
        size="icon"
        className="size-9"
        aria-label={dict.header.highContrast}
        aria-pressed={highContrast}
        title={dict.header.highContrastTitle}
        onMouseDown={keepFocus}
        onClick={() => setHighContrast(!highContrast)}
      >
        <Contrast aria-hidden="true" />
      </Button>
    </div>
  );
}
