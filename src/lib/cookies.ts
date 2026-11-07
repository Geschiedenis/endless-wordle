/**
 * Every cookie and local storage key the site sets, shown in the cookie dialog and the
 * privacy notice. Update this list whenever one is added or changed. Each item's
 * purpose and duration are in the dictionaries, under cookies.items.<key>.
 */
export type CookieCategory = "necessary" | "analytics" | "advertising";

export interface StorageItem {
  key: "game" | "daily" | "session" | "verifier" | "language" | "preferences" | "consent" | "analytics";
  name: string;
  kind: "cookie" | "localStorage";
  category: CookieCategory;
}

export const COOKIE_CATEGORIES: readonly CookieCategory[] = ["necessary", "analytics", "advertising"];

export const STORAGE_ITEMS: readonly StorageItem[] = [
  { key: "game", name: "ew_game", kind: "cookie", category: "necessary" },
  { key: "daily", name: "ew_daily_<language>", kind: "cookie", category: "necessary" },
  { key: "session", name: "sb-…-auth-token", kind: "cookie", category: "necessary" },
  { key: "verifier", name: "sb-…-auth-token-code-verifier", kind: "cookie", category: "necessary" },
  { key: "language", name: "ew-lang", kind: "cookie", category: "necessary" },
  { key: "preferences", name: "ew-theme, ew-contrast", kind: "localStorage", category: "necessary" },
  { key: "consent", name: "ew-cookie-consent", kind: "localStorage", category: "necessary" },
  { key: "analytics", name: "_ga, _ga_<id>", kind: "cookie", category: "analytics" },
];
