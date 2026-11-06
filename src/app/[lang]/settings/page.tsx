import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SettingsView } from "@/components/settings-view";
import { pageMetadata } from "@/i18n/server";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/settings", page: "settings", index: false });
}

export default function SettingsPage() {
  return (
    <PageShell>
      <SettingsView />
    </PageShell>
  );
}
