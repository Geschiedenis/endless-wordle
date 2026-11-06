import { isLocale, localePath, splitLocale } from "@/i18n/config";

/**
 * Places a login may send someone back to. An allowlist, so a crafted link can't
 * use the login flow to redirect people to another site.
 */
const NEXT_PATHS = ["/play", "/profile", "/settings", "/reset-password", "/choose-username"] as const;

const DEFAULT_NEXT_PATH = "/play";

export function safeNextPath(value: string | null | undefined): string {
  return NEXT_PATHS.find((path) => path === value) ?? DEFAULT_NEXT_PATH;
}

/**
 * Navigates with a full page load. Hidden pages stay mounted across normal
 * navigations here, so this is how an account change clears everything held in
 * memory: the game, the header and the previous account's data.
 */
export function fullPageLoad(path: string) {
  window.location.assign(inPageLocale(path));
}

/**
 * Keeps a site path in the current page's language, read from <html lang>. Paths
 * that already name a language, and outside URLs, pass through unchanged.
 */
function inPageLocale(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const pageLocale = document.documentElement.lang;
  if (!isLocale(pageLocale) || splitLocale(path).locale) return path;
  return localePath(pageLocale, path);
}
