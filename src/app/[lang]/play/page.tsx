import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/server";
import { Game } from "@/components/game/game";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/play", page: "play", description: "playDescription" });
}

export default function PlayPage() {
  return <Game />;
}
