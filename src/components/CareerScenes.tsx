const SCENES = [
  {
    key: "productivity",
    icon: "⚡",
    kicker: "Workflow",
    accent: "Ops",
    title: "業務効率化",
    text: "自動化・生産性向上",
  },
  {
    key: "data",
    icon: "📈",
    kicker: "Insight",
    accent: "Data",
    title: "データ分析・意思決定",
    text: "データドリブン経営",
  },
  {
    key: "innovation",
    icon: "🚀",
    kicker: "Launch",
    accent: "New Biz",
    title: "新規サービス開発",
    text: "イノベーション創出",
  },
];

export function CareerScenes() {
  return (
    <article className="premium-card scene-card" aria-labelledby="scene-heading">
      <div className="card-head">
        <h2 id="scene-heading">AIスキルを活かせるシーン</h2>
        <a href="#skillmap">もっと見る</a>
      </div>
      <div className="scene-list">
        {SCENES.map((scene) => (
          <figure className={`scene-item scene-${scene.key}`} key={scene.key}>
            <span className="scene-badge" aria-hidden="true">
              {scene.icon}
            </span>
            <div className="scene-art" aria-hidden="true">
              <span>{scene.kicker}</span>
              <strong>{scene.accent}</strong>
            </div>
            <figcaption>
              <b>{scene.title}</b>
              <span>{scene.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}
