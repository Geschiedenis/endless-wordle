"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/username";

export function UsernameField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const { dict } = useI18n();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="username">{label ?? dict.username.label}</Label>
      <Input
        id="username"
        required
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={USERNAME_MAX_LENGTH}
        aria-describedby="username-help"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11"
      />
      <p id="username-help" className="text-xs text-muted-foreground">
        {format(dict.username.help, { min: USERNAME_MIN_LENGTH, max: USERNAME_MAX_LENGTH })}
      </p>
    </div>
  );
}
