/** Display preferences. They live on <html> and in localStorage, per browser. */

const THEME_KEY = "ew-theme";
const CONTRAST_KEY = "ew-contrast";
const BONUS_KEY = "ew-bonus";

/** Light, dark, or whatever the device is set to (the default). */
export type ThemeChoice = "system" | "light" | "dark";

/** The page background per theme, for the browser bar on phones (globals.css). */
const BAR_COLOURS = { light: "#f6f6f3", dark: "#121212" };

/**
 * Applies the saved theme, or the device's when there's none, to <html> and the browser
 * bar colour. Shared by the <head> script and setThemeChoice, so both decide the same way.
 * Without matchMedia (very old browsers) it stays dark, the server's default.
 */
const APPLY_THEME = `function(){var d=document.documentElement,s=null;try{s=localStorage.getItem("${THEME_KEY}")}catch(e){}var m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)");var dark=s==="dark"||(s!=="light"&&(!m||m.matches));d.classList.toggle("dark",dark);var t=document.querySelector('meta[name="theme-color"]');if(!t){t=document.createElement("meta");t.name="theme-color";document.head.appendChild(t)}t.content=dark?"${BAR_COLOURS.dark}":"${BAR_COLOURS.light}"}`;

/**
 * Runs in <head> before paint, so the page never flashes the wrong theme. It also follows
 * the device live: a phone switching to dark in the evening switches the page too, unless
 * the player picked a theme themselves.
 */
export const PREFERENCES_SCRIPT = `(function(){var d=document.documentElement,c=null,a=window.__ewApplyTheme=${APPLY_THEME};a();try{c=localStorage.getItem("${CONTRAST_KEY}")}catch(e){}if(c==="high")d.dataset.contrast="high";var m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)");if(m&&m.addEventListener)m.addEventListener("change",a)})()`;

const listeners = new Set<() => void>();

export function subscribeToPreferences(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked. The choice still applies until the page reloads.
  }
  listeners.forEach((listener) => listener());
}

export function getThemeChoice(): ThemeChoice {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

export function setThemeChoice(choice: ThemeChoice) {
  const apply = (window as Window & { __ewApplyTheme?: () => void }).__ewApplyTheme;
  try {
    if (choice === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
    apply?.();
  } catch {
    // Storage can be blocked. The choice then applies until the page reloads.
    const dark =
      choice === "dark" || (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  }
  listeners.forEach((listener) => listener());
}

export function isHighContrast(): boolean {
  return document.documentElement.dataset.contrast === "high";
}

export function setHighContrast(high: boolean) {
  if (high) document.documentElement.dataset.contrast = "high";
  else delete document.documentElement.dataset.contrast;
  persist(CONTRAST_KEY, high ? "high" : "normal");
}

/**
 * Whether new endless games roll spare guesses over as bonus guesses. On unless the
 * player switched it off. It's sent when a game starts, so a game in progress keeps its rule.
 */
export function isBonusOn(): boolean {
  try {
    return localStorage.getItem(BONUS_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setBonusOn(on: boolean) {
  persist(BONUS_KEY, on ? "on" : "off");
}
