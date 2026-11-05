import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { LEGAL } from "@/lib/legal";

/**
 * Privacy and terms are only in English, since a legal translation should be checked
 * by a fluent speaker first. Other languages get a note saying so, in their language.
 */
export async function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <PageShell>
      {locale !== DEFAULT_LOCALE && (
        <p className="mb-6 rounded-md border px-3 py-2 text-sm text-muted-foreground">{dict.legal.englishOnly}</p>
      )}
      <div lang="en">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LEGAL.lastUpdated}</p>
        <div className="mt-6 flex flex-col gap-4 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </PageShell>
  );
}
