"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { FormMessage } from "@/components/account/form-message";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { errorMessage, format, rich } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { useSearchParam } from "@/hooks/use-search-param";
import type { LoginResponse, SignupResponse } from "@/lib/account-types";
import { apiSend } from "@/lib/game/api-client";
import { fullPageLoad, safeNextPath } from "@/lib/navigation";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

type Mode = "login" | "signup" | "forgot";

export function LoginForm() {
  const { locale, dict } = useI18n();
  const t = dict.login;
  const next = safeNextPath(useSearchParam("next"));
  /** Set by the email link callback when a link didn't work. */
  const linkFailed = useSearchParam("error") !== null;
  const usernamePath = `/choose-username?next=${encodeURIComponent(next)}`;

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /** Sign-up asks for the password twice, to catch typos before they lock someone out. */
  const [repeatPassword, setRepeatPassword] = useState("");
  const mismatch = mode === "signup" && repeatPassword !== "" && repeatPassword !== password;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  /** The link error shows until the visitor does something else. */
  const [acted, setActed] = useState(false);
  const shownError = error ?? (linkFailed && !acted ? t.linkError : null);

  const titles: Record<Mode, { title: string; submit: string }> = {
    login: { title: t.loginTitle, submit: t.loginSubmit },
    signup: { title: t.signupTitle, submit: t.signupSubmit },
    forgot: { title: t.forgotTitle, submit: t.forgotSubmit },
  };

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setRepeatPassword("");
    setActed(true);
    setError(null);
    setSuccess(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setActed(true);
    // The hint under the repeat field already says what's wrong, so just send the visitor there.
    if (mode === "signup" && password !== repeatPassword) {
      document.getElementById("repeat-password")?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);

    if (mode === "login") {
      const response = await apiSend<LoginResponse>("/api/auth/login", "POST", { email, password });
      if (response.ok) return fullPageLoad(response.data.needsUsername ? usernamePath : next);
      setError(errorMessage(dict, response));
    } else if (mode === "signup") {
      // The language goes with the account, so its emails are written in it.
      const response = await apiSend<SignupResponse>("/api/auth/signup", "POST", { email, password, locale });
      if (response.ok && response.data.status === "signed_in") return fullPageLoad(usernamePath);
      if (response.ok) {
        setSuccess(t.checkEmail);
        setPassword("");
        setRepeatPassword("");
      }
      else setError(errorMessage(dict, response));
    } else {
      const response = await apiSend("/api/auth/forgot-password", "POST", { email });
      if (response.ok) setSuccess(t.resetSent);
      else setError(errorMessage(dict, response));
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <PageHeading align="center">{titles[mode].title}</PageHeading>

      <FormMessage error={shownError} success={success} className="mt-6" />

      <form onSubmit={(event) => void submit(event)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t.email}</Label>
          <InputWithIcon
            icon={Mail}
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
            <Label htmlFor="password">{t.password}</Label>
            <PasswordInput
              id="password"
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={mode === "signup" ? PASSWORD_MIN_LENGTH : undefined}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11"
            />
          </div>
        )}

        {mode === "signup" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="repeat-password">{t.repeatPassword}</Label>
            <PasswordInput
              id="repeat-password"
              required
              autoComplete="new-password"
              maxLength={72}
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              aria-invalid={mismatch || undefined}
              aria-describedby={mismatch ? "repeat-password-hint" : undefined}
              className="h-11"
            />
            {mismatch && (
              <p id="repeat-password-hint" className="text-xs text-destructive">
                {t.passwordMismatch}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{format(t.passwordHelp, { min: PASSWORD_MIN_LENGTH })}</p>
          </div>
        )}

        <Button type="submit" disabled={busy} className="h-11 text-base font-semibold">
          {titles[mode].submit}
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        {mode === "login" && (
          <>
            <TextButton onClick={() => switchMode("signup")}>{t.needAccount}</TextButton>
            <TextButton onClick={() => switchMode("forgot")}>{t.forgotPassword}</TextButton>
          </>
        )}
        {mode !== "login" && <TextButton onClick={() => switchMode("login")}>{t.backToLogin}</TextButton>}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {rich(t.footnote, {
          privacy: (
            <Link href="/privacy" className="underline underline-offset-2">
              {t.privacyLink}
            </Link>
          ),
          terms: (
            <Link href="/terms" className="underline underline-offset-2">
              {t.termsLink}
            </Link>
          ),
        })}
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
