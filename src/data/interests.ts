import type { Interest } from "./types";

export const INTERESTS: readonly Interest[] = [
  {
    key: "productivity",
    label: "業務効率化",
    icon: "⚡",
    targets: { business: 88, prompt: 82, automation: 70, literacy: 70 },
  },
  {
    key: "documents",
    label: "資料作成・情報発信",
    icon: "📝",
    targets: { prompt: 88, literacy: 74, governance: 68 },
  },
  {
    key: "dataDecision",
    label: "データ分析・意思決定",
    icon: "📊",
    targets: { data: 88, business: 78, literacy: 70 },
  },
  {
    key: "revenue",
    label: "新規事業・収益化",
    icon: "💡",
    targets: { business: 86, data: 78, prompt: 76, governance: 70 },
  },
  {
    key: "implementation",
    label: "社内AI実装",
    icon: "🏢",
    targets: { business: 86, automation: 82, governance: 80, data: 74 },
  },
  {
    key: "development",
    label: "開発・自動化",
    icon: "⌘",
    targets: { automation: 90, prompt: 82, governance: 72 },
  },
  {
    key: "agent",
    label: "AIエージェント",
    icon: "🤖",
    targets: { automation: 92, data: 82, governance: 82, business: 78 },
  },
  {
    key: "learning",
    label: "学習・進路",
    icon: "🎓",
    targets: { literacy: 82, prompt: 80, data: 68, governance: 74 },
  },
  {
    key: "governance",
    label: "安全利用・ガバナンス",
    icon: "🛡",
    targets: { governance: 90, literacy: 80, data: 72 },
  },
] as const;
