import { useEffect, useRef } from "react";
import { ProfileForm } from "./ProfileForm";
import { InterestPicker } from "./InterestPicker";
import { QuestionList } from "./QuestionList";
import { useDiagnosis } from "../context/useDiagnosis";
import { calculateResult } from "../lib/diagnosis";
import { isAnswersComplete } from "../lib/diagnosis";
import type { DiagnosisResult } from "../lib/diagnosis";

interface DiagnosisFormProps {
  onResult: (result: DiagnosisResult, options?: { silent?: boolean }) => void;
  showToast: (message: string) => void;
  showError: (message: string) => void;
}

export function DiagnosisForm({ onResult, showToast, showError }: DiagnosisFormProps) {
  const { state, saveDraft } = useDiagnosis();
  const autoSaveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = window.setTimeout(() => saveDraft(true), 250);
    return () => {
      if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.form]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runDiagnosis();
  }

  function runDiagnosis(options?: { silent?: boolean }) {
    const { form } = state;
    if (!form.interests.length) {
      showError("AIを活かしたいことを1つ以上選択してください。");
      return false;
    }
    if (!isAnswersComplete(form.answers)) {
      showError("未回答の設問があります。すべての設問に回答してください。");
      return false;
    }
    const result = calculateResult({
      userType: form.userType,
      personName: form.personName,
      organization: form.organization,
      currentRole: form.currentRole,
      baseIncome: Number(form.baseIncome || 0),
      interests: form.interests,
      answers: form.answers,
    });
    onResult(result, options);
    saveDraft(true);
    if (!options?.silent) showToast("診断結果を生成しました");
    return true;
  }

  return (
    <section id="diagnosis" className="diagnosis-panel premium-card" aria-labelledby="diagnosis-heading">
      <div className="section-heading compact">
        <div className="section-label">AI Skill Check</div>
        <h2 id="diagnosis-heading">AIスキル診断をはじめる</h2>
        <p>最も近い状態を選んでください。専門職でなくても回答できるように、日常業務・学習場面に寄せた設問にしています。</p>
      </div>

      <form className="diagnosis-form" onSubmit={handleSubmit} noValidate>
        <ProfileForm />
        <InterestPicker />
        <QuestionList />

        <div className="form-actions sticky-actions">
          <span className="draft-status" aria-live="polite">
            {state.draftStatus}
          </span>
          <button
            className="secondary-action"
            type="button"
            onClick={() => {
              saveDraft(false);
              showToast("一時保存しました");
            }}
          >
            一時保存
          </button>
          <button className="primary-action" type="submit">
            診断結果を見る
          </button>
        </div>
      </form>
    </section>
  );
}
