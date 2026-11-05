import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/account/reset-password-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Set a new password | Endless Wordle",
};

export default function ResetPasswordPage() {
  return (
    <PageShell>
      <ResetPasswordForm />
    </PageShell>
  );
}
