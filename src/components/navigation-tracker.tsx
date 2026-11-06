"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageVisit } from "@/lib/in-app-history";

/** Records each page change, for the back buttons. Renders nothing. */
export function NavigationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordPageVisit(pathname);
  }, [pathname]);
  return null;
}
