const FRAMEWORK_ITEMS = [
  { no: "01", title: "AI基礎理解", text: "AIの得意・不得意、生成AIの仕組み、リスク、使い所を理解する。" },
  { no: "02", title: "プロンプト活用", text: "目的に応じて指示を設計し、要約・調査・文書作成・思考整理に使う。" },
  { no: "03", title: "業務改善", text: "業務プロセスを分解し、AIで短縮・自動化・品質向上できる箇所を見つける。" },
  { no: "04", title: "データ活用", text: "データを読み解き、示唆・意思決定・レポート作成に活かす。" },
  { no: "05", title: "開発・自動化", text: "ノーコード、AIコーディング、Bot、エージェント設計に展開する。" },
  { no: "06", title: "ガバナンス", text: "安全利用、権利、個人情報、社内ルール、品質管理を理解する。" },
];

export function SkillMap() {
  return (
    <section id="skillmap" className="framework-section premium-card" aria-labelledby="skillmap-heading">
      <div className="section-heading">
        <div className="section-label">Skill Map</div>
        <h2 id="skillmap-heading">診断設計の参照軸</h2>
        <p>
          全ビジネスパーソン向けのDXリテラシー標準と、DX推進人材向けのDX推進スキル標準を参考に、AI活用に必要なスキルを6領域に再整理しています。
        </p>
      </div>
      <div className="framework-grid">
        {FRAMEWORK_ITEMS.map((item) => (
          <div key={item.no}>
            <span aria-hidden="true">{item.no}</span>
            <b>{item.title}</b>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
