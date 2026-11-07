import { describe, expect, it } from "vitest";
import { buildDailyShareText, buildShareText, MAX_SHARED_WORDS } from "./share";

const base = { locale: "nl" as const, wordsLabel: "2 woorden", url: "https://endlesslingle.com/nl" };

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
      ["Endless Lingle 🇳🇱 · 2 woorden", "⬛⬛🟩", "🟩", "⬛⬛⬛⬛⬛🟥", "https://endlesslingle.com/nl"].join("\n"),
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

describe("buildDailyShareText", () => {
  it("shows the score and a square per letter, without the letters", () => {
    const text = buildDailyShareText({
      locale: "nl",
      title: "Woord van de dag #3",
      rows: [
        ["absent", "present", "absent", "absent", "absent"],
        ["correct", "correct", "correct", "correct", "correct"],
      ],
      solved: true,
      url: "https://endlesslingle.com/nl/daily",
    });
    expect(text).toBe(
      "Endless Lingle 🇳🇱 · Woord van de dag #3 · 2/6\n⬛🟨⬛⬛⬛\n🟩🟩🟩🟩🟩\nhttps://endlesslingle.com/nl/daily",
    );
  });

  it("scores a missed word as X/6, in high-contrast colours when they're on", () => {
    const text = buildDailyShareText({
      locale: "en",
      title: "Daily word #1",
      rows: Array(6).fill(["correct", "present", "absent", "absent", "absent"]),
      solved: false,
      url: "u",
      highContrast: true,
    });
    expect(text.split("\n")[0]).toBe("Endless Lingle 🇺🇸 · Daily word #1 · X/6");
    expect(text.split("\n")[1]).toBe("🟧🟦⬛⬛⬛");
  });
});
