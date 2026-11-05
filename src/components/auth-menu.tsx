"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { apiSend } from "@/lib/game/api-client";
import { fullPageLoad } from "@/lib/navigation";

async function logout() {
  await apiSend("/api/auth/logout", "POST");
  fullPageLoad("/");
}

export function AuthMenu() {
  const session = useSession();

  if (session.status === "loading") return <div aria-hidden="true" className="h-9 w-14" />;

  if (session.status === "guest") {
    return (
      <Button asChild variant="ghost" className="h-9 px-2.5">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  const name = session.username ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 max-w-24 px-1.5 sm:max-w-40 sm:px-2" aria-label={`Account menu for ${name}`}>
          <span className="truncate">{name}</span>
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-36">
        {session.username === null && (
          <DropdownMenuItem asChild className="py-2">
            <Link href="/choose-username">Choose a username</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="py-2">
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2" onSelect={() => void logout()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
