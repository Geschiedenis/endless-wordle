"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FormMessage } from "@/components/account/form-message";
import { UsernameField } from "@/components/account/username-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSessionUsername } from "@/hooks/use-session";
import { NO_USERNAME_CONFIRMATION, type ProfileResponse } from "@/lib/account-types";
import { apiRequest, apiSend } from "@/lib/game/api-client";
import { fullPageLoad } from "@/lib/navigation";
import { findUsernameProblem, usernameProblemMessage } from "@/lib/username";

export function ProfileView() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void apiRequest<ProfileResponse>("/api/profile").then((response) => {
      if (!active) return;
      if (response.ok && response.data.username === null) {
        fullPageLoad("/choose-username?next=/profile");
      } else if (response.ok) {
        setProfile(response.data);
      } else if (response.error === "unauthorized") {
        fullPageLoad("/login?next=/profile");
      } else {
        setFailed(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (failed) return <p role="alert">Your profile couldn&apos;t load. Please try again.</p>;
  if (!profile?.username) return <p className="text-muted-foreground">Loading…</p>;

  const { stats, recentGames, username } = profile;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="truncate text-3xl font-bold tracking-tight">{username}</h1>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Best score" value={stats.bestScore} />
        <Stat label="Games played" value={stats.gamesPlayed} />
        <Stat label="Average words" value={stats.averageWords} />
      </dl>

      <section aria-labelledby="recent-games">
        <h2 id="recent-games" className="text-xl font-semibold">
          Recent games
        </h2>
        {recentGames.length === 0 ? (
          <p className="mt-2 text-muted-foreground">
            No games yet. Finished games appear here while you&apos;re logged in.
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th scope="col" className="py-1.5 font-medium">Date</th>
                  <th scope="col" className="py-1.5 text-right font-medium">Words solved</th>
                  <th scope="col" className="py-1.5 text-right font-medium">Guesses</th>
                </tr>
              </thead>
              <tbody>
                {recentGames.map((game) => (
                  <tr key={game.playedAt} className="border-t">
                    <td className="py-1.5">{new Date(game.playedAt).toLocaleDateString()}</td>
                    <td className="py-1.5 text-right tabular-nums">{game.wordsSolved}</td>
                    <td className="py-1.5 text-right tabular-nums">{game.totalGuesses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ChangeUsername
        current={username}
        onChanged={(next) => {
          setProfile({ ...profile, username: next });
          setSessionUsername(next);
        }}
      />
      <DeleteAccount username={username} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col-reverse rounded-md bg-muted px-1 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}

function ChangeUsername({ current, onChanged }: { current: string; onChanged: (username: string) => void }) {
  const [username, setUsername] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSuccess(null);
    const problem = findUsernameProblem(username);
    if (problem) return setError(usernameProblemMessage(problem));

    setBusy(true);
    setError(null);
    const response = await apiSend("/api/profile/username", "PUT", { username });
    if (response.ok) {
      onChanged(username);
      setSuccess("Username updated.");
    } else {
      setError(response.message);
    }
    setBusy(false);
  }

  return (
    <section aria-labelledby="change-username">
      <h2 id="change-username" className="text-xl font-semibold">
        Change username
      </h2>
      <form onSubmit={(event) => void submit(event)} className="mt-2 flex max-w-sm flex-col gap-3">
        <UsernameField value={username} onChange={setUsername} label="New username" />
        <FormMessage error={error} success={success} />
        <Button type="submit" disabled={busy || username === current} className="h-10 self-start px-4">
          Save username
        </Button>
      </form>
    </section>
  );
}

function DeleteAccount({ username }: { username: string | null }) {
  const expected = username ?? NO_USERNAME_CONFIRMATION;
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await apiSend("/api/profile", "DELETE", { confirm });
    if (response.ok) return fullPageLoad("/");
    setError(response.message);
    setBusy(false);
  }

  return (
    <section aria-labelledby="delete-account">
      <h2 id="delete-account" className="text-xl font-semibold">
        Delete account
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This permanently removes your account and all your scores. It can&apos;t be undone.
      </p>
      {!open ? (
        <Button variant="destructive" onClick={() => setOpen(true)} className="mt-3 h-10 px-4">
          Delete my account
        </Button>
      ) : (
        <form onSubmit={(event) => void submit(event)} className="mt-3 flex max-w-sm flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-delete">
              Type <strong>{expected}</strong> to confirm
            </Label>
            <Input
              id="confirm-delete"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="h-11"
            />
          </div>
          <FormMessage error={error} />
          <div className="flex gap-2">
            <Button type="submit" variant="destructive" disabled={busy || confirm !== expected} className="h-10 px-4">
              Delete permanently
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-10 px-4">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
