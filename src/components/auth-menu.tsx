"use client";

import { ChevronDown, LogOut, PenLine, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
      <DropdownMenuContent align="end" sideOffset={6} className="w-auto min-w-56 p-1.5">
        {session.username === null && (
          <DropdownMenuItem asChild className="min-h-11 gap-3 px-3 py-2.5 text-base [&_svg:not([class*='size-'])]:size-5">
            <Link href="/choose-username">
              <PenLine aria-hidden="true" />
              {dict.header.chooseUsername}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="min-h-11 gap-3 px-3 py-2.5 text-base [&_svg:not([class*='size-'])]:size-5">
          <Link href="/profile">
            <UserRound aria-hidden="true" />
            {dict.header.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="min-h-11 gap-3 px-3 py-2.5 text-base [&_svg:not([class*='size-'])]:size-5">
          <Link href="/settings">
            <Settings aria-hidden="true" />
            {dict.header.settings}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1.5" />
        <DropdownMenuItem className="min-h-11 gap-3 px-3 py-2.5 text-base [&_svg:not([class*='size-'])]:size-5" onSelect={() => void logout()}>
          <LogOut aria-hidden="true" />
          {dict.header.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
