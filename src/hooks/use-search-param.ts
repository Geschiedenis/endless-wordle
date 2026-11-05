"use client";

import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

/**
 * One query parameter, read in the browser after hydration. Unlike useSearchParams,
 * this needs no Suspense boundary, so the page around it prerenders fully, including
 * its language. Null while prerendering and on the first client render.
 */
export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    noSubscription,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}
