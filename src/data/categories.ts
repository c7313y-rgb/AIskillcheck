import type { Category } from "./types";

export const CATEGORIES: readonly Category[] = [
  { key: "literacy", label: "AI基礎理解", color: "#0978ee" },
  { key: "prompt", label: "プロンプト活用", color: "#14c4d8" },
  { key: "business", label: "業務改善", color: "#ff9f2f" },
  { key: "data", label: "データ活用", color: "#7b61ff" },
  { key: "automation", label: "開発・自動化", color: "#20b977" },
  { key: "governance", label: "ガバナンス", color: "#12a6a3" },
] as const;
