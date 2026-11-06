import { describe, expect, it } from "vitest";
import { splitGuessesLeft } from "./guesses-left";

describe("splitGuessesLeft", () => {
  it("has no bonus without bonus guesses", () => {
    expect(splitGuessesLeft(6, 6)).toEqual({ regular: 6, bonus: 0 });
    expect(splitGuessesLeft(6, 2)).toEqual({ regular: 2, bonus: 0 });
  });

  it("uses regular guesses first, keeping the bonus for after", () => {
    expect(splitGuessesLeft(7, 7)).toEqual({ regular: 6, bonus: 1 });
    expect(splitGuessesLeft(7, 6)).toEqual({ regular: 5, bonus: 1 });
    expect(splitGuessesLeft(9, 4)).toEqual({ regular: 1, bonus: 3 });
  });

  it("counts down the bonus once the regular guesses are gone", () => {
    expect(splitGuessesLeft(9, 3)).toEqual({ regular: 0, bonus: 3 });
    expect(splitGuessesLeft(9, 1)).toEqual({ regular: 0, bonus: 1 });
    expect(splitGuessesLeft(9, 0)).toEqual({ regular: 0, bonus: 0 });
  });
});
