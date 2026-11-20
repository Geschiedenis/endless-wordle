import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/content/about";
import { Link } from "@/i18n/link";
import { getLocale, pageMetadata } from "@/i18n/server";
import { LEGAL } from "@/lib/legal";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/contact", page: "contact", description: "contactDescription" });
}

/**
 * How to reach us. No form: the button opens the visitor's own email app, so nothing is
 * sent through the site and there's no extra personal data to store.
 */
export default async function ContactPage() {
  const locale = await getLocale();
  const t = CONTACT[locale];
  // The language in the subject tells us which version of the site they wrote from.
  const mailto = `mailto:${LEGAL.email}?subject=${encodeURIComponent(`${t.subject} (${locale})`)}`;

  return (
    <PageShell wide>
      <PageHeading>{t.title}</PageHeading>
      <p className="mt-2 text-muted-foreground">{t.intro}</p>

      <section aria-labelledby="email" className="mt-8 rounded-xl border bg-muted/30 p-5">
        <h2 id="email" className="text-lg font-semibold">
          {t.emailTitle}
        </h2>
        <p className="mt-1 text-muted-foreground">{t.emailBody}</p>
        <p className="mt-3 text-lg font-medium break-all select-all">{LEGAL.email}</p>
        <Button asChild className="mt-4 h-11 w-full text-base font-semibold sm:w-auto sm:px-6">
          <a href={mailto}>
            <Mail aria-hidden="true" />
            {t.emailCta}
          </a>
        </Button>
      </section>

      <section aria-labelledby="reasons" className="mt-8">
        <h2 id="reasons" className="text-lg font-semibold">
          {t.reasonsTitle}
        </h2>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-muted-foreground">
          {t.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-muted-foreground">
        {t.faqNote}{" "}
        <Link href="/faq" className="text-foreground underline underline-offset-2">
          {t.faqLink}
        </Link>
        .
      </p>
    </PageShell>
  );
}
