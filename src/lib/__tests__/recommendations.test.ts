import { describe, expect, it } from "vitest";
import { getCatalog, recommendCourses } from "../recommendations";
import { ADULT_COURSES, EDUCATION_COURSES } from "../../data/courses";
import { buildGaps, buildTargets, calculateCategoryScores } from "../scoring";
import { buildDemoAnswers } from "../demo";

describe("getCatalog", () => {
  it("returns adult courses for adult and education courses for student", () => {
    expect(getCatalog("adult")).toBe(ADULT_COURSES);
    expect(getCatalog("student")).toBe(EDUCATION_COURSES);
  });
});

describe("recommendCourses", () => {
  const categoryScores = calculateCategoryScores(buildDemoAnswers());
  const targets = buildTargets(["productivity", "documents", "dataDecision"], "adult");
  const gaps = buildGaps(categoryScores, targets);

  it("returns at most 5 unique top courses for adults", () => {
    const result = recommendCourses({
      userType: "adult",
      interests: ["productivity", "documents", "dataDecision"],
      categoryScores,
      gaps,
    });
    expect(result.top.length).toBeLessThanOrEqual(5);
    const ids = result.top.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    result.top.forEach((course) => expect(course.reasons.length).toBeGreaterThan(0));
  });

  it("recommends a package only for adults, never for students", () => {
    const adultResult = recommendCourses({
      userType: "adult",
      interests: ["agent"],
      categoryScores,
      gaps,
    });
    expect(adultResult.packageRec).not.toBeNull();

    const studentResult = recommendCourses({
      userType: "student",
      interests: ["learning"],
      categoryScores,
      gaps,
    });
    expect(studentResult.packageRec).toBeNull();
  });

  it("boosts A01 when literacy is low for adults", () => {
    const lowLiteracyScores = { ...categoryScores, literacy: 30 };
    const result = recommendCourses({
      userType: "adult",
      interests: [],
      categoryScores: lowLiteracyScores,
      gaps: buildGaps(lowLiteracyScores, targets),
    });
    const a01 = result.top.find((c) => c.id === "A01");
    expect(a01).toBeDefined();
  });

  it("prefers the agent-focused package when the agent interest is selected", () => {
    const result = recommendCourses({
      userType: "adult",
      interests: ["agent"],
      categoryScores,
      gaps,
    });
    expect(result.packageRec?.id).toBe("P5");
  });
});
