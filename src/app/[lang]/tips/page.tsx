import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { TIPS } from "@/content/tips";
import { Link } from "@/i18n/link";
import { getDictionary, getLocale, pageMetadata } from "@/i18n/server";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/tips", page: "tips", description: "tipsDescription" });
}

export default async function TipsPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const tips = TIPS[locale];
  return (
    <PageShell>
      <h1 className="text-3xl font-bold tracking-tight">{tips.title}</h1>
      <p className="mt-2 text-muted-foreground">{tips.intro}</p>
      <ol className="mt-8 flex flex-col gap-7">
        {tips.items.map(({ title, body }, index) => (
          <li key={title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              {index + 1}
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ol>
      <section className="mt-12 flex flex-col items-center gap-2 rounded-xl border bg-muted/40 px-4 py-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{dict.howTo.readyTitle}</h2>
        <p className="text-muted-foreground">{dict.howTo.readyBody}</p>
        <Button asChild className="mt-3 h-12 w-full max-w-xs text-base font-semibold">
          <Link href="/play">{dict.howTo.playNow}</Link>
        </Button>
      </section>
    </PageShell>
  );
}
