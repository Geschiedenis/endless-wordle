import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/server";
import { ChooseUsernameForm } from "@/components/account/choose-username-form";
import { PageShell } from "@/components/page-shell";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/choose-username", page: "chooseUsername", index: false });
}

export default function ChooseUsernamePage() {
  return (
    <PageShell>
      <ChooseUsernameForm />
    </PageShell>
  );
}
