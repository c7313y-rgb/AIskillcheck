import { Fragment } from "react";

const STEPS = [
  { label: "STEP 1", title: "基本情報入力", duration: "約1分" },
  { label: "STEP 2", title: "AIスキル診断", duration: "約15分" },
  { label: "STEP 3", title: "結果分析", duration: "約2分" },
  { label: "STEP 4", title: "おすすめ提案", duration: "約1分" },
  { label: "STEP 5", title: "レポート確認", duration: "約1分" },
];

export function Steps() {
  return (
    <section className="start-row premium-card" aria-label="診断の進め方">
      {STEPS.map((step, index) => (
        <Fragment key={step.label}>
          <div className={`step${index === 0 ? " active" : ""}`}>
            <small>{step.label}</small>
            <b>{step.title}</b>
            <span>{step.duration}</span>
          </div>
          {index < STEPS.length - 1 && <i aria-hidden="true">›</i>}
        </Fragment>
      ))}
      <a className="start-button" href="#diagnosis">
        診断をはじめる（約20分）<span aria-hidden="true">›</span>
      </a>
      <p>途中保存できます</p>
    </section>
  );
}
