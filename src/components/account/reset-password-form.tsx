"use client";

import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/account/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiSend } from "@/lib/game/api-client";
import { fullPageLoad } from "@/lib/navigation";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await apiSend("/api/auth/update-password", "POST", { password });
    if (response.ok) return fullPageLoad("/play");
    setError(response.error === "invalid_request" ? `Use at least ${PASSWORD_MIN_LENGTH} characters.` : response.message);
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-center text-3xl font-bold tracking-tight">Set a new password</h1>
      <form onSubmit={(event) => void submit(event)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            required
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">At least {PASSWORD_MIN_LENGTH} characters.</p>
        </div>
        <FormMessage error={error} />
        <Button type="submit" disabled={busy} className="h-11 text-base font-semibold">
          Save password
        </Button>
      </form>
    </div>
  );
}
