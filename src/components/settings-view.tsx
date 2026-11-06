"use client";

import { PageHeading } from "@/components/page-heading";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDarkTheme, useHighContrast } from "@/hooks/use-preferences";
import { useSession } from "@/hooks/use-session";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { openCookieSettings } from "@/lib/consent";
import { setDarkTheme, setHighContrast } from "@/lib/preferences";

/** Display and cookie preferences, for everyone. Guests also get an invitation to sign up. */
export function SettingsView() {
  const { dict } = useI18n();
  const t = dict.settings;
  const session = useSession();
  const dark = useDarkTheme();
  const highContrast = useHighContrast();

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
          <SettingRow
            id="setting-dark-mode"
            label={t.darkModeLabel}
            description={t.darkModeDescription}
            checked={dark}
            onChange={setDarkTheme}
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

      <SectionCard title={t.cookiesTitle} description={t.cookiesDescription}>
        <Button variant="outline" onClick={openCookieSettings} className="h-10 px-4">
          {t.cookiesButton}
        </Button>
      </SectionCard>
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
