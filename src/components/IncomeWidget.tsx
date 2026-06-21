export function IncomeWidget() {
  return (
    <article className="premium-card value-widget" aria-labelledby="income-heading">
      <div className="card-head">
        <h2 id="income-heading">年収アップの可能性（参考）</h2>
        <a href="#career">もっと見る</a>
      </div>
      <div className="income-row">
        <span>
          <small>現在の想定年収</small>
          <b>520万円</b>
        </span>
        <i aria-hidden="true">➜</i>
        <span>
          <small>スキルアップ後の想定年収</small>
          <b>720万円</b>
          <em>+200万円（+38%）</em>
        </span>
      </div>
      <h3>市場価値の高いAI人材の特徴</h3>
      <ul>
        <li>AIを活用した課題解決ができる</li>
        <li>データに基づいた意思決定ができる</li>
        <li>AIプロジェクトを推進できる</li>
        <li>ビジネスにAIを組み込める</li>
      </ul>
    </article>
  );
}
