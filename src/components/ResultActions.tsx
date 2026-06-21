import type { DiagnosisResult } from "../lib/diagnosis";
import { CATEGORIES } from "../data/categories";

interface ResultActionsProps {
  result: DiagnosisResult;
  showToast: (message: string) => void;
  showError: (message: string) => void;
}

function buildPlainText(result: DiagnosisResult): string {
  return [
    "AIスキル診断結果",
    `スコア：${result.totalScore}/100`,
    `レベル：${result.level.name}`,
    `コメント：${result.level.comment}`,
    "",
    "領域別スコア：",
    ...CATEGORIES.map((category) => `・${category.label}: ${result.categoryScores[category.key]}`),
    "",
    "強み：",
    ...result.strengths.map((item, index) => `${index + 1}. ${item.label} (${item.score})`),
    "",
    "推奨講座：",
    ...result.courses.top.slice(0, 3).map((course, index) => `${index + 1}. ${course.title}（${course.mode} / ${course.price}）`),
    "",
    "先に学ぶ順番：",
    ...result.learningPath.map((item, index) => `${index + 1}. ${item.title} - ${item.text}`),
  ].join("\n");
}

export function ResultActions({ result, showToast, showError }: ResultActionsProps) {
  function handleCopy() {
    navigator.clipboard
      .writeText(buildPlainText(result))
      .then(() => showToast("診断結果をコピーしました"))
      .catch(() => showError("クリップボードへコピーできませんでした。"));
  }

  function handleDownload() {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-skill-diagnosis-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="result-actions">
      <button className="secondary-action" type="button" onClick={handleCopy}>
        結果をコピー
      </button>
      <button className="secondary-action" type="button" onClick={handleDownload}>
        JSON保存
      </button>
      <button className="primary-action" type="button" onClick={() => window.print()}>
        印刷 / PDF
      </button>
    </div>
  );
}
