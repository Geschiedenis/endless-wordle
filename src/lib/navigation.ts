/**
 * Places a login may send someone back to. An allowlist, so a crafted link can't
 * use the login flow to redirect people to another site.
 */
const NEXT_PATHS = ["/play", "/profile", "/reset-password", "/choose-username"] as const;

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
  window.location.assign(path);
}
