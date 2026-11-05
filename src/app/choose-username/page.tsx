import { Suspense } from "react";
import type { Metadata } from "next";
import { ChooseUsernameForm } from "@/components/account/choose-username-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Choose a username | Endless Wordle",
};

export default function ChooseUsernamePage() {
  return (
    <PageShell>
      <Suspense>
        <ChooseUsernameForm />
      </Suspense>
    </PageShell>
  );
}
