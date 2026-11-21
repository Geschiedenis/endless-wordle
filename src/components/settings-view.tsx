"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBonusGuesses, useHighContrast, useThemeChoice } from "@/hooks/use-preferences";
import { useSession } from "@/hooks/use-session";
import { Link } from "@/i18n/link";
import { localePath } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { gameApi } from "@/lib/game/api-client";
import { openCookieSettings } from "@/lib/consent";
import { format } from "@/i18n/format";
import { MAX_BONUS_GUESSES } from "@/lib/game/constants";
import { setBonusOn, setHighContrast, setThemeChoice, type ThemeChoice } from "@/lib/preferences";

/** Display and cookie preferences, for everyone. Guests also get an invitation to sign up. */
export function SettingsView() {
  const { dict, locale } = useI18n();
  const t = dict.settings;
  const router = useRouter();
  /** Shown once the bonus setting changes, since it only applies from the next game. */
  const [bonusChanged, setBonusChanged] = useState(false);
  const [starting, setStarting] = useState(false);

  async function startNewGame() {
    setStarting(true);
    const response = await gameApi.newGame(locale, bonus);
    // On a failure /play still loads, and offers to start a game there.
    if (!response.ok) setStarting(false);
    router.push(localePath(locale, "/play"));
  }
  const session = useSession();
  const theme = useThemeChoice();
  const highContrast = useHighContrast();
  const bonus = useBonusGuesses();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading>{t.title}</PageHeading>

      {session.status === "guest" && session.accountsEnabled && (
        <SectionCard>
          <p className="text-muted-foreground">{t.guestBody}</p>
          <Button asChild className="mt-4 h-11 w-full text-base font-semibold sm:w-auto sm:px-6">
            <Link href="/login?next=/settings">{t.guestCta}</Link>
          </Button>
        </SectionCard>
      )}

      <SectionCard title={t.displayTitle}>
        <div className="flex flex-col divide-y">
          <ThemeRow
            value={theme}
            onChange={setThemeChoice}
            label={t.themeLabel}
            description={t.themeDescription}
            options={{ system: t.themeSystem, light: t.themeLight, dark: t.themeDark }}
          />
          <SettingRow
            id="setting-high-contrast"
            label={t.highContrastLabel}
            description={t.highContrastDescription}
            checked={highContrast}
            onChange={setHighContrast}
          />
        </div>
      </SectionCard>

      <SectionCard title={t.gameTitle}>
        <SettingRow
          id="setting-bonus-guesses"
          label={t.bonusLabel}
          description={format(t.bonusDescription, { max: MAX_BONUS_GUESSES })}
          checked={bonus}
          onChange={(on) => {
            setBonusOn(on);
            setBonusChanged(true);
          }}
        />
        {bonusChanged && (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">{t.newGameNote}</p>
            <Button variant="outline" onClick={() => void startNewGame()} disabled={starting} className="h-10 px-4">
              <RotateCcw aria-hidden="true" />
              {t.newGameButton}
            </Button>
          </div>
        )}
      </SectionCard>

      <SectionCard title={t.cookiesTitle} description={t.cookiesDescription}>
        <Button variant="outline" onClick={openCookieSettings} className="h-10 px-4">
          {t.cookiesButton}
        </Button>
      </SectionCard>
    </div>
  );
}

/**
 * The theme: System, Light or Dark as one segmented control. Native radio buttons, so
 * arrow keys move between the options and screen readers announce a group of three.
 */
function ThemeRow({
  value,
  onChange,
  label,
  description,
  options,
}: {
  value: ThemeChoice;
  onChange: (choice: ThemeChoice) => void;
  label: string;
  description: string;
  options: Record<ThemeChoice, string>;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby="setting-theme-label"
      aria-describedby="setting-theme-description"
      className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div className="flex flex-col gap-0.5">
        <p id="setting-theme-label" className="text-base font-medium">
          {label}
        </p>
        <p id="setting-theme-description" className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="grid shrink-0 grid-cols-3 gap-0.5 rounded-lg bg-muted p-0.5">
        {(Object.keys(options) as ThemeChoice[]).map((choice) => (
          <label
            key={choice}
            className="cursor-pointer rounded-md px-3 py-1.5 text-center text-sm font-medium text-muted-foreground transition-colors has-checked:bg-card has-checked:text-foreground dark:has-checked:bg-input has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-ring hover:text-foreground"
          >
            <input
              type="radio"
              name="theme"
              value={choice}
              checked={value === choice}
              onChange={() => onChange(choice)}
              className="sr-only"
            />
            {options[choice]}
          </label>
        ))}
      </div>
    </div>
  );
}

/** One setting: its name and what it does on the left, the switch on the right. */
function SettingRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-describedby={`${id}-description`} />
    </div>
  );
}
