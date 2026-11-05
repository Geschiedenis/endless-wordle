import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/i18n/config";
import { DICTIONARIES } from "@/i18n/dictionaries";
import { HOW_TO_PLAY_EXAMPLES } from "@/lib/game/examples";
import { computeFeedback } from "@/lib/game/feedback";
import type { LetterFeedback } from "@/lib/game/types";

/**
 * The preview image shown when a page is shared or appears in search, one per
 * language. Built once per language at build time. Pages below inherit it.
 */
export const alt = "Endless Wordle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TILE: Record<LetterFeedback, string> = { correct: "#2f7d3b", present: "#d9aa2f", absent: "#3a3a3c" };

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = DICTIONARIES[locale];
  const example = HOW_TO_PLAY_EXAMPLES[locale];
  const logo = await readFile(path.join(process.cwd(), "public", "logo.svg"), "base64");
  const rows = [example.first, example.answer].map((word) => ({ word, feedback: computeFeedback(word, example.answer) }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 88px",
          background: "#121213",
          color: "#f4f4f5",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 28 }}>
          <img src={`data:image/svg+xml;base64,${logo}`} width={112} height={112} alt="" style={{ borderRadius: 18 }} />
          <div style={{ fontSize: 84, letterSpacing: -2, lineHeight: 1 }}>Endless Wordle</div>
          <div style={{ fontSize: 32, lineHeight: 1.35, color: "#a1a1aa" }}>{dict.home.tagline}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map(({ word, feedback }) => (
            <div key={word} style={{ display: "flex", gap: 12 }}>
              {[...word].map((letter, i) => (
                <div
                  key={i}
                  style={{
                    width: 84,
                    height: 84,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    background: TILE[feedback[i]],
                    color: feedback[i] === "present" ? "#1a1a1b" : "#ffffff",
                    fontSize: 46,
                  }}
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
