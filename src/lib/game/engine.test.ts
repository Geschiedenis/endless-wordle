import { describe, expect, it } from "vitest";
import { applyGuess, createGame, toGameView } from "./engine";
import { keyStatuses } from "./keyboard";

const next = () => "pride";

describe("applyGuess", () => {
  it("records a wrong guess and keeps playing", () => {
    const { state, result } = applyGuess(createGame("s", "crane"), "pride", next);
    expect(state.guesses).toEqual(["pride"]);
    expect(state.status).toBe("playing");
    expect(result.solved).toBe(false);
    expect(result.bonusEarned).toBeUndefined();
  });

  it("moves to the next word with the rollover when solved", () => {
    let state = createGame("s", "crane");
    for (const guess of ["pride", "stone", "light"]) {
      state = applyGuess(state, guess, next).state;
    }
    const outcome = applyGuess(state, "crane", next);
    expect(outcome.result).toMatchObject({ solved: true, bonusEarned: 2 });
    expect(outcome.state).toMatchObject({
      answer: "pride",
      wordsSolved: 1,
      bonusGuesses: 2,
      guesses: [],
      status: "playing",
    });
  });

  it("passes the new solved count to nextAnswer", () => {
    const seen: number[] = [];
    applyGuess(createGame("s", "crane"), "crane", (solved) => {
      seen.push(solved);
      return "pride";
    });
    expect(seen).toEqual([1]);
  });

  it("loses after the last guess of a word without bonus", () => {
    let state = createGame("s", "crane");
    for (let i = 0; i < 5; i++) state = applyGuess(state, "pride", next).state;
    expect(state.status).toBe("playing");
    state = applyGuess(state, "pride", next).state;
    expect(state.status).toBe("lost");
  });

  it("gives bonus guesses as real extra attempts", () => {
    let state = { ...createGame("s", "crane"), bonusGuesses: 2 };
    for (let i = 0; i < 7; i++) state = applyGuess(state, "pride", next).state;
    expect(state.status).toBe("playing");
    state = applyGuess(state, "pride", next).state;
    expect(state.status).toBe("lost");
  });

  it("wins on the very last guess instead of losing", () => {
    let state = createGame("s", "crane");
    for (let i = 0; i < 5; i++) state = applyGuess(state, "pride", next).state;
    const outcome = applyGuess(state, "crane", next);
    expect(outcome.state).toMatchObject({ status: "playing", wordsSolved: 1, bonusGuesses: 0 });
  });

  it("refuses guesses once the game is lost", () => {
    const lost = { ...createGame("s", "crane"), status: "lost" as const };
    expect(() => applyGuess(lost, "pride", next)).toThrow();
  });

  it("does not mutate the previous state", () => {
    const state = createGame("s", "crane");
    applyGuess(state, "pride", next);
    expect(state.guesses).toEqual([]);
  });
});

describe("toGameView", () => {
  it("never exposes the answer or seed during play", () => {
    const { state } = applyGuess(createGame("secret-seed", "crane"), "pride", next);
    const json = JSON.stringify(toGameView(state));
    expect(json).not.toContain("crane");
    expect(json).not.toContain("secret-seed");
    expect(toGameView(state).answer).toBeUndefined();
  });

  it("reveals the answer once lost, but never the seed", () => {
    const lost = { ...createGame("secret-seed", "crane"), status: "lost" as const };
    expect(toGameView(lost).answer).toBe("crane");
    expect(JSON.stringify(toGameView(lost))).not.toContain("secret-seed");
  });

  it("reports the counters", () => {
    const state = { ...createGame("s", "crane"), wordsSolved: 3, bonusGuesses: 2, guesses: ["pride"] };
    expect(toGameView(state)).toMatchObject({
      wordNumber: 4,
      wordsSolved: 3,
      bonusGuesses: 2,
      guessesAllowed: 8,
      guessesRemaining: 7,
    });
  });
});

describe("keyStatuses", () => {
  it("keeps the best status seen for a letter", () => {
    const statuses = keyStatuses([
      { word: "ab", feedback: ["present", "absent"] },
      { word: "ab", feedback: ["correct", "present"] },
      { word: "ab", feedback: ["absent", "absent"] },
    ]);
    expect(statuses).toEqual({ a: "correct", b: "present" });
  });
});
