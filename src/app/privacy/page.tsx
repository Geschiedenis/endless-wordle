import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal-draft";

export const metadata: Metadata = {
  title: "Privacy | Endless Wordle",
};

export default function PrivacyPage() {
  return (
    <LegalDraft title="Privacy notice">
      <p>You can play Endless Wordle without an account. This page explains what we store if you do, and why.</p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>With an account:</strong> your email address, your username, and for each finished game the
          words solved, guesses used and date. If you use Google sign-in, Google shares your email address with
          us.
        </li>
        <li>
          <strong>Without an account:</strong> no personal data. Your game is kept in a cookie in your browser.
        </li>
        <li>
          <strong>Everyone:</strong> your IP address is used briefly in memory to limit abusive traffic. Our
          hosting provider may also keep it in short-lived server logs.
        </li>
      </ul>

      <h2>What others can see</h2>
      <p>Your username and best scores can appear on the public leaderboard. Your email address never does.</p>

      <h2>Cookies and local storage</h2>
      <ul>
        <li>Login cookies keep you logged in.</li>
        <li>A game cookie holds a guest&apos;s game in progress.</li>
        <li>Your browser&apos;s local storage remembers your dark mode and contrast choices.</li>
      </ul>
      <p>These are all needed for the site to work. We don&apos;t use advertising or analytics cookies.</p>

      <h2>Who processes your data</h2>
      <p>
        Supabase stores account and score data and sends account emails. Vercel hosts the site. Google is involved
        only if you choose Google sign-in.
      </p>

      <h2>How long we keep it, and your choices</h2>
      <p>
        We keep your data until you delete your account, which you can do at any time on your profile page. That
        removes your account and all your scores. You can change your username there as well.
      </p>
      <p>
        You may have further rights under the law where you live, such as to access or correct your data. To ask,
        contact [contact email].
      </p>

      <h2>Who we are</h2>
      <p>[Name and address of the person or company running this site, and the legal basis for processing.]</p>
    </LegalDraft>
  );
}
