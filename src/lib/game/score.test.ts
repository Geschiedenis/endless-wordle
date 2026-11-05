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
    expect(calculateFinalScore(state)).toEqual({ wordsSolved: 0, totalGuesses: 6 });
  });

  it("counts every guess across every word, including bonus guesses", () => {
    // Solve "crane" on guess 2 (+4 bonus), then spend all 10 guesses on "pride".
    const state = play(["stone", "crane", ...Array(10).fill("stone")]);
    expect(state.status).toBe("lost");
    expect(calculateFinalScore(state)).toEqual({ wordsSolved: 1, totalGuesses: 12 });
  });

  it("refuses to score a game still being played", () => {
    expect(() => calculateFinalScore(play(["stone"]))).toThrow();
  });

  it("carries the guess count through a solved word", () => {
    expect(play(["stone", "crane"]).totalGuesses).toBe(2);
  });
});
