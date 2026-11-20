import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WIDE_CONTENT } from "@/lib/layout";
import { cn } from "@/lib/utils";

export { WIDE_CONTENT };

export function PageShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col px-4">
      <SiteHeader />
      <main className={cn("mx-auto w-full flex-1 py-6", wide ? WIDE_CONTENT : "max-w-2xl")}>{children}</main>
      <SiteFooter />
    </div>
  );
}
