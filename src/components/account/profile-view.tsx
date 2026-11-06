"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { FormMessage } from "@/components/account/form-message";
import { UsernameField } from "@/components/account/username-field";
import { BackButton } from "@/components/back-button";
import { Flag } from "@/components/flag";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import { setSessionUsername } from "@/hooks/use-session";
import { LOCALE_NAMES } from "@/i18n/config";
import { errorMessage, rich } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { NO_USERNAME_CONFIRMATION, type ProfileResponse } from "@/lib/account-types";
import { apiRequest, apiSend } from "@/lib/game/api-client";
import { fullPageLoad } from "@/lib/navigation";
import { findUsernameProblem, usernameProblemMessage } from "@/lib/username";

type State = { status: "loading" } | { status: "failed" } | { status: "user"; profile: ProfileResponse };

/** A logged-in player's stats, recent games and account. Display settings are on /settings. */
export function ProfileView() {
  const { dict } = useI18n();
  const t = dict.profile;
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    void apiRequest<ProfileResponse>("/api/profile").then((response) => {
      if (!active) return;
      if (response.ok && response.data.username === null) fullPageLoad("/choose-username?next=/profile");
      else if (response.ok) setState({ status: "user", profile: response.data });
      else if (response.error === "unauthorized") fullPageLoad("/login?next=/profile");
      else setState({ status: "failed" });
    });
    return () => {
      active = false;
    };
  }, []);

  if (state.status === "failed") return <p role="alert">{t.loadError}</p>;
  if (state.status !== "user") return <p className="text-muted-foreground">{t.loading}</p>;

  const { profile } = state;
  const username = profile.username!;
  const setProfile = (next: ProfileResponse) => setState({ status: "user", profile: next });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <BackButton />
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground uppercase"
        >
          {username[0]}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-bold tracking-tight">{username}</h1>
        </div>
      </header>

      <Statistics profile={profile} />

      <SectionCard title={t.accountTitle}>
        <ChangeUsername
          current={username}
          onChanged={(next) => {
            setProfile({ ...profile, username: next });
            setSessionUsername(next);
          }}
        />
      </SectionCard>

      <DeleteAccount username={username} />
    </div>
  );
}

function Statistics({ profile }: { profile: ProfileResponse }) {
  const { locale, dict } = useI18n();
  const t = dict.profile;
  const { stats, recentGames } = profile;
  return (
    <SectionCard title={t.statsTitle}>
      <dl className="grid grid-cols-3 gap-2 text-center">
        <Stat label={t.bestScore} value={stats.bestScore} />
        <Stat label={t.gamesPlayed} value={stats.gamesPlayed} />
        <Stat label={t.averageWords} value={stats.averageWords.toLocaleString(locale)} />
      </dl>

      <h3 className="mt-6 text-sm font-semibold">{t.recentGames}</h3>
      {recentGames.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{t.noGames}</p>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th scope="col" className="py-1.5 font-medium">{t.date}</th>
                <th scope="col" className="py-1.5 font-medium">{t.language}</th>
                <th scope="col" className="py-1.5 text-right font-medium">{t.wordsSolved}</th>
                <th scope="col" className="py-1.5 text-right font-medium">{t.guesses}</th>
              </tr>
            </thead>
            <tbody>
              {recentGames.map((game) => (
                <tr key={game.playedAt} className="border-t">
                  <td className="py-1.5">{new Date(game.playedAt).toLocaleDateString(locale)}</td>
                  <td className="py-1.5">
                    <Flag locale={game.language} />
                    <span className="sr-only">{LOCALE_NAMES[game.language]}</span>
                  </td>
                  <td className="py-1.5 text-right tabular-nums">{game.wordsSolved}</td>
                  <td className="py-1.5 text-right tabular-nums">{game.totalGuesses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col-reverse rounded-lg bg-muted px-1 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  );
}

function ChangeUsername({ current, onChanged }: { current: string; onChanged: (username: string) => void }) {
  const { dict } = useI18n();
  const t = dict.profile;
  const [username, setUsername] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSuccess(null);
    const problem = findUsernameProblem(username);
    if (problem) return setError(usernameProblemMessage(problem, dict));

    setBusy(true);
    setError(null);
    const response = await apiSend("/api/profile/username", "PUT", { username });
    if (response.ok) {
      onChanged(username);
      setSuccess(t.usernameUpdated);
    } else {
      setError(errorMessage(dict, response));
    }
    setBusy(false);
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="flex max-w-sm flex-col gap-3">
      <FormMessage error={error} success={success} />
      <UsernameField value={username} onChange={setUsername} label={t.changeUsername} />
      <Button type="submit" disabled={busy || username === current} className="h-10 self-start px-4">
        {t.saveUsername}
      </Button>
    </form>
  );
}

function DeleteAccount({ username }: { username: string | null }) {
  const { dict } = useI18n();
  const t = dict.profile;
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
    setError(errorMessage(dict, response));
    setBusy(false);
  }

  return (
    <SectionCard title={t.deleteTitle} description={t.deleteWarning} tone="danger">
      {!open ? (
        <Button variant="destructive" onClick={() => setOpen(true)} className="h-10 px-4">
          {t.deleteOpen}
        </Button>
      ) : (
        <form onSubmit={(event) => void submit(event)} className="flex max-w-sm flex-col gap-3">
          <FormMessage error={error} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-delete">{rich(t.deleteConfirm, { word: <strong>{expected}</strong> })}</Label>
            <InputWithIcon
              icon={Trash2}
              id="confirm-delete"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="destructive" disabled={busy || confirm !== expected} className="h-10 px-4">
              {t.deleteSubmit}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-10 px-4">
              {t.cancel}
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  );
}
