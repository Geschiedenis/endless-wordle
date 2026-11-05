import type { Metadata } from "next";
import { ProfileView } from "@/components/account/profile-view";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Profile | Endless Wordle",
};

export default function ProfilePage() {
  return (
    <PageShell>
      <ProfileView />
    </PageShell>
  );
}
