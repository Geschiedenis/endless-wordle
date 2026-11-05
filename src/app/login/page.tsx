import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/account/login-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Login | Endless Wordle",
};

export default function LoginPage() {
  return (
    <PageShell>
      <Suspense>
        <LoginForm />
      </Suspense>
    </PageShell>
  );
}
