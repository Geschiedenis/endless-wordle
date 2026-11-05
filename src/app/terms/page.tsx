import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal-draft";

export const metadata: Metadata = {
  title: "Terms | Endless Wordle",
};

export default function TermsPage() {
  return (
    <LegalDraft title="Terms of use">
      <h2>The game</h2>
      <p>Endless Wordle is a free word game, provided as is. It may change or stop at any time.</p>

      <h2>Your account</h2>
      <p>
        Accounts are optional. Keep your password safe, and don&apos;t choose a username that is offensive or
        impersonates someone. We may remove usernames or accounts that break these terms.
      </p>

      <h2>Fair play</h2>
      <p>
        Don&apos;t cheat, automate play or interfere with the service. We may remove scores that we believe were not
        earned fairly.
      </p>

      <h2>Liability</h2>
      <p>[To be completed after legal review, including the governing law.]</p>

      <h2>Contact</h2>
      <p>[Contact email]</p>
    </LegalDraft>
  );
}
