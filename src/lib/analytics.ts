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

/** Stops Google Analytics after a Reject, and removes the cookies it set. */
export function stopAnalytics() {
  if (!GA_ID) return;
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });

  // Analytics sets its cookies on the top domain (.endlesswordle.app), so clear both forms.
  const host = window.location.hostname.replace(/^www\./, "");
  for (const name of document.cookie.split(";").map((cookie) => cookie.split("=")[0].trim())) {
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; path=/; max-age=0${domain}`;
    }
  }
}
