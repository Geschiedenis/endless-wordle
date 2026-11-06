import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

/**
 * The width of the home page's sections. The help pages (FAQ, how to play, tips) use it
 * too, so they line up with the home page.
 */
export const WIDE_CONTENT = "max-w-3xl";

export function PageShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col px-4">
      <SiteHeader />
      <main className={cn("mx-auto w-full flex-1 py-6", wide ? WIDE_CONTENT : "max-w-2xl")}>{children}</main>
      <SiteFooter />
    </div>
  );
}
