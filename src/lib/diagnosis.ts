import { QUESTIONS } from "../data/questions";
import { STRENGTH_COPY } from "../data/packages";
import type { CategoryKey, InterestKey, UserType } from "../data/types";
import {
  buildGaps,
  buildLearningPath,
  buildStrengths,
  buildTargets,
  buildUseCases,
  buildValueEstimate,
  calculateCategoryScores,
  calculateTotalScore,
  getLevel,
  type Answers,
  type Gap,
  type Level,
  type LearningPathItem,
  type Strength,
  type ValueEstimate,
} from "./scoring";
import { recommendCourses, type CourseRecommendationResult } from "./recommendations";

export interface DiagnosisProfile {
  userType: UserType;
  personName: string;
  organization: string;
  currentRole: string;
  baseIncome: number;
  interests: InterestKey[];
  answers: Answers;
}

export interface DiagnosisResult {
  generatedAt: string;
  profile: DiagnosisProfile;
  categoryScores: Record<CategoryKey, number>;
  totalScore: number;
  level: Level;
  targetScores: Record<CategoryKey, number>;
  gaps: Gap[];
  strengths: Strength[];
  courses: CourseRecommendationResult;
  useCases: string[];
  learningPath: LearningPathItem[];
  value: ValueEstimate;
}

/**
 * Single entry point that reproduces the original calculateResult() pipeline:
 * answers -> category scores -> total score -> level -> gaps -> strengths ->
 * recommended courses -> use cases -> learning path -> value estimate.
 */
export function calculateResult(profile: DiagnosisProfile): DiagnosisResult {
  const categoryScores = calculateCategoryScores(profile.answers);
  const totalScore = calculateTotalScore(categoryScores);
  const level = getLevel(totalScore);
  const targetScores = buildTargets(profile.interests, profile.userType);
  const gaps = buildGaps(categoryScores, targetScores);
  const strengths = buildStrengths(categoryScores, STRENGTH_COPY);
  const courses = recommendCourses({
    userType: profile.userType,
    interests: profile.interests,
    categoryScores,
    gaps,
  });
  const useCases = buildUseCases(categoryScores);
  const learningPath = buildLearningPath(gaps, courses.top[0]?.title);
  const value = buildValueEstimate(profile.userType, profile.baseIncome, totalScore, categoryScores);

  return {
    generatedAt: new Date().toISOString(),
    profile,
    categoryScores,
    totalScore,
    level,
    targetScores,
    gaps,
    strengths,
    courses,
    useCases,
    learningPath,
    value,
  };
}

/** True when every diagnosis question has a non-null answer. */
export function isAnswersComplete(answers: Answers): boolean {
  return QUESTIONS.every((question) => answers[question.id] != null);
}

/** Returns the list of question ids that are still unanswered. */
export function getMissingQuestionIds(answers: Answers): string[] {
  return QUESTIONS.filter((question) => answers[question.id] == null).map((question) => question.id);
}
