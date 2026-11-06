/**
 * The visitor's cookie choice, kept in local storage per browser.
 *
 * Google Analytics follows "analytics" (see src/lib/analytics.ts). Nothing uses
 * "advertising" yet. Anything optional must check hasConsent and use
 * subscribeToConsent to react when the choice changes. When optional cookies are
 * added or changed, list them in STORAGE_ITEMS and raise CONSENT_VERSION, which asks
 * everyone again.
 */

const STORAGE_KEY = "ew-cookie-consent";
/** Raise this when the optional cookies change, so everyone is asked again. */
const CONSENT_VERSION = 2; // 2: Google Analytics added
/** A choice is asked again after this long. */
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export interface Consent {
  version: number;
  analytics: boolean;
  advertising: boolean;
  /** ISO date, kept as a record of when the choice was made. */
  decidedAt: string;
}

const listeners = new Set<() => void>();
let settingsRequested = false;

export function subscribeToConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

/** The current choice, or null if the visitor still needs to be asked. */
export function getConsent(): Consent | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Consent | null;
    if (!saved || saved.version !== CONSENT_VERSION) return null;
    if (Date.now() - Date.parse(saved.decidedAt) > MAX_AGE_MS) return null;
    return saved;
  } catch {
    return null;
  }
}

export function hasConsent(category: "analytics" | "advertising"): boolean {
  return getConsent()?.[category] ?? false;
}

export function saveConsent(choice: { analytics: boolean; advertising: boolean }) {
  const consent: Consent = { version: CONSENT_VERSION, ...choice, decidedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    // The notice from before consent existed.
    localStorage.removeItem("ew-cookie-notice");
  } catch {
    // Storage can be blocked. The choice then applies until the page reloads, and
    // optional cookies stay off after that because no consent is found.
  }
  settingsRequested = false;
  notify();
}

/** Reopens the cookie dialog, so a choice can be changed as easily as it was made. */
export function openCookieSettings() {
  settingsRequested = true;
  notify();
}

export function isCookieSettingsRequested(): boolean {
  return settingsRequested;
}

export function closeCookieSettings() {
  settingsRequested = false;
  notify();
}
