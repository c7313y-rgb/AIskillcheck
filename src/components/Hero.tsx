import heroImage480 from "../assets/hero-480.webp";
import heroImage960 from "../assets/hero-960.webp";
import heroImage1600 from "../assets/hero-1600.webp";
import heroImageFallback from "../assets/hero.webp";

export function Hero() {
  return (
    <section className="hero-board" aria-labelledby="hero-heading">
      <div className="hero-image">
        <img
          src={heroImageFallback}
          srcSet={`${heroImage480} 480w, ${heroImage960} 960w, ${heroImage1600} 1600w`}
          sizes="(max-width: 980px) 100vw, 60vw"
          width={1600}
          height={900}
          fetchPriority="high"
          alt="AIスキル診断のメインビジュアル"
        />
        <div className="hero-copy">
          <h1 id="hero-heading">AIスキル診断</h1>
          <p className="lead">
            あなたのAIスキルを可視化し、
            <br />
            最適な学びとキャリアを見つけよう
          </p>
          <p>
            経済産業省・IPAの「デジタルスキル標準」を参照したAIスキル診断で、現在地と次の伸ばし方をひと目で把握できます。
          </p>
          <div className="standard-badges">
            <span>DXリテラシー標準 対応</span>
            <span>DX推進スキル標準 対応</span>
          </div>
        </div>
      </div>

      <aside className="sample-score premium-card" aria-label="サンプルのAIスキルスコア表示">
        <div className="card-head">
          <h2>あなたのAIスキルスコア</h2>
          <span className="hint-icon" aria-hidden="true">
            i
          </span>
        </div>
        <div className="sample-score-body">
          <div className="ring-sample" aria-hidden="true">
            <span>72</span>
            <small>/100</small>
          </div>
          <div className="sample-level">
            <p>レベル</p>
            <b>上級手前</b>
            <div className="stars" aria-label="4つ星">
              ★★★★☆
            </div>
            <p>総合評価</p>
            <span>AI活用を主体的に推進できるスキルが身についています</span>
          </div>
        </div>
        <div className="score-breakdown">
          <span>
            <b>▣</b>リテラシー<em>78/100</em>
          </span>
          <span>
            <b>▥</b>データ活用<em>68/100</em>
          </span>
          <span>
            <b>⚙</b>AI活用<em>72/100</em>
          </span>
          <span>
            <b>⌘</b>開発・実装<em>65/100</em>
          </span>
          <span>
            <b>◇</b>マネジメント<em>75/100</em>
          </span>
        </div>
      </aside>
    </section>
  );
}
