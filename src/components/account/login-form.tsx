"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FormMessage } from "@/components/account/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginResponse, SignupResponse } from "@/lib/account-types";
import { apiSend } from "@/lib/game/api-client";
import { fullPageLoad, safeNextPath } from "@/lib/navigation";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

type Mode = "login" | "signup" | "forgot";

const COPY: Record<Mode, { title: string; submit: string }> = {
  login: { title: "Log in", submit: "Log in" },
  signup: { title: "Create an account", submit: "Sign up" },
  forgot: { title: "Reset your password", submit: "Send reset link" },
};

export function LoginForm() {
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const usernamePath = `/choose-username?next=${encodeURIComponent(next)}`;

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("error")
      ? "That link didn't work. It may have expired, or been opened in a different browser. If you were confirming your email, try logging in. Otherwise, please request a new link."
      : null,
  );
  const [success, setSuccess] = useState<string | null>(null);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
    setSuccess(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(null);

    if (mode === "login") {
      const response = await apiSend<LoginResponse>("/api/auth/login", "POST", { email, password });
      if (response.ok) return fullPageLoad(response.data.needsUsername ? usernamePath : next);
      setError(response.message);
    } else if (mode === "signup") {
      const response = await apiSend<SignupResponse>("/api/auth/signup", "POST", { email, password });
      if (response.ok && response.data.status === "signed_in") return fullPageLoad(usernamePath);
      if (response.ok) setSuccess("Check your email for a link to finish signing up.");
      else setError(response.message);
    } else {
      const response = await apiSend("/api/auth/forgot-password", "POST", { email });
      if (response.ok) setSuccess("If that email has an account, a reset link is on its way.");
      else setError(response.message);
    }
    setBusy(false);
  }

  async function continueWithGoogle() {
    setBusy(true);
    setError(null);
    const response = await apiSend<{ url: string }>("/api/auth/google", "POST", { next });
    if (response.ok) return fullPageLoad(response.data.url);
    setError(response.message);
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-center text-3xl font-bold tracking-tight">{COPY[mode].title}</h1>

      <form onSubmit={(event) => void submit(event)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11"
          />
        </div>

        {mode !== "forgot" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={mode === "signup" ? PASSWORD_MIN_LENGTH : undefined}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11"
            />
            {mode === "signup" && (
              <p className="text-xs text-muted-foreground">At least {PASSWORD_MIN_LENGTH} characters.</p>
            )}
          </div>
        )}

        <FormMessage error={error} success={success} />

        <Button type="submit" disabled={busy} className="h-11 text-base font-semibold">
          {COPY[mode].submit}
        </Button>
      </form>

      {mode !== "forgot" && (
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => void continueWithGoogle()}
          className="mt-3 h-11 w-full text-base"
        >
          Continue with Google
        </Button>
      )}

      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        {mode === "login" && (
          <>
            <TextButton onClick={() => switchMode("signup")}>Need an account? Sign up</TextButton>
            <TextButton onClick={() => switchMode("forgot")}>Forgot your password?</TextButton>
          </>
        )}
        {mode !== "login" && <TextButton onClick={() => switchMode("login")}>Back to log in</TextButton>}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Accounts are optional. An account stores your email, username and scores. See the{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy notice
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="underline underline-offset-2">
          terms
        </Link>
        .
      </p>
    </div>
  );
}

function TextButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} className="rounded-sm underline underline-offset-2">
      {children}
    </button>
  );
}
