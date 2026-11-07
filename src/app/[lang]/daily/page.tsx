import type { Metadata } from "next";
import { DailyGame } from "@/components/game/daily-game";
import { pageMetadata } from "@/i18n/server";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ path: "/daily", page: "daily", description: "dailyDescription" });
}

export default function DailyPage() {
  return <DailyGame />;
}
