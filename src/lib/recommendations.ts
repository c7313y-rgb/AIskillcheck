import { ADULT_COURSES, EDUCATION_COURSES } from "../data/courses";
import { PACKAGES } from "../data/packages";
import { getCategoryLabel, getInterestLabel, type Gap } from "./scoring";
import type { CategoryKey, CourseBase, InterestKey, Package, UserType } from "../data/types";

export interface ScoredCourse extends CourseBase {
  matchScore: number;
  reasons: string[];
}

export interface CourseRecommendationResult {
  top: ScoredCourse[];
  packageRec: (Package & { score: number }) | null;
}

export function getCatalog(userType: UserType): readonly CourseBase[] {
  return userType === "student" ? EDUCATION_COURSES : ADULT_COURSES;
}

function uniqueBy<T, K extends keyof T>(items: T[], key: K): T[] {
  const seen = new Set<T[K]>();
  return items.filter((item) => {
    if (seen.has(item[key])) return false;
    seen.add(item[key]);
    return true;
  });
}

function uniqueList(items: string[]): string[] {
  return Array.from(new Set(items));
}

export interface RecommendCoursesInput {
  userType: UserType;
  interests: readonly InterestKey[];
  categoryScores: Record<CategoryKey, number>;
  gaps: Gap[];
}

/**
 * Scores and ranks courses for the given profile. Mirrors the original
 * recommendCourses() scoring rules exactly (weights, bonuses, course-id-specific bonuses).
 */
export function recommendCourses(input: RecommendCoursesInput): CourseRecommendationResult {
  const { userType, interests, categoryScores, gaps } = input;
  const source = getCatalog(userType);
  const interestSet = new Set(interests);
  const lowCats = gaps.filter((gap) => gap.gap >= 10).map((gap) => gap.key);

  const scored: ScoredCourse[] = source.map((course) => {
    let score = 0;
    const reasons: string[] = [];

    course.categories.forEach((categoryKey) => {
      score += (100 - (categoryScores[categoryKey] ?? 0)) * 0.12;
      if (lowCats.includes(categoryKey)) {
        score += 16;
        reasons.push(`${getCategoryLabel(categoryKey)}の補強`);
      }
    });

    course.interests.forEach((interestKey) => {
      if (interestSet.has(interestKey)) {
        score += 22;
        reasons.push(`${getInterestLabel(interestKey)}に直結`);
      }
    });

    if (userType === "adult" && categoryScores.literacy < 58 && course.id === "A01") {
      score += 32;
      reasons.push("基礎固めに最適");
    }
    if (userType === "student" && categoryScores.literacy < 58 && course.id === "E01") {
      score += 32;
      reasons.push("安全な入口として学びやすい");
    }
    if (userType === "adult" && interestSet.has("development") && ["A07", "A08", "A10"].includes(course.id)) {
      score += 18;
      reasons.push("開発・内製化に向く");
    }
    if (userType === "adult" && interestSet.has("agent") && ["A06", "A09", "A10", "A11"].includes(course.id)) {
      score += 18;
      reasons.push("エージェント活用に発展");
    }

    return {
      ...course,
      matchScore: Math.round(score),
      reasons: uniqueList(reasons).slice(0, 3),
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  const top = uniqueBy(scored, "id").slice(0, 5);
  top.forEach((course) => {
    if (!course.reasons.length) {
      course.reasons = [course.categories.slice(0, 2).map(getCategoryLabel).join("・")];
    }
  });

  return {
    top,
    packageRec: userType === "adult" ? recommendPackage(top, interests, categoryScores) : null,
  };
}

function recommendPackage(
  topCourses: ScoredCourse[],
  interests: readonly InterestKey[],
  categoryScores: Record<CategoryKey, number>,
): (Package & { score: number }) | null {
  const topIds = new Set(topCourses.map((course) => course.id));
  const interestSet = new Set(interests);

  const scoredPackages = PACKAGES.map((pkg) => {
    let score = pkg.courses.reduce((sum, id) => sum + (topIds.has(id) ? 30 : 0), 0);
    if (interestSet.has("agent") && pkg.id === "P5") score += 40;
    if (interestSet.has("development") && pkg.id === "P4") score += 32;
    if (interestSet.has("implementation") && pkg.id === "P3") score += 34;
    if (interestSet.has("productivity") && pkg.id === "P1") score += 25;
    if (categoryScores.literacy < 58 && pkg.id === "P2") score += 15;
    return { ...pkg, score };
  });

  scoredPackages.sort((a, b) => b.score - a.score);
  return scoredPackages[0] ?? null;
}
