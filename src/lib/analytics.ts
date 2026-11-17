/**
 * Google Analytics, loaded only after the visitor accepts analytics cookies, and only
 * when NEXT_PUBLIC_GA_ID is set. Nothing is sent to Google before that: this is
 * Google's "basic" consent mode. Advertising stays denied, since the site has no ads.
 * Browser only.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

/** Starts Google Analytics. Safe to call more than once. */
export function startAnalytics() {
  if (!GA_ID) return;
  // A previous Reject in this tab switched it off; switching back on undoes that.
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = false;
  if (loaded) {
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    return;
  }
  loaded = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/** The custom events the site sends, with their parameters. Register each parameter in GA (Admin, Custom definitions) to use it in reports. */
export type AnalyticsEvent =
  | { name: "game_start"; params: { language: string } }
  | { name: "word_solved"; params: { mode: "endless" | "daily"; language: string; guesses: number; word_number: number; word: string } }
  | { name: "word_failed"; params: { mode: "endless" | "daily"; language: string; guesses: number; word_number: number; word: string } }
  | { name: "game_over"; params: { language: string; words_solved: number } }
  | { name: "daily_complete"; params: { language: string; solved: boolean; guesses: number } }
  | { name: "share"; params: { mode: "endless" | "daily"; method: "share_sheet" | "clipboard" } }
  | { name: "language_suggestion"; params: { action: "switch" | "stay"; from: string; to: string } }
  | { name: "login"; params: { method: "email" } }
  | { name: "sign_up"; params: { method: "email" } };

/**
 * Sends a custom event. Does nothing until the visitor accepts analytics: gtag only exists
 * once startAnalytics has run, and a later Reject switches it off. "beacon" lets an event
 * still arrive when a full page load follows straight after, as after logging in.
 */
export function trackEvent<N extends AnalyticsEvent["name"]>(name: N, params: Extract<AnalyticsEvent, { name: N }>["params"]) {
  if (!GA_ID || !loaded) return;
  window.gtag?.("event", name, { ...params, transport_type: "beacon" });
}

/** Stops Google Analytics after a Reject, and removes the cookies it set. */
export function stopAnalytics() {
  if (!GA_ID) return;
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });

  // Analytics sets its cookies on the top domain (.endlesslingle.com), so clear both forms.
  const host = window.location.hostname.replace(/^www\./, "");
  for (const name of document.cookie.split(";").map((cookie) => cookie.split("=")[0].trim())) {
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; path=/; max-age=0${domain}`;
    }
  }
}
