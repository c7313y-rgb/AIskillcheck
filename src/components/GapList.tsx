import type { Gap } from "../lib/scoring";

interface GapListProps {
  gaps: Gap[];
}

export function GapList({ gaps }: GapListProps) {
  return (
    <article className="large-card premium-card" aria-labelledby="gap-heading">
      <div className="card-title">
        <h3 id="gap-heading">関心領域とのスキル差</h3>
        <small>優先して伸ばす順</small>
      </div>
      <div className="gap-list">
        {gaps.slice(0, 6).map((gap) => (
          <div className="gap-item" key={gap.key}>
            <b>{gap.label}</b>
            <div className="meter">
              <span style={{ width: `${Math.min(100, gap.current)}%` }} />
            </div>
            <em>
              {gap.current}/{gap.target}
            </em>
          </div>
        ))}
      </div>
    </article>
  );
}
