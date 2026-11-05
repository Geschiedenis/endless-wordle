import { describe, expect, it } from "vitest";
import { buildShareText, MAX_SHARED_WORDS } from "./share";

const base = { locale: "nl" as const, wordsLabel: "2 woorden", url: "https://endlesswordle.app/nl" };

describe("buildShareText", () => {
  it("lists each word as squares, ending in green or red", () => {
    const text = buildShareText({
      ...base,
      words: [
        { guesses: 3, solved: true },
        { guesses: 1, solved: true },
        { guesses: 6, solved: false },
      ],
    });
    expect(text).toBe(
      ["Endless Wordle 🇳🇱 · 2 woorden", "⬛⬛🟩", "🟩", "⬛⬛⬛⬛⬛🟥", "https://endlesswordle.app/nl"].join("\n"),
    );
  });

  it("never contains letters from the words", () => {
    const text = buildShareText({ ...base, words: [{ guesses: 4, solved: true }] });
    expect(text.split("\n").slice(1, -1).join("")).not.toMatch(/\p{L}/u);
  });

  it("uses orange in high-contrast mode", () => {
    expect(buildShareText({ ...base, words: [{ guesses: 1, solved: true }], highContrast: true })).toContain("🟧");
  });

  it("keeps long games short", () => {
    const words = Array.from({ length: 25 }, () => ({ guesses: 2, solved: true }));
    const lines = buildShareText({ ...base, words }).split("\n");
    expect(lines).toHaveLength(MAX_SHARED_WORDS + 3);
    expect(lines[1]).toBe("⋯");
  });

  it("shares just the score when the words aren't known", () => {
    expect(buildShareText({ ...base, words: [] }).split("\n")).toHaveLength(2);
  });
});
