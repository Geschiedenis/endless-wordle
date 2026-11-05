import type { Metadata } from "next";
import { LeaderboardView } from "@/components/leaderboard-view";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Leaderboard | Endless Wordle",
};

export default function LeaderboardPage() {
  return (
    <PageShell>
      <LeaderboardView />
    </PageShell>
  );
}
