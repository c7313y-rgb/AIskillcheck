interface ScoreRingProps {
  score: number;
}

/**
 * SVG replacement for the legacy <canvas id="scoreCanvas">. SVG keeps the
 * value accessible to screen readers/text selection and stays crisp at any DPI.
 */
export function ScoreRing({ score }: ScoreRingProps) {
  const radius = 94;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg
      viewBox="0 0 260 260"
      width={260}
      height={260}
      role="img"
      aria-label={`AIスキル習得度 ${score}点 / 100点`}
    >
      <title>AIスキル習得度 {score}点／100点</title>
      <defs>
        <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b78eb" />
          <stop offset="100%" stopColor="#14c4d8" />
        </linearGradient>
      </defs>
      <circle cx={130} cy={130} r={radius} fill="none" stroke="#e8f2fc" strokeWidth={18} />
      <circle
        cx={130}
        cy={130}
        r={radius}
        fill="none"
        stroke="url(#score-gradient)"
        strokeWidth={18}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 130 130)"
      />
      <text x={130} y={124} textAnchor="middle" fontSize={60} fontWeight={700} fill="#07192f">
        {score}
      </text>
      <text x={130} y={166} textAnchor="middle" fontSize={18} fontWeight={700} fill="#6a7c8f">
        /100
      </text>
    </svg>
  );
}
