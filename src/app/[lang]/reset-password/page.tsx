import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/server";
import { ResetPasswordForm } from "@/components/account/reset-password-form";
import { PageShell } from "@/components/page-shell";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/reset-password", page: "resetPassword", index: false });
}

export default function ResetPasswordPage() {
  return (
    <PageShell>
      <ResetPasswordForm />
    </PageShell>
  );
}
