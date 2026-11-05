import type { LetterFeedback } from "./types";

/**
 * Scores a guess the way the original Wordle does.
 *
 * Exact matches are claimed first, then remaining letters are matched left to
 * right against what is left of the answer. A letter is only "present" as many
 * times as it is still unclaimed, which is what makes duplicates come out right.
 */
export function computeFeedback(guess: string, answer: string): LetterFeedback[] {
  if (guess.length !== answer.length) {
    throw new Error("Guess and answer must be the same length");
  }

  const feedback: LetterFeedback[] = Array.from(guess, () => "absent");
  const unclaimed = new Map<string, number>();

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      feedback[i] = "correct";
    } else {
      unclaimed.set(answer[i], (unclaimed.get(answer[i]) ?? 0) + 1);
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (feedback[i] === "correct") continue;
    const remaining = unclaimed.get(guess[i]) ?? 0;
    if (remaining > 0) {
      feedback[i] = "present";
      unclaimed.set(guess[i], remaining - 1);
    }
  }

  return feedback;
}

export function isSolved(feedback: readonly LetterFeedback[]): boolean {
  return feedback.every((letter) => letter === "correct");
}
