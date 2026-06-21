import { describe, expect, it } from "vitest";
import { calculateResult, getMissingQuestionIds, isAnswersComplete } from "../diagnosis";
import { QUESTIONS } from "../../data/questions";
import { buildDemoAnswers, DEMO_INTERESTS, DEMO_PROFILE_DEFAULTS } from "../demo";

describe("isAnswersComplete / getMissingQuestionIds", () => {
  it("is false and lists all ids when answers are empty", () => {
    expect(isAnswersComplete({})).toBe(false);
    expect(getMissingQuestionIds({})).toHaveLength(QUESTIONS.length);
  });

  it("is true when every question has an answer", () => {
    const answers = buildDemoAnswers();
    expect(isAnswersComplete(answers)).toBe(true);
    expect(getMissingQuestionIds(answers)).toHaveLength(0);
  });
});

describe("calculateResult", () => {
  it("produces a fully-populated diagnosis result for the demo profile", () => {
    const result = calculateResult({
      userType: "adult",
      personName: DEMO_PROFILE_DEFAULTS.personName,
      organization: DEMO_PROFILE_DEFAULTS.organization,
      currentRole: DEMO_PROFILE_DEFAULTS.currentRole,
      baseIncome: DEMO_PROFILE_DEFAULTS.baseIncome,
      interests: DEMO_INTERESTS,
      answers: buildDemoAnswers(),
    });

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(result.level.name).toBeTruthy();
    expect(result.gaps.length).toBe(6);
    expect(result.strengths.length).toBe(3);
    expect(result.courses.top.length).toBeGreaterThan(0);
    expect(result.courses.packageRec).not.toBeNull();
    expect(result.useCases.length).toBeGreaterThan(0);
    expect(result.learningPath.length).toBeGreaterThan(0);
    expect(result.value.kind).toBe("adult");
  });

  it("produces a student-shaped result without a package recommendation", () => {
    const result = calculateResult({
      userType: "student",
      personName: "テスト生徒",
      organization: "テスト高校",
      currentRole: "高校生",
      baseIncome: 0,
      interests: ["learning"],
      answers: buildDemoAnswers(),
    });
    expect(result.courses.packageRec).toBeNull();
    expect(result.value.kind).toBe("student");
  });
});
