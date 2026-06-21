import { describe, expect, it } from "vitest";
import { QUESTIONS } from "../../data/questions";
import {
  buildGaps,
  buildLearningPath,
  buildStrengths,
  buildTargets,
  buildUseCases,
  buildValueEstimate,
  calculateCategoryScores,
  calculateTotalScore,
  getCategoryLabel,
  getInterestLabel,
  getLevel,
  getPrimaryCategoryKey,
} from "../scoring";
import { STRENGTH_COPY } from "../../data/packages";
import { buildDemoAnswers } from "../demo";

describe("calculateCategoryScores", () => {
  it("returns 0 for every category when there are no answers", () => {
    const scores = calculateCategoryScores({});
    expect(Object.values(scores).every((score) => score === 0)).toBe(true);
  });

  it("returns 100 for every category when all answers are 5 (max)", () => {
    const allMax = Object.fromEntries(QUESTIONS.map((q) => [q.id, 5]));
    const scores = calculateCategoryScores(allMax);
    Object.values(scores).forEach((score) => {
      expect(score).toBe(100);
    });
  });

  it("returns 20 for every category when all answers are 1 (min)", () => {
    const allMin = Object.fromEntries(QUESTIONS.map((q) => [q.id, 1]));
    const scores = calculateCategoryScores(allMin);
    Object.values(scores).forEach((score) => {
      expect(score).toBe(20);
    });
  });

  it("matches a known snapshot for the demo answer set", () => {
    const scores = calculateCategoryScores(buildDemoAnswers());
    // Values are deterministic given the fixed DEMO_SCORES sequence.
    expect(scores).toMatchInlineSnapshot(`
      {
        "automation": 45,
        "business": 69,
        "data": 61,
        "governance": 65,
        "literacy": 81,
        "prompt": 77,
      }
    `);
  });
});

describe("calculateTotalScore", () => {
  it("averages the 6 category scores and rounds", () => {
    const total = calculateTotalScore({
      literacy: 80,
      prompt: 70,
      business: 60,
      data: 50,
      automation: 40,
      governance: 30,
    });
    expect(total).toBe(55);
  });
});

describe("getLevel", () => {
  it("classifies boundary scores correctly", () => {
    expect(getLevel(95).name).toBe("AI実装リード");
    expect(getLevel(90).name).toBe("AI実装リード");
    expect(getLevel(89).name).toBe("推進人材候補");
    expect(getLevel(75).name).toBe("推進人材候補");
    expect(getLevel(74).name).toBe("実務活用準備期");
    expect(getLevel(60).name).toBe("実務活用準備期");
    expect(getLevel(59).name).toBe("基礎定着期");
    expect(getLevel(40).name).toBe("基礎定着期");
    expect(getLevel(39).name).toBe("AI準備期");
    expect(getLevel(0).name).toBe("AI準備期");
  });
});

describe("buildTargets", () => {
  it("uses 72 baseline for adults and 68 for students with no interests", () => {
    const adultTargets = buildTargets([], "adult");
    const studentTargets = buildTargets([], "student");
    Object.values(adultTargets).forEach((value) => expect(value).toBe(72));
    Object.values(studentTargets).forEach((value) => expect(value).toBe(68));
  });

  it("raises targets based on selected interests and clamps students to 84", () => {
    const adultTargets = buildTargets(["agent"], "adult");
    expect(adultTargets.automation).toBe(92);

    const studentTargets = buildTargets(["agent"], "student");
    expect(studentTargets.automation).toBe(84);
  });
});

describe("buildGaps", () => {
  it("sorts gaps descending and floors at 0", () => {
    const gaps = buildGaps(
      { literacy: 90, prompt: 50, business: 10, data: 0, automation: 0, governance: 0 },
      { literacy: 72, prompt: 72, business: 72, data: 72, automation: 72, governance: 72 },
    );
    expect(gaps[0].key).toBe("data");
    expect(gaps[0].gap).toBe(72);
    expect(gaps.find((g) => g.key === "literacy")?.gap).toBe(0);
  });
});

describe("buildStrengths", () => {
  it("returns the top 3 categories by score with descriptions", () => {
    const strengths = buildStrengths(
      { literacy: 90, prompt: 80, business: 70, data: 60, automation: 50, governance: 40 },
      STRENGTH_COPY,
    );
    expect(strengths).toHaveLength(3);
    expect(strengths.map((s) => s.key)).toEqual(["literacy", "prompt", "business"]);
    expect(strengths[0].description).toBe(STRENGTH_COPY.literacy);
  });
});

describe("buildUseCases", () => {
  it("returns fallback items when no category clears the 65 threshold", () => {
    const useCases = buildUseCases({
      literacy: 10,
      prompt: 10,
      business: 10,
      data: 10,
      automation: 10,
      governance: 10,
    });
    expect(useCases.length).toBeGreaterThanOrEqual(2);
  });

  it("includes prompt use case when prompt score is high", () => {
    const useCases = buildUseCases({
      literacy: 10,
      prompt: 70,
      business: 10,
      data: 10,
      automation: 10,
      governance: 10,
    });
    expect(useCases.some((text) => text.includes("調査、要約"))).toBe(true);
  });
});

describe("buildLearningPath", () => {
  it("adds a step for each category with a gap greater than its threshold", () => {
    const gaps = [
      { key: "literacy" as const, label: "AI基礎理解", target: 90, current: 70, gap: 20 },
    ];
    const path = buildLearningPath(gaps, "生成AI活用");
    expect(path[0].title).toBe("AI基礎理解を整える");
    expect(path.at(-1)?.title).toContain("生成AI活用");
  });

  it("falls back to a single step when there are no significant gaps", () => {
    const path = buildLearningPath([], undefined);
    expect(path).toHaveLength(1);
    expect(path[0].title).toBe("関心テーマで実践課題を作る");
  });
});

describe("buildValueEstimate", () => {
  it("returns a student-shaped estimate for student profiles", () => {
    const value = buildValueEstimate("student", 0, 75, {
      literacy: 70,
      prompt: 70,
      business: 70,
      data: 70,
      automation: 70,
      governance: 70,
    });
    expect(value.kind).toBe("student");
    expect(value.items).toHaveLength(3);
  });

  it("computes an income multiplier for adult profiles", () => {
    const value = buildValueEstimate("adult", 500, 90, {
      literacy: 90,
      prompt: 90,
      business: 90,
      data: 90,
      automation: 90,
      governance: 90,
    });
    expect(value.kind).toBe("adult");
    expect(value.headline).toBe("650万円");
  });
});

describe("label lookups", () => {
  it("resolves category and interest labels", () => {
    expect(getCategoryLabel("literacy")).toBe("AI基礎理解");
    expect(getInterestLabel("agent")).toBe("AIエージェント");
  });

  it("getPrimaryCategoryKey returns the highest-weighted category", () => {
    const key = getPrimaryCategoryKey({ weights: { literacy: 0.3, business: 0.9 } });
    expect(key).toBe("business");
  });
});
