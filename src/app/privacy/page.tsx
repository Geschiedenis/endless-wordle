import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy | Endless Wordle",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy notice">
      <p>
        You can play Endless Wordle without an account. This notice explains what personal data we use, why we use it
        and what your rights are under the EU General Data Protection Regulation (GDPR).
      </p>

      <h2>Who is responsible for your data</h2>
      <p>
        Endless Wordle is run by {LEGAL.operator}, based in {LEGAL.country}, who is the data controller. For any
        privacy question or request, email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>

      <h2>What we use, and why</h2>
      <ul>
        <li>
          <strong>If you create an account:</strong> your email address, password (stored only in hashed form),
          username, your game in progress, and for each finished game the words solved, guesses used and date. We use
          these to provide your account, save your scores and send account emails, such as sign-up confirmations and
          password resets. Our legal basis is that this is necessary to provide the service you asked for (GDPR
          Article 6(1)(b)). We can&apos;t create an account without this data.
        </li>
        <li>
          <strong>If you play as a guest:</strong> your game in progress is kept in an encrypted cookie in your
          browser. We don&apos;t store your scores.
        </li>
        <li>
          <strong>Everyone:</strong> your IP address and basic request details are processed to deliver the site, limit
          abusive traffic and keep the service secure. Our legal basis is our legitimate interest in running a safe and
          reliable service (GDPR Article 6(1)(f)).
        </li>
      </ul>
      <p>
        We don&apos;t sell your data, use it for advertising or make automated decisions about you that have legal or
        similarly significant effects. Other players can&apos;t see your username, scores or email address.
      </p>

      <h2>Cookies and local storage</h2>
      <ul>
        <li>
          <strong>Login cookies</strong> keep you logged in. They last until you log out or your session expires.
        </li>
        <li>
          <strong>A game cookie</strong> holds a guest&apos;s game in progress for up to 30 days.
        </li>
        <li>
          <strong>Local storage</strong> in your browser remembers your dark mode and contrast choices until you clear
          it.
        </li>
      </ul>
      <p>
        These are all needed for the features you use, so we don&apos;t ask for consent. We don&apos;t use analytics or
        advertising cookies.
      </p>

      <h2>Who processes your data for us</h2>
      <ul>
        <li>
          <strong>Supabase, Inc.</strong> stores account and score data and sends account emails.
        </li>
        <li>
          <strong>Vercel, Inc.</strong> hosts the site and may keep IP addresses in short-lived server logs.
        </li>
      </ul>
      <p>
        These companies act on our instructions. They are based in the United States, so your data may be processed
        outside the European Economic Area. Where that happens, it is protected by safeguards the GDPR recognises, such
        as an adequacy decision or the European Commission&apos;s Standard Contractual Clauses. Email us for more
        information about these safeguards. We only share data with others if the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account data until you delete your account, which you can do at any time on your{" "}
        <Link href="/profile">profile page</Link>. That removes your account, game in progress and all your scores from
        our database straight away. Copies may remain in our providers&apos; backups and logs for a limited time until
        they are overwritten. IP addresses used to limit traffic are held only briefly in memory.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access your data, correct it, delete it, restrict how we use it, receive a copy in a
        portable format, and object to processing based on legitimate interests. You can change your username and delete
        your account on your profile page. For anything else, email us and we&apos;ll respond within one month.
      </p>
      <p>
        You can also complain to a data protection authority, such as the one where you live or the Dutch{" "}
        <a href="https://www.autoriteitpersoonsgegevens.nl" rel="noreferrer">
          Autoriteit Persoonsgegevens
        </a>
        .
      </p>

      <h2>Children</h2>
      <p>You must be at least 16 to create an account. Guests of any age can play without giving us personal details.</p>

      <h2>Changes to this notice</h2>
      <p>
        If we change this notice, we&apos;ll update it here and change the date at the top. If a change significantly
        affects how we use your data, we&apos;ll also tell account holders by email.
      </p>
    </LegalPage>
  );
}
