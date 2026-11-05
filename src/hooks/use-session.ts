"use client";

import { useSyncExternalStore } from "react";
import type { SessionResponse } from "@/lib/account-types";
import { apiRequest } from "@/lib/game/api-client";

export type Session =
  | { status: "loading" }
  | { status: "guest"; accountsEnabled: boolean }
  | { status: "user"; username: string | null };

/**
 * Who is logged in. Fetched once per page load and shared: logging in or out does
 * a full page load, which is what resets it. Hidden pages stay mounted between
 * navigations here, so that also clears anything left from the previous account.
 */
let session: Session = { status: "loading" };
let fetched = false;
const listeners = new Set<() => void>();

function publish(next: Session) {
  session = next;
  listeners.forEach((listener) => listener());
}

async function fetchSession() {
  const response = await apiRequest<SessionResponse>("/api/auth/session");
  if (!response.ok) {
    publish({ status: "guest", accountsEnabled: true });
  } else if (response.data.user) {
    publish({ status: "user", username: response.data.user.username });
  } else {
    publish({ status: "guest", accountsEnabled: response.data.accountsEnabled });
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!fetched) {
    fetched = true;
    void fetchSession();
  }
  return () => {
    listeners.delete(listener);
  };
}

const LOADING: Session = { status: "loading" };

export function useSession(): Session {
  return useSyncExternalStore(subscribe, () => session, () => LOADING);
}

/** Updates the header after a username change, without a page load. */
export function setSessionUsername(username: string) {
  publish({ status: "user", username });
}
