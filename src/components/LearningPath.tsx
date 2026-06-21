import type { LearningPathItem } from "../lib/scoring";

interface LearningPathProps {
  items: LearningPathItem[];
}

export function LearningPath({ items }: LearningPathProps) {
  return (
    <article className="large-card learning-card premium-card" aria-labelledby="learning-path-heading">
      <div className="card-title">
        <h3 id="learning-path-heading">先に学ぶとよい順番</h3>
        <small>スキル補強ロードマップ</small>
      </div>
      <ol className="timeline">
        {items.map((item) => (
          <li key={item.title}>
            <div>
              <b>{item.title}</b>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
