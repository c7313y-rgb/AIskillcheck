import { useState } from "react";
import type { DiagnosisResult } from "../lib/diagnosis";
import { getInterestLabel } from "../lib/scoring";
import { GOOGLE_FORMS_CONFIG } from "../data/googleForms";

interface PlanFormProps {
  result: DiagnosisResult | null;
  showToast: (message: string) => void;
  showError: (message: string) => void;
}

const LEARNING_MODES = [
  "まずはオンデマンドで学びたい",
  "オンラインLiveで学びたい",
  "対面・ワークショップで学びたい",
  "自社・学校向けに組み合わせたい",
];

function buildNotes(result: DiagnosisResult): string {
  const interests = result.profile.interests.map(getInterestLabel).join("、");
  const topCourses = result.courses.top
    .slice(0, 3)
    .map((course) => course.title)
    .join("、");
  return `診断スコア：${result.totalScore}/100\nレベル：${result.level.name}\n関心テーマ：${interests}\n推奨講座：${topCourses}`;
}

export function PlanForm({ result, showToast, showError }: PlanFormProps) {
  // Re-mounted (via `key`) whenever the diagnosis result changes, so local state
  // can be derived once from `result` without needing a synchronizing effect.
  const [contactName, setContactName] = useState(result?.profile.personName ?? "");
  const [email, setEmail] = useState("");
  const [contactOrg, setContactOrg] = useState(result?.profile.organization ?? "");
  const [learningMode, setLearningMode] = useState(LEARNING_MODES[0]);
  const [notes, setNotes] = useState(result ? buildNotes(result) : "");

  function handleCopyPlan() {
    if (!result) {
      showError("先に診断を実行してください。");
      return;
    }
    navigator.clipboard
      .writeText(notes)
      .then(() => showToast("学習プランをコピーしました"))
      .catch(() => showError("クリップボードへコピーできませんでした。"));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result) {
      showError("先に診断を実行してください。");
      return;
    }

    const planData = { contactName, email, contactOrg, learningMode, notes };

    if (!GOOGLE_FORMS_CONFIG.enabled || !GOOGLE_FORMS_CONFIG.formActionUrl) {
      localStorage.setItem("aiSkillDiagnosisPlan", JSON.stringify(planData));
      showToast("送信デモとして保存しました。Googleフォーム設定後に実送信できます。");
      return;
    }

    const entries = GOOGLE_FORMS_CONFIG.entries;
    const recommendedCourses = result.courses.top
      .slice(0, 3)
      .map((course) => course.title)
      .join("、");
    const interests = result.profile.interests.map(getInterestLabel).join("、");
    const mapping: Record<string, string> = {
      [entries.name]: contactName,
      [entries.email]: email,
      [entries.organization]: contactOrg,
      [entries.userType]: result.profile.userType === "student" ? "生徒・学生" : "社会人",
      [entries.totalScore]: String(result.totalScore),
      [entries.level]: result.level.name,
      [entries.interests]: interests,
      [entries.recommendedCourses]: recommendedCourses,
      [entries.learningMode]: learningMode,
      [entries.notes]: notes,
      [entries.diagnosisJson]: JSON.stringify(result),
    };

    const payload = new FormData();
    Object.entries(mapping).forEach(([key, value]) => {
      if (key) payload.append(key, value ?? "");
    });

    fetch(GOOGLE_FORMS_CONFIG.formActionUrl, { method: "POST", mode: "no-cors", body: payload })
      .then(() => showToast("学習プランを送信しました"))
      .catch(() => showError("Googleフォームへの送信に失敗しました。設定をご確認ください。"));
  }

  return (
    <article id="plan" className="large-card share-panel premium-card" aria-labelledby="plan-heading">
      <div className="share-copy">
        <div className="section-label">Learning Plan</div>
        <h3 id="plan-heading">学習プランを保存・共有</h3>
        <p>診断結果、関心テーマ、推奨講座をまとめて送信できます。Googleフォームと連携すると、回答一覧に診断結果が蓄積されます。</p>
        <ul className="share-points">
          <li>推奨講座の相談メモをそのまま送信可能</li>
          <li>学校・企業導入の検討材料として再利用しやすい</li>
          <li>印刷 / PDF とあわせて面談資料として活用可能</li>
        </ul>
      </div>
      <form className="plan-form" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label htmlFor="contactName">
            お名前
            <input
              id="contactName"
              name="contactName"
              required
              type="text"
              placeholder="例：山田 太郎"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
            />
          </label>
          <label htmlFor="email">
            メールアドレス
            <input
              id="email"
              name="email"
              required
              type="email"
              placeholder="sample@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label htmlFor="contactOrg">
            所属・学校・会社
            <input
              id="contactOrg"
              name="contactOrg"
              type="text"
              placeholder="例：〇〇株式会社 / 〇〇高校"
              value={contactOrg}
              onChange={(event) => setContactOrg(event.target.value)}
            />
          </label>
          <label htmlFor="learningMode">
            希望する学習形式
            <select
              id="learningMode"
              name="learningMode"
              value={learningMode}
              onChange={(event) => setLearningMode(event.target.value)}
            >
              {LEARNING_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label htmlFor="notes">
          メモ・補足
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="例：営業部門で資料作成とExcel業務改善に活かしたい"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
        <div className="form-actions">
          <button className="secondary-action" type="button" onClick={handleCopyPlan}>
            学習プランをコピー
          </button>
          <button className="primary-action" type="submit">
            学習プランを送信
          </button>
        </div>
        <p className="form-note">Googleフォーム未設定時はブラウザ内で送信デモとして保存されます。</p>
      </form>
    </article>
  );
}
