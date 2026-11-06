import { describe, expect, it } from "vitest";
import { decodeResult, encodeResult } from "./share-code";

describe("share codes", () => {
  it("round-trips a full game", () => {
    const result = {
      wordsSolved: 3,
      words: [
        { guesses: 3, solved: true },
        { guesses: 1, solved: true },
        { guesses: 5, solved: true },
        { guesses: 6, solved: false },
      ],
    };
    expect(encodeResult(result)).toBe("315-6");
    expect(decodeResult("315-6")).toEqual(result);
  });

  it("handles a game lost on the first word", () => {
    expect(encodeResult({ wordsSolved: 0, words: [{ guesses: 6, solved: false }] })).toBe("-6");
    expect(decodeResult("-6")).toEqual({ wordsSolved: 0, words: [{ guesses: 6, solved: false }] });
  });

  it("falls back to just the score when the words aren't known", () => {
    expect(encodeResult({ wordsSolved: 12, words: [] })).toBe("n12");
    expect(decodeResult("n12")).toEqual({ wordsSolved: 12, words: [] });
  });

  it.each(["", "abc", "31a-6", "315-0", "315-", "0-6", "n", "n1234", "315-6-2", "<script>"])(
    "rejects %j",
    (code) => {
      expect(decodeResult(code)).toBeNull();
    },
  );
});
