import { ScoreRing } from "./ScoreRing";
import { RadarChart } from "./RadarChart";
import { StrengthHighlights } from "./StrengthHighlights";
import { GapList } from "./GapList";
import { ValueEstimateCard } from "./ValueEstimateCard";
import { LearningPath } from "./LearningPath";
import { CourseRecommendations } from "./CourseRecommendations";
import { PlanForm } from "./PlanForm";
import { ResultActions } from "./ResultActions";
import type { DiagnosisResult } from "../lib/diagnosis";

interface ResultSectionProps {
  result: DiagnosisResult | null;
  showToast: (message: string) => void;
  showError: (message: string) => void;
}

export function ResultSection({ result, showToast, showError }: ResultSectionProps) {
  return (
    <section id="result" className={`result-section${result ? "" : " hidden"}`} aria-live="polite">
      {result && (
        <>
          <div className="result-hero premium-card">
            <div>
              <div className="section-label">Result</div>
              <h2>診断結果</h2>
              <p>
                {result.profile.personName || "あなた"}のAIスキル習得度は{result.totalScore}
                点です。{result.level.name}として、次に強化するとよい領域を整理しました。
              </p>
            </div>
            <ResultActions result={result} showToast={showToast} showError={showError} />
          </div>

          <div className="result-grid-main">
            <article className="score-card large-card premium-card" aria-labelledby="score-heading">
              <ScoreRing score={result.totalScore} />
              <div className="score-detail">
                <span id="score-heading">AIスキル習得度</span>
                <strong>{result.totalScore}</strong>
                <em>/100</em>
                <b>{result.level.name}</b>
                <p>{result.level.comment}</p>
              </div>
            </article>
            <article className="large-card radar-card premium-card" aria-labelledby="radar-heading">
              <div className="card-title">
                <h3 id="radar-heading">スキル領域別バランス</h3>
                <small>6領域</small>
              </div>
              <RadarChart scores={result.categoryScores} targets={result.targetScores} />
            </article>
            <StrengthHighlights strengths={result.strengths} useCases={result.useCases} />
          </div>

          <div className="result-grid-two">
            <GapList gaps={result.gaps} />
            <ValueEstimateCard value={result.value} />
          </div>

          <LearningPath items={result.learningPath} />
          <CourseRecommendations result={result} />
          <PlanForm key={result.generatedAt} result={result} showToast={showToast} showError={showError} />
        </>
      )}
    </section>
  );
}
