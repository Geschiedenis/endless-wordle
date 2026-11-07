import { describe, expect, it } from "vitest";
import { applyGuess, createGame } from "./engine";
import { calculateFinalScore } from "./score";

const next = () => "pride";

/** Plays guesses against the current answer, moving to "pride" after a solve. */
function play(guesses: string[]) {
  let state = createGame("seed", "crane");
  for (const guess of guesses) state = applyGuess(state, guess, next).state;
  return state;
}

describe("calculateFinalScore", () => {
  it("scores zero words for a game lost on the first word", () => {
    const state = play(Array(6).fill("stone"));
    expect(calculateFinalScore(state)).toEqual({ wordsSolved: 0, totalGuesses: 6, solvedIn: [] });
  });

  it("counts every guess across every word, including bonus guesses", () => {
    // Solve "crane" on guess 3 (+3 bonus), then spend all 9 guesses on "pride".
    const state = play(["stone", "stone", "crane", ...Array(9).fill("stone")]);
    expect(state.status).toBe("lost");
    expect(calculateFinalScore(state)).toEqual({ wordsSolved: 1, totalGuesses: 12, solvedIn: [3] });
  });

  it("refuses to score a game still being played", () => {
    expect(() => calculateFinalScore(play(["stone"]))).toThrow();
  });

  it("records how many guesses each solved word took", () => {
    const state = play(["crane", "stone", "pride"]);
    expect(state.solvedIn).toEqual([1, 2]);
  });

  it("carries the guess count through a solved word", () => {
    expect(play(["stone", "crane"]).totalGuesses).toBe(2);
  });
});
