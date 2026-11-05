import type { LetterFeedback, ScoredGuess } from "./types";

const RANK: Record<LetterFeedback, number> = { absent: 0, present: 1, correct: 2 };

/** Best feedback seen for each letter: a green key never downgrades to yellow. */
export function keyStatuses(guesses: readonly ScoredGuess[]): Record<string, LetterFeedback> {
  const statuses: Record<string, LetterFeedback> = {};
  for (const { word, feedback } of guesses) {
    feedback.forEach((status, i) => {
      const current = statuses[word[i]];
      if (!current || RANK[status] > RANK[current]) statuses[word[i]] = status;
    });
  }
  return statuses;
}
