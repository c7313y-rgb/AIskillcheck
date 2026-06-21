import { CATEGORIES } from "../data/categories";
import { QUESTIONS } from "../data/questions";
import { INTERESTS } from "../data/interests";
import type { CategoryKey, InterestKey, UserType } from "../data/types";

export type Answers = Partial<Record<string, number>>;

export interface Level {
  name: string;
  badge: string;
  comment: string;
}

export interface Gap {
  key: CategoryKey;
  label: string;
  target: number;
  current: number;
  gap: number;
}

/** Returns the category with the largest weight for a given question (used for filter grouping). */
export function getPrimaryCategoryKey(question: { weights: Partial<Record<CategoryKey, number>> }): CategoryKey {
  const entries = Object.entries(question.weights) as [CategoryKey, number][];
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

export function getCategoryLabel(key: CategoryKey): string {
  return CATEGORIES.find((category) => category.key === key)?.label ?? key;
}

export function getInterestLabel(key: InterestKey): string {
  return INTERESTS.find((interest) => interest.key === key)?.label ?? key;
}

/**
 * Calculates the 0-100 score for every category based on weighted question answers.
 * Mirrors the original calculateResult() weighting formula exactly:
 *   weighted += answer * 20 * weight; max += 100 * weight
 */
export function calculateCategoryScores(answers: Answers): Record<CategoryKey, number> {
  const totals = Object.fromEntries(
    CATEGORIES.map((category) => [category.key, { weighted: 0, max: 0 }]),
  ) as Record<CategoryKey, { weighted: number; max: number }>;

  QUESTIONS.forEach((question) => {
    const answer = answers[question.id];
    if (answer == null) return;
    (Object.entries(question.weights) as [CategoryKey, number][]).forEach(([key, weight]) => {
      totals[key].weighted += answer * 20 * weight;
      totals[key].max += 100 * weight;
    });
  });

  return Object.fromEntries(
    CATEGORIES.map((category) => {
      const entry = totals[category.key];
      const score = entry.max ? Math.round((entry.weighted / entry.max) * 100) : 0;
      return [category.key, score];
    }),
  ) as Record<CategoryKey, number>;
}

/** Overall score: the simple average of the 6 category scores, rounded. */
export function calculateTotalScore(categoryScores: Record<CategoryKey, number>): number {
  const sum = CATEGORIES.reduce((acc, category) => acc + categoryScores[category.key], 0);
  return Math.round(sum / CATEGORIES.length);
}

export function getLevel(score: number): Level {
  if (score >= 90) {
    return {
      name: "AI実装リード",
      badge: "高度",
      comment: "AI活用を実装・改善・展開する力が高く、チームや組織をリードできる水準です。",
    };
  }
  if (score >= 75) {
    return {
      name: "推進人材候補",
      badge: "上級手前",
      comment: "実務でAIを活用し、周囲に展開できる土台があります。実装・ガバナンスを補強すると強いです。",
    };
  }
  if (score >= 60) {
    return {
      name: "実務活用準備期",
      badge: "中級",
      comment: "日常業務や学習でAIを使う土台があります。関心領域に合わせて実践量を増やす段階です。",
    };
  }
  if (score >= 40) {
    return {
      name: "基礎定着期",
      badge: "初級",
      comment: "AIの使い方を学び始めています。まずは基礎理解と安全なプロンプト活用を固めると伸びやすいです。",
    };
  }
  return {
    name: "AI準備期",
    badge: "入門",
    comment: "AIを安全に使うための基本から始めるとよい状態です。短時間の基礎講座で全体像をつかみましょう。",
  };
}

/** Builds per-category target scores from selected interests, clamped for students. */
export function buildTargets(
  interestKeys: readonly InterestKey[],
  userType: UserType,
): Record<CategoryKey, number> {
  const baseline = userType === "student" ? 68 : 72;
  const targets = Object.fromEntries(
    CATEGORIES.map((category) => [category.key, baseline]),
  ) as Record<CategoryKey, number>;

  const interestObjects = interestKeys
    .map((key) => INTERESTS.find((interest) => interest.key === key))
    .filter((interest): interest is (typeof INTERESTS)[number] => Boolean(interest));

  interestObjects.forEach((interest) => {
    (Object.entries(interest.targets) as [CategoryKey, number][]).forEach(([key, value]) => {
      const candidate = userType === "student" ? Math.min(value, 84) : value;
      targets[key] = Math.max(targets[key] ?? 0, candidate);
    });
  });

  return targets;
}

/** Computes the gap (target - current) per category, sorted descending by gap. */
export function buildGaps(
  categoryScores: Record<CategoryKey, number>,
  targetScores: Record<CategoryKey, number>,
): Gap[] {
  return (Object.entries(targetScores) as [CategoryKey, number][])
    .map(([key, target]) => {
      const current = categoryScores[key] ?? 0;
      return {
        key,
        label: getCategoryLabel(key),
        target,
        current,
        gap: Math.max(0, target - current),
      };
    })
    .sort((a, b) => b.gap - a.gap);
}

export interface Strength {
  key: CategoryKey;
  label: string;
  score: number;
  description: string;
}

export function buildStrengths(
  scores: Record<CategoryKey, number>,
  strengthCopy: Record<CategoryKey, string>,
): Strength[] {
  return (Object.entries(scores) as [CategoryKey, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, score]) => ({
      key,
      label: getCategoryLabel(key),
      score,
      description: strengthCopy[key],
    }));
}

export function buildUseCases(scores: Record<CategoryKey, number>): string[] {
  const items: string[] = [];
  if (scores.prompt >= 65) {
    items.push("調査、要約、資料作成、議事録整理、メール作成の品質と速度を上げられます。");
  }
  if (scores.business >= 65) {
    items.push("業務プロセスを分解し、AIで短縮できる作業を見つけやすい状態です。");
  }
  if (scores.data >= 65) {
    items.push("データやグラフから示唆を読み取り、企画・改善提案に活かせます。");
  }
  if (scores.automation >= 65) {
    items.push("Bot、自動化、AIコーディング支援など、実装寄りのテーマに進めます。");
  }
  if (scores.governance >= 65) {
    items.push("安全利用、情報管理、社内ルール整備の観点を持ってAI活用を進められます。");
  }
  if (items.length < 3) {
    items.push(
      "基礎理解とプロンプト活用を補強すると、日常業務・学習で使える場面が増えます。",
      "関心テーマを1つに絞って実践課題を作ると、短期間で成長を実感できます。",
    );
  }
  return items.slice(0, 5);
}

export interface LearningPathItem {
  title: string;
  text: string;
}

export function buildLearningPath(gaps: Gap[], topCourseTitle: string | undefined): LearningPathItem[] {
  const path: LearningPathItem[] = [];
  const add = (title: string, text: string) => path.push({ title, text });

  if (gaps.find((gap) => gap.key === "literacy" && gap.gap > 12)) {
    add(
      "AI基礎理解を整える",
      "生成AIの仕組み、得意・不得意、リスクを先に押さえると、その後の実践が安定します。",
    );
  }
  if (gaps.find((gap) => gap.key === "prompt" && gap.gap > 10)) {
    add(
      "プロンプト活用を型化する",
      "目的、条件、出力形式、確認観点をテンプレート化して、日常業務・学習で繰り返し使います。",
    );
  }
  if (gaps.find((gap) => gap.key === "business" && gap.gap > 10)) {
    add(
      "業務・課題を分解する",
      "AIを使う前に、対象業務・課題・成果物・KPIを整理すると効果が出やすくなります。",
    );
  }
  if (gaps.find((gap) => gap.key === "data" && gap.gap > 10)) {
    add("データ活用を補強する", "データの読み方、可視化、仮説、意思決定へのつなげ方を学びます。");
  }
  if (gaps.find((gap) => gap.key === "automation" && gap.gap > 10)) {
    add(
      "実装・自動化に進む",
      "Dify、AIコーディング、ノーコード、エージェント設計など、実装の選択肢を広げます。",
    );
  }
  if (gaps.find((gap) => gap.key === "governance" && gap.gap > 10)) {
    add(
      "安全利用とルールを整える",
      "個人情報、機密情報、著作権、レビュー、ログ、運用ルールを学びます。",
    );
  }
  if (path.length === 0) {
    add(
      "関心テーマで実践課題を作る",
      "現在のスキル水準は高めです。推奨講座を使い、社内・学校内で使える成果物を作る段階です。",
    );
  }
  if (topCourseTitle) {
    add(
      `推奨講座「${topCourseTitle}」で実践する`,
      "講座の成果物を自分の業務・学習テーマに置き換え、すぐ使える形にします。",
    );
  }
  return path.slice(0, 6);
}

export interface ValueEstimateItem {
  label: string;
  value: string;
  meter: number;
}

export interface ValueEstimate {
  kind: "student" | "adult";
  title: string;
  text: string;
  headline?: string;
  items: ValueEstimateItem[];
}

export function buildValueEstimate(
  userType: UserType,
  baseIncome: number,
  totalScore: number,
  scores: Record<CategoryKey, number>,
): ValueEstimate {
  if (userType === "student") {
    return {
      kind: "student",
      title: "将来の活用領域",
      text: "AIスキルは、進学、探究学習、情報発信、データ分析、将来の職業選択で横断的に活かせます。",
      items: [
        {
          label: "探究・レポート",
          value: scores.prompt >= 60 ? "活用しやすい" : "基礎から補強",
          meter: scores.prompt,
        },
        {
          label: "データ・STEAM",
          value: scores.data >= 60 ? "発展可能" : "読み解きから",
          meter: scores.data,
        },
        {
          label: "進路・キャリア",
          value: totalScore >= 70 ? "強みにできる" : "学習計画で伸ばせる",
          meter: totalScore,
        },
      ],
    };
  }

  const multiplier =
    totalScore >= 90 ? 1.3 : totalScore >= 75 ? 1.22 : totalScore >= 60 ? 1.14 : totalScore >= 40 ? 1.07 : 1;
  const base = Number(baseIncome || 0);
  const estimate = base ? Math.round(base * multiplier) : 0;
  const maxIncome = Math.max(base, estimate, 800);

  return {
    kind: "adult",
    title: "報酬額見込み（参考）",
    text: "AI関連求人の賃金プレミアム報道等を参考にした相対的な目安です。個別の報酬、昇給、転職成果を保証するものではありません。",
    headline: estimate ? `${estimate.toLocaleString()}万円` : `${multiplier.toFixed(2)}x`,
    items: [
      {
        label: "現在入力額",
        value: base ? `${base.toLocaleString()}万円` : "未入力",
        meter: base ? Math.max(18, Math.round((base / maxIncome) * 100)) : 18,
      },
      {
        label: "参考倍率",
        value: `${multiplier.toFixed(2)}x`,
        meter: Math.round((multiplier / 1.3) * 100),
      },
      {
        label: "スキル反映後の目安",
        value: estimate ? `${estimate.toLocaleString()}万円` : "+5〜30%の相対目安",
        meter: estimate ? Math.round((estimate / maxIncome) * 100) : 74,
      },
    ],
  };
}
