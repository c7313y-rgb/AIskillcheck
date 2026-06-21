import { QUESTIONS } from "../data/questions";
import type { InterestKey } from "../data/types";
import type { Answers } from "./scoring";

/** Same demo score sequence as the legacy script.js fillDemoAnswers(). */
const DEMO_SCORES = [4, 4, 5, 4, 4, 4, 3, 4, 3, 2, 4, 3, 4, 3, 3, 2, 2, 2, 4, 3, 4, 3, 3, 3];

export function buildDemoAnswers(): Answers {
  const answers: Answers = {};
  QUESTIONS.forEach((question, index) => {
    answers[question.id] = DEMO_SCORES[index] ?? 3;
  });
  return answers;
}

export const DEMO_PROFILE_DEFAULTS = {
  personName: "デモユーザー",
  organization: "営業企画部",
  currentRole: "営業・企画",
  baseIncome: 520,
};

export const DEMO_INTERESTS: InterestKey[] = ["productivity", "documents", "dataDecision"];
