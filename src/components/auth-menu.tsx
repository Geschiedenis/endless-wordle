"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { format } from "@/i18n/format";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { apiSend } from "@/lib/game/api-client";
import { fullPageLoad } from "@/lib/navigation";

async function logout() {
  await apiSend("/api/auth/logout", "POST");
  fullPageLoad("/");
}

export function AuthMenu() {
  const session = useSession();
  const { dict } = useI18n();

  if (session.status === "loading") return <div aria-hidden="true" className="h-9 w-14" />;

  if (session.status === "guest") {
    return (
      <Button asChild variant="ghost" className="h-9 px-2.5">
        <Link href="/login">{dict.header.login}</Link>
      </Button>
    );
  }

  const name = session.username ?? dict.header.account;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 max-w-24 px-1.5 sm:max-w-40 sm:px-2" aria-label={format(dict.header.accountMenu, { name })}>
          <span className="truncate">{name}</span>
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-36">
        {session.username === null && (
          <DropdownMenuItem asChild className="py-2">
            <Link href="/choose-username">{dict.header.chooseUsername}</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="py-2">
          <Link href="/profile">{dict.header.profile}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2" onSelect={() => void logout()}>
          {dict.header.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
