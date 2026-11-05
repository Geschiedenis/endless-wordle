import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { LANGUAGES, normalizeLetter, parseGuess } from "./languages";

describe("parseGuess", () => {
  it("lowercases valid guesses", () => {
    expect(parseGuess("CrAnE", "en")).toBe("crane");
  });

  it("drops accents the language doesn't keep", () => {
    expect(parseGuess("crâne", "fr")).toBe("crane");
    expect(parseGuess("ÉCOLE", "fr")).toBe("ecole");
    expect(parseGuess("Ápice", "es")).toBe("apice");
  });

  it("reads the Kelvin sign as the K it's equivalent to in Unicode", () => {
    expect(parseGuess("Kiosk", "en")).toBe("kiosk");
  });

  it("keeps letters the language plays with", () => {
    expect(parseGuess("Bären", "de")).toBe("bären");
    expect(parseGuess("niñez", "es")).toBe("niñez");
    // Combining characters are joined first, so a typed "n" plus tilde counts as one letter.
    expect(parseGuess("niñez", "es")).toBe("niñez");
  });

  it("maps letters another language keeps onto plain ones", () => {
    expect(parseGuess("bären", "en")).toBe("baren");
  });

  it.each([
    ["too short", "cran"],
    ["too long", "cranes"],
    ["digits", "cr4ne"],
    ["whitespace", "cran "],
    ["trailing newline", "crane\n"],
    ["a Cyrillic lookalike of a", "cr\u0430ne"],
    ["a German sharp s", "straß"],
    ["not a string", 12345],
    ["null", null],
    ["array", ["crane"]],
  ])("rejects %s", (_label, value) => {
    expect(parseGuess(value, "de")).toBeNull();
    expect(parseGuess(value, "en")).toBeNull();
  });
});

describe("normalizeLetter", () => {
  it("only accepts single letters", () => {
    expect(normalizeLetter("en", "Enter")).toBeNull();
    expect(normalizeLetter("en", "1")).toBeNull();
    expect(normalizeLetter("en", "A")).toBe("a");
  });
});

describe("keyboards", () => {
  it.each(LOCALES)("%s has a key for every letter, and only those", (locale) => {
    const { letters, keyboard } = LANGUAGES[locale];
    expect([...keyboard.join("")].sort()).toEqual([...letters].sort());
  });
});
