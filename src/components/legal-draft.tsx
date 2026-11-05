import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";

export function LegalDraft({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p role="note" className="mt-3 rounded-md border-2 border-dashed px-3 py-2 text-sm font-semibold">
        Draft: not yet legally reviewed. Replace the items in [brackets] before relying on this page.
      </p>
      <div className="mt-6 flex flex-col gap-4 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </PageShell>
  );
}
