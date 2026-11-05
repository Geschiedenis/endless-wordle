import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USERNAME_HELP, USERNAME_MAX_LENGTH } from "@/lib/username";

export function UsernameField({
  value,
  onChange,
  label = "Username",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="username">{label}</Label>
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
        {USERNAME_HELP}
      </p>
    </div>
  );
}
