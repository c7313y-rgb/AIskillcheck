import type { ValueEstimate } from "../lib/scoring";

interface ValueEstimateCardProps {
  value: ValueEstimate;
}

export function ValueEstimateCard({ value }: ValueEstimateCardProps) {
  const headline = value.headline ?? value.title;
  return (
    <article id="career" className="large-card value-card premium-card" aria-labelledby="value-heading">
      <div className="card-title">
        <h3 id="value-heading">報酬額・市場価値の参考表示</h3>
        <small>保証ではなく参考情報</small>
      </div>
      <div className="value-estimate">
        <div className="value-box">
          <strong>{headline}</strong>
          <small>{value.text}</small>
        </div>
        {value.items.map((item) => (
          <div className="gap-item" key={item.label}>
            <b>{item.label}</b>
            <div className="meter">
              <span style={{ width: `${Math.max(12, Math.min(100, item.meter || 0))}%` }} />
            </div>
            <em>{item.value}</em>
          </div>
        ))}
      </div>
    </article>
  );
}
