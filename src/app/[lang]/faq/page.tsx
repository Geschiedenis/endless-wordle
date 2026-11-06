import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ } from "@/content/faq";
import { format, rich } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { getLocale, pageMetadata } from "@/i18n/server";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/faq", page: "faq", description: "faqDescription" });
}

export default async function FaqPage() {
  const locale = await getLocale();
  const faq = FAQ[locale];
  const links = {
    howToPlay: <Link href="/how-to-play">{faq.links.howToPlay}</Link>,
    tips: <Link href="/tips">{faq.links.tips}</Link>,
    privacy: <Link href="/privacy">{faq.links.privacy}</Link>,
  };

  /** The questions and answers in schema.org terms, as plain text. */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faq.items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: format(answer, faq.links) },
    })),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        // Escaping < keeps the JSON from ever closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <h1 className="text-3xl font-bold tracking-tight">{faq.title}</h1>
      <p className="mt-2 text-muted-foreground [&_a]:underline [&_a]:underline-offset-2">{rich(faq.intro, links)}</p>
      {/* Answers stay in the page while closed, so search engines and in-page search still find them. */}
      {/* Each question is a card, like the settings page. The whole card header opens it. */}
      <Accordion type="multiple" className="mt-6 flex flex-col gap-3 [&_a]:underline [&_a]:underline-offset-2">
        {faq.items.map(({ question, answer }, index) => (
          <AccordionItem
            key={question}
            value={`q${index}`}
            className="overflow-hidden rounded-xl border bg-muted/30 transition-colors last:border-b data-[state=open]:bg-muted/50"
          >
            <AccordionTrigger className="items-center px-5 py-4 text-base font-semibold hover:bg-muted/50 hover:no-underline focus-visible:ring-inset">
              {question}
            </AccordionTrigger>
            <AccordionContent forceMount className="px-5 pt-0 pb-5 text-base text-muted-foreground">
              {rich(answer, links)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageShell>
  );
}
