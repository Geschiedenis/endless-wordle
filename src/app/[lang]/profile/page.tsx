import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/server";
import { ProfileView } from "@/components/account/profile-view";
import { PageShell } from "@/components/page-shell";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/profile", page: "profile", index: false });
}

export default function ProfilePage() {
  return (
    <PageShell>
      <ProfileView />
    </PageShell>
  );
}
