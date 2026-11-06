"use client";

import { useEffect } from "react";
import { GA_ID, startAnalytics, stopAnalytics } from "@/lib/analytics";
import { hasConsent, subscribeToConsent } from "@/lib/consent";

/** Follows the visitor's cookie choice: starts Analytics on Accept, stops it on Reject. */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    let running = false;
    const apply = () => {
      const allowed = hasConsent("analytics");
      if (allowed && !running) startAnalytics();
      if (!allowed && running) stopAnalytics();
      running = allowed;
    };
    apply();
    return subscribeToConsent(apply);
  }, []);
  return null;
}
