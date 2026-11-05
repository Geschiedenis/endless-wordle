import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col px-4">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 py-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
