import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";
import { LEGAL } from "@/lib/legal";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {LEGAL.lastUpdated}</p>
      <div className="mt-6 flex flex-col gap-4 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
        {children}
      </div>
    </PageShell>
  );
}
