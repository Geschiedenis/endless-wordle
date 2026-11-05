"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { FormMessage } from "@/components/account/form-message";
import { UsernameField } from "@/components/account/username-field";
import { Button } from "@/components/ui/button";
import { apiSend } from "@/lib/game/api-client";
import { fullPageLoad, safeNextPath } from "@/lib/navigation";
import { findUsernameProblem, usernameProblemMessage } from "@/lib/username";

export function ChooseUsernameForm() {
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const problem = findUsernameProblem(username);
    if (problem) return setError(usernameProblemMessage(problem));

    setBusy(true);
    setError(null);
    const response = await apiSend("/api/profile/username", "PUT", { username });
    if (response.ok) return fullPageLoad(safeNextPath(params.get("next")));
    setError(response.message);
    setBusy(false);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-center text-3xl font-bold tracking-tight">Choose a username</h1>
      <p className="mt-2 text-center text-muted-foreground">This is the name on your account.</p>
      <form onSubmit={(event) => void submit(event)} className="mt-6 flex flex-col gap-4">
        <UsernameField value={username} onChange={setUsername} />
        <FormMessage error={error} />
        <Button type="submit" disabled={busy} className="h-11 text-base font-semibold">
          Continue
        </Button>
      </form>
    </div>
  );
}
