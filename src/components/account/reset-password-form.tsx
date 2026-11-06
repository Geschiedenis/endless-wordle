"use client";

import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/account/form-message";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { errorMessage, format } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { apiSend } from "@/lib/game/api-client";
import { fullPageLoad } from "@/lib/navigation";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

export function ResetPasswordForm() {
  const { dict } = useI18n();
  const t = dict.resetPassword;
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const mismatch = repeatPassword !== "" && repeatPassword !== password;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    // The hint under the repeat field already says what's wrong, so just send the visitor there.
    if (password !== repeatPassword) {
      document.getElementById("repeat-password")?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    const response = await apiSend("/api/auth/update-password", "POST", { password });
    if (response.ok) return fullPageLoad("/play");
    setError(
      response.error === "invalid_request" ? format(t.tooShort, { min: PASSWORD_MIN_LENGTH }) : errorMessage(dict, response),
    );
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-center text-3xl font-bold tracking-tight">{t.title}</h1>
      <FormMessage error={error} className="mt-6" />
      <form onSubmit={(event) => void submit(event)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password">{t.newPassword}</Label>
          <PasswordInput
            id="new-password"
            required
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="repeat-password">{dict.login.repeatPassword}</Label>
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
              {dict.login.passwordMismatch}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{format(t.help, { min: PASSWORD_MIN_LENGTH })}</p>
        </div>
        <Button type="submit" disabled={busy} className="h-11 text-base font-semibold">
          {t.submit}
        </Button>
      </form>
    </div>
  );
}
