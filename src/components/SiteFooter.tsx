export function SiteFooter() {
  return (
    <footer id="settings" className="site-footer premium-card">
      <p>
        本診断は学習・研修設計のための参考ツールです。DXリテラシー標準・DX推進スキル標準を参考に、AI活用に必要な領域を独自に再整理しています。
      </p>
      <p className="footer-links">
        <a
          href="https://www.meti.go.jp/policy/it_policy/jinzai/skill_standard/main.html"
          target="_blank"
          rel="noreferrer"
        >
          経済産業省 デジタルスキル標準
        </a>
        <a href="https://www.ipa.go.jp/jinzai/skill-standard/dss/about.html" target="_blank" rel="noreferrer">
          IPA デジタルスキル標準
        </a>
      </p>
    </footer>
  );
}
