import { describe, expect, it } from "vitest";
import { computeFeedback, isSolved } from "./feedback";

/** g = correct, y = present, - = absent. */
function score(guess: string, answer: string) {
  const symbols = { correct: "g", present: "y", absent: "-" };
  return computeFeedback(guess, answer)
    .map((letter) => symbols[letter])
    .join("");
}

describe("computeFeedback", () => {
  it("marks every letter correct on an exact match", () => {
    expect(score("crane", "crane")).toBe("ggggg");
  });

  it("marks letters that are not in the word as absent", () => {
    expect(score("fuzzy", "crane")).toBe("-----");
  });

  it("marks letters in the wrong position as present", () => {
    expect(score("nacre", "crane")).toBe("yyyyg");
  });

  describe("duplicate letters", () => {
    it("colours a guessed double only once when the answer has one", () => {
      expect(score("speed", "crane")).toBe("--y--");
      expect(score("allow", "alert")).toBe("gg---");
    });

    it("prefers the exact match over an earlier misplaced duplicate", () => {
      // The answer's only E is last, so the E at the end takes it.
      expect(score("geese", "crane")).toBe("----g");
      expect(score("eerie", "crane")).toBe("--y-g");
      // The answer's only L is fourth, so the third-position L stays grey.
      expect(score("hello", "world")).toBe("---gy");
      expect(score("lolly", "world")).toBe("-g-g-");
    });

    it("claims misplaced duplicates left to right", () => {
      // One E in the answer and neither guessed E in place: only the first is yellow.
      expect(score("speed", "abide")).toBe("--y-y");
    });

    it("colours both when the answer really has two", () => {
      expect(score("eagle", "geese")).toBe("y-y-g");
      expect(score("sleep", "geese")).toBe("y-gy-");
    });

    it("handles a guessed triple against an answer with two", () => {
      // "eerie" against "reeds": E in slot 2 is exact, slot 1 takes the other E,
      // and the last E has none left.
      expect(score("eerie", "reeds")).toBe("ygy--");
    });

    it("handles the answer having more copies than the guess", () => {
      expect(score("metal", "geese")).toBe("-g---");
    });
  });

  it("throws on mismatched lengths", () => {
    expect(() => computeFeedback("cat", "crane")).toThrow();
  });
});

describe("isSolved", () => {
  it("is true only when all letters are correct", () => {
    expect(isSolved(computeFeedback("crane", "crane"))).toBe(true);
    expect(isSolved(computeFeedback("crate", "crane"))).toBe(false);
  });
});
