import { CATEGORIES } from "../data/categories";
import type { CategoryKey } from "../data/types";

interface RadarChartProps {
  scores: Record<CategoryKey, number>;
  targets: Record<CategoryKey, number>;
}

/** SVG replacement for the legacy <canvas id="radarCanvas"> radar chart. */
export function RadarChart({ scores, targets }: RadarChartProps) {
  const width = 420;
  const height = 320;
  const centerX = width / 2;
  const centerY = height / 2 + 8;
  const radius = Math.min(width, height) * 0.33;

  const point = (index: number, value: number): [number, number] => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / CATEGORIES.length;
    const ring = (radius * value) / 100;
    return [centerX + Math.cos(angle) * ring, centerY + Math.sin(angle) * ring];
  };

  const ringPaths = [1, 2, 3, 4].map((ring) => {
    const points = CATEGORIES.map((_, index) => point(index, ring * 25));
    return points.map((p) => p.join(",")).join(" ");
  });

  const targetPoints = CATEGORIES.map((category, index) => point(index, targets[category.key] ?? 0));
  const scorePoints = CATEGORIES.map((category, index) => point(index, scores[category.key] ?? 0));

  const summary = CATEGORIES.map((category) => `${category.label} ${scores[category.key] ?? 0}点`).join("、");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={`スキル領域別レーダーチャート：${summary}`}>
      <title>スキル領域別レーダーチャート</title>
      {ringPaths.map((pathPoints, idx) => (
        <polygon key={idx} points={pathPoints} fill="none" stroke="#dbe8f6" strokeWidth={1} />
      ))}
      {CATEGORIES.map((category, index) => {
        const [x, y] = point(index, 100);
        const anchor = x < centerX - 5 ? "end" : x > centerX + 5 ? "start" : "middle";
        const dx = x < centerX ? -8 : x > centerX ? 8 : 0;
        const dy = y < centerY ? -8 : 18;
        return (
          <g key={category.key}>
            <line x1={centerX} y1={centerY} x2={x} y2={y} stroke="#dbe8f6" strokeWidth={1} />
            <text x={x + dx} y={y + dy} fontSize={12} fontWeight={700} fill="#203654" textAnchor={anchor}>
              {category.label}
            </text>
          </g>
        );
      })}
      <polygon
        points={targetPoints.map((p) => p.join(",")).join(" ")}
        fill="rgba(154,179,204,.10)"
        stroke="#9ab3cc"
        strokeWidth={3}
        strokeDasharray="5,5"
      />
      <polygon
        points={scorePoints.map((p) => p.join(",")).join(" ")}
        fill="rgba(9,120,238,.18)"
        stroke="#0978ee"
        strokeWidth={3}
      />
      {scorePoints.map(([x, y], index) => (
        <circle key={CATEGORIES[index].key} cx={x} cy={y} r={4} fill="#0978ee" />
      ))}
    </svg>
  );
}
