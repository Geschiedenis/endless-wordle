import type { Metadata } from "next";
import { Game } from "@/components/game/game";

export const metadata: Metadata = {
  title: "Play | Endless Wordle",
};

export default function PlayPage() {
  return <Game />;
}
