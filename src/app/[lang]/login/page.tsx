import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/server";
import { LoginForm } from "@/components/account/login-form";
import { PageShell } from "@/components/page-shell";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/login", page: "login", index: false });
}

export default function LoginPage() {
  return (
    <PageShell>
      <LoginForm />
    </PageShell>
  );
}
