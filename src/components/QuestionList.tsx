import { useMemo } from "react";
import { QUESTIONS } from "../data/questions";
import { CATEGORIES } from "../data/categories";
import { getPrimaryCategoryKey } from "../lib/scoring";
import { buildDemoAnswers } from "../lib/demo";
import { useDiagnosis } from "../context/useDiagnosis";

const RATING_LABELS = ["1：まだできない", "2", "3：説明を受ければできる", "4", "5：自力で実務・学習に使える"];

export function QuestionList() {
  const { state, dispatch, saveDraft } = useDiagnosis();
  const { answers } = state.form;
  const filter = state.questionFilter;

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const total = QUESTIONS.length;
  const percent = Math.round((answeredCount / total) * 100);

  const categoryCounts = useMemo(() => {
    return CATEGORIES.map((category) => ({
      key: category.key,
      label: category.label,
      count: QUESTIONS.filter((q) => getPrimaryCategoryKey(q) === category.key).length,
    }));
  }, []);

  function handleDemoFill() {
    const demo = buildDemoAnswers();
    Object.entries(demo).forEach(([questionId, value]) => {
      if (value != null) dispatch({ type: "SET_ANSWER", questionId, value });
    });
    saveDraft(true);
  }

  return (
    <section className="form-panel question-panel" aria-labelledby="question-heading">
      <div className="question-header">
        <div>
          <h3 id="question-heading">3. AIスキル診断</h3>
          <p className="hint">1＝まだできない / 3＝説明を受ければできる / 5＝自力で実務・学習に使える</p>
        </div>
        <button className="small-button" type="button" onClick={handleDemoFill}>
          デモ回答を入力
        </button>
      </div>

      <div className="diagnosis-tools">
        <div className="progress-summary">
          <div className="progress-head">
            <span id="progress-label">回答状況</span>
            <b aria-live="polite">
              {answeredCount} / {total}
            </b>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-labelledby="progress-label"
            aria-valuenow={answeredCount}
            aria-valuemin={0}
            aria-valuemax={total}
          >
            <span style={{ width: `${percent}%` }} />
          </div>
          <p aria-live="polite">
            {answeredCount === total
              ? "すべての設問に回答済みです。診断結果を見るボタンから分析へ進めます。"
              : `あと${total - answeredCount}問で完了します。近い状態を選びながら進めてください。`}
          </p>
        </div>
        <div className="category-filters" aria-label="設問のカテゴリ絞り込み">
          <button
            type="button"
            className={`filter-chip${filter === "all" ? " active" : ""}`}
            onClick={() => dispatch({ type: "SET_QUESTION_FILTER", filter: "all" })}
          >
            <b>24</b>
            <span>すべての設問</span>
          </button>
          {categoryCounts.map((category) => (
            <button
              key={category.key}
              type="button"
              className={`filter-chip${filter === category.key ? " active" : ""}`}
              onClick={() => dispatch({ type: "SET_QUESTION_FILTER", filter: category.key })}
            >
              <b>{category.count}</b>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="question-list">
        {QUESTIONS.map((question, index) => {
          const primaryKey = getPrimaryCategoryKey(question);
          const isHidden = filter !== "all" && filter !== primaryKey;
          return (
            <article className={`question-card${isHidden ? " is-hidden" : ""}`} key={question.id}>
              <fieldset className="rating-fieldset">
                <legend className="visually-hidden">{question.text}</legend>
                <div className="question-meta">
                  <span className="qno" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="qcategory">{question.category}</span>
                </div>
                <h4>{question.text}</h4>
                <div className="rating-row" role="radiogroup" aria-label={question.text}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label title={RATING_LABELS[value - 1]} key={value}>
                      <input
                        type="radio"
                        name={question.id}
                        value={value}
                        checked={answers[question.id] === value}
                        onChange={() => dispatch({ type: "SET_ANSWER", questionId: question.id, value })}
                      />
                      <span aria-hidden="true">{value}</span>
                      <span className="visually-hidden">{RATING_LABELS[value - 1]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </article>
          );
        })}
      </div>
    </section>
  );
}
