import type { Strength } from "../lib/scoring";

interface StrengthHighlightsProps {
  strengths: Strength[];
  useCases: string[];
}

export function StrengthHighlights({ strengths, useCases }: StrengthHighlightsProps) {
  return (
    <article className="large-card insight-card premium-card" aria-labelledby="strength-heading">
      <div className="card-title">
        <h3 id="strength-heading">あなたの強み</h3>
        <small>スコア上位領域</small>
      </div>
      <div className="strength-highlights">
        {strengths.map((item) => (
          <div className="strength-pill" key={item.key}>
            <div>
              <b>{item.label}</b>
              <small>{item.description}</small>
            </div>
            <span>{item.score}</span>
          </div>
        ))}
      </div>
      <ul className="check-list">
        {useCases.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </article>
  );
}
