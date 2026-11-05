/** Display preferences. They live on <html> and in localStorage, per browser. */

const THEME_KEY = "ew-theme";
const CONTRAST_KEY = "ew-contrast";

/** Runs in <head> before paint. <html> starts out dark, so only a saved light theme changes it. */
export const PREFERENCES_SCRIPT = `(function(){var d=document.documentElement,t=null,c=null;try{t=localStorage.getItem("${THEME_KEY}");c=localStorage.getItem("${CONTRAST_KEY}")}catch(e){}if(t==="light")d.classList.remove("dark");if(c==="high")d.dataset.contrast="high"})()`;

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

export function isDarkTheme(): boolean {
  return document.documentElement.classList.contains("dark");
}

export function setDarkTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  persist(THEME_KEY, dark ? "dark" : "light");
}

export function isHighContrast(): boolean {
  return document.documentElement.dataset.contrast === "high";
}

export function setHighContrast(high: boolean) {
  if (high) document.documentElement.dataset.contrast = "high";
  else delete document.documentElement.dataset.contrast;
  persist(CONTRAST_KEY, high ? "high" : "normal");
}
