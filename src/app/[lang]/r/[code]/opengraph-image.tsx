import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/i18n/config";
import { DICTIONARIES } from "@/i18n/dictionaries";
import { format, plural } from "@/i18n/format";
import { MAX_SHARED_WORDS } from "@/lib/game/share";
import { decodeResult } from "@/lib/game/share-code";

/** The preview image for a shared result: the score, the language and the grid, without letters. */
export const alt = "Endless Lingle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLOURS = { miss: "#3a3a3c", solved: "#2f7d3b", lost: "#c0392b" };

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}) {
  const { lang, code } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const dict = DICTIONARIES[locale];
  const result = decodeResult(code) ?? { wordsSolved: 0, words: [] };
  const words = plural(dict.gameOver.words, result.wordsSolved);
  const [logo, flag] = await Promise.all([
    readFile(path.join(process.cwd(), "public", "logo.svg"), "base64"),
    readFile(path.join(process.cwd(), "public", "flags", `${locale}.svg`), "base64"),
  ]);
  const rows = result.words.slice(-MAX_SHARED_WORDS);
  const square = rows.length > 7 ? 30 : 40;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: "0 80px",
        background: "#121213",
        color: "#f4f4f5",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", flex: 1, gap: 24 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={`data:image/svg+xml;base64,${logo}`}
            width={88}
            height={88}
            alt=""
            style={{ borderRadius: 14 }}
          />
          <img
            src={`data:image/svg+xml;base64,${flag}`}
            width={64}
            height={48}
            alt=""
            style={{ borderRadius: 6 }}
          />
        </div>
        <div style={{ fontSize: 40, color: "#a1a1aa" }}>Endless Lingle</div>
        <div style={{ fontSize: 92, lineHeight: 1, letterSpacing: -2 }}>
          {format(dict.share.resultHeading, { words })}
        </div>
        <div style={{ fontSize: 40, color: "#a1a1aa" }}>
          {dict.share.resultChallenge}
        </div>
      </div>
      {rows.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((word, index) => (
            <div key={index} style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: word.guesses }, (_, guess) => {
                const last = guess === word.guesses - 1;
                const colour = !last
                  ? COLOURS.miss
                  : word.solved
                    ? COLOURS.solved
                    : COLOURS.lost;
                return (
                  <div
                    key={guess}
                    style={{
                      width: square,
                      height: square,
                      borderRadius: 6,
                      background: colour,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>,
    size,
  );
}
