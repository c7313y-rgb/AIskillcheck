import type { Package, HomePreviewIds, StrengthCopy } from "./types";

export const PACKAGES: readonly Package[] = [
  {
    id: "P1",
    title: "Lite：AI業務改善スターター",
    courses: ["A01", "A04"],
    price: "49.8万円",
    hours: "10h",
    target: "AIを何から始めるか整理したい部門",
    image: "package-business.jpg",
  },
  {
    id: "P2",
    title: "Office AI：Office/Google横断活用",
    courses: ["A01", "A02", "A03", "A04"],
    price: "98万円",
    hours: "12h",
    target: "全社展開・アンバサダー育成",
    image: "online-live.jpg",
  },
  {
    id: "P3",
    title: "Business PM：AI導入推進者育成",
    courses: ["A01", "A04", "A05", "A06"],
    price: "160万円",
    hours: "18h",
    target: "PoC設計・Dify活用・DX推進",
    image: "package-business.jpg",
  },
  {
    id: "P4",
    title: "Dev Starter：AIコーディング導入",
    courses: ["A07", "A08", "A10"],
    price: "130万円",
    hours: "16h",
    target: "開発組織のAI活用・品質担保",
    image: "course-10-sdd.jpg",
  },
  {
    id: "P5",
    title: "Agent Premium：AIエージェント内製化",
    courses: ["A06", "A09", "A10", "A11"],
    price: "260万円〜",
    hours: "30h",
    target: "RAG・Agent・SDD・内製化",
    image: "course-11-agent.jpg",
  },
  {
    id: "P6",
    title: "Enterprise：3か月伴走パック",
    courses: ["A05", "A06", "A11"],
    price: "350万円〜",
    hours: "40h〜",
    target: "PoC計画・評価設計・社内展開ロードマップ",
    image: "course-05-project.jpg",
  },
] as const;

export const HOME_PREVIEW_IDS: HomePreviewIds = {
  student: ["E01", "E03", "E05", "E06"],
  adult: ["A01", "A04", "A06", "A11"],
};

export const STRENGTH_COPY: StrengthCopy = {
  literacy: "AIの前提理解と安全な使い分けが安定しています。",
  prompt: "指示設計と改善の往復で成果物の質を高めやすいです。",
  business: "現場課題をAI活用テーマに変換する視点があります。",
  data: "データから示唆を引き出し、判断につなげる素地があります。",
  automation: "ツール連携や実装イメージを描きやすい状態です。",
  governance: "安全利用やルール整備の視点を持って推進できます。",
};
