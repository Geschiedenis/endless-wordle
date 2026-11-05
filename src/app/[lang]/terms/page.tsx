import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/server";
import { Link } from "@/i18n/link";
import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/terms", page: "terms" });
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>
        These terms apply when you use Endless Wordle, a service run by {LEGAL.operator}, based in {LEGAL.country}. By
        using the site, you agree to them. If you don&apos;t agree, please don&apos;t use it.
      </p>

      <h2>The game</h2>
      <p>
        Endless Wordle is a free word game. We may change, pause or stop all or part of it at any time. If we plan to
        close the service for good, we&apos;ll try to give account holders reasonable notice by email.
      </p>
      <p>
        Endless Wordle is an independent project. It isn&apos;t affiliated with or endorsed by The New York Times
        Company, which owns the Wordle game and trademark.
      </p>

      <h2>Your account</h2>
      <p>
        You don&apos;t need an account to play. To create one, you must be at least 16 and give a valid email address.
        Keep your password safe, and tell us if you think someone else is using your account.
      </p>
      <p>
        Your username must not be offensive, break the law, infringe anyone&apos;s rights or impersonate someone. We may
        change or remove a username that breaks these rules.
      </p>

      <h2>Fair use</h2>
      <p>Please don&apos;t:</p>
      <ul>
        <li>cheat, or use bots or other automated tools to play;</li>
        <li>try to get around our rate limits or security, or access data that isn&apos;t yours;</li>
        <li>disrupt the service or overload it;</li>
        <li>copy or reuse the site or its content on a large scale without our permission.</li>
      </ul>
      <p>
        We may remove scores that we reasonably believe weren&apos;t earned fairly. If you seriously or repeatedly break
        these terms, we may suspend or close your account. Where appropriate, we&apos;ll tell you why and give you a
        chance to respond.
      </p>

      <h2>Ending your account</h2>
      <p>
        You can delete your account at any time on your <Link href="/profile">profile page</Link>. This permanently
        removes your scores. Our <Link href="/privacy">privacy notice</Link> explains how we handle your data.
      </p>

      <h2>Our content</h2>
      <p>
        We or our licensors own the rights to the site, its design and its code. You may use them to play the game for
        your own personal, non-commercial enjoyment.
      </p>

      <h2>No guarantees</h2>
      <p>
        We provide the service free of charge and &quot;as is&quot;. We do our best to keep it running, but we can&apos;t
        promise it will always be available or free of errors, or that your scores will never be lost.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, we aren&apos;t liable for damage arising from your use of this free service, or
        from not being able to use it. This doesn&apos;t limit our liability for damage caused by our intent or gross
        negligence, or any liability or consumer right that can&apos;t be limited or excluded by law.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms and will change the date at the top when we do. If a change significantly affects
        you, we&apos;ll tell account holders by email before it takes effect. You can stop using the service and delete
        your account if you don&apos;t agree with the new terms.
      </p>

      <h2>Governing law</h2>
      <p>
        Dutch law applies to these terms, and disputes go to the competent court in the Netherlands. If you&apos;re a
        consumer living in the EU, you keep the protection of the mandatory laws of your country, and you can also bring
        a dispute before the courts where you live.
      </p>

      <h2>Contact</h2>
      <p>
        Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
    </LegalPage>
  );
}
