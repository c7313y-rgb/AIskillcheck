# AIスキル診断（AI Skill Diagnosis）

DXリテラシー標準・DX推進スキル標準を参考に、AIスキルの習得度・活かせる領域・学習ギャップ・推奨講座を可視化する診断Webアプリです。

旧版（静的 HTML/CSS/JS）から、機能を1:1で移行しつつ React + TypeScript + Vite によるモダンなアーキテクチャへ全面リライトしました。

公開URL: https://c7313y-rgb.github.io/AI-skillcheck/

## 技術スタック

- **Vite** — ビルドツール（`base: "/AI-skillcheck/"` で GitHub Pages サブパス配信に対応）
- **React 19** + **TypeScript（strict）**
- **Vitest** + **@testing-library/react** — ユニットテスト
- **ESLint**（typescript-eslint, react-hooks, react-refresh） + **Prettier**
- **sharp**（ビルド前処理）— 画像をレスポンシブ WebP（480/960/1600px）に変換

## ディレクトリ構成

```
src/
  components/   UIをセクション単位に分割したReactコンポーネント
  context/      DiagnosisContext（useReducerベースの状態管理）, useDiagnosisフック
  data/         診断データ（カテゴリ・興味・設問・講座・パッケージ）の型付きデータ
  lib/          スコアリング・推薦ロジックの純粋関数（テスト対象）
    __tests__/  Vitestユニットテスト
  styles/       レガシーCSS（トンマナ維持）+ アクセシビリティ追加CSS
  test/         テストセットアップ
public/         robots.txt, sitemap.xml, favicon 等
.github/workflows/deploy-pages.yml  GitHub Pages 自動デプロイ（lint→test→build→deploy）
```

## セットアップ

```bash
npm install
npm run dev        # 開発サーバー
npm run build       # 型チェック + 本番ビルド（dist/）
npm run preview     # ビルド結果のローカル確認
npm run lint         # ESLint
npm run format       # Prettier 整形
npm run test         # Vitest（ユニットテスト）
npm run test:watch  # Vitest watch モード
```

デモモード: `?demo=1#result` をURLに付与すると、固定のサンプル回答で診断結果画面まで自動遷移します（動作確認・スクリーンショット用）。

## 旧版からの変更点

- **ロジックの分離**: スコア計算・レベル判定・講座推薦・学習ギャップ分析を `src/lib/` 内の純粋関数として抽出し、Vitestで単体テスト（27件）を整備。
- **データの型付け**: 設問24件・社会人向け講座11件・教育機関向け講座7件・パッケージ6件・興味カテゴリ9件を、すべて型安全なTypeScriptデータとして移植（文言・点数・価格は変更なし）。
- **コンポーネント分割**: Hero、Steps、DiagnosisForm、QuestionList、ResultSection、RadarChart、CourseRecommendations など、状態を持つロジックと表示を分離。
- **状態管理**: React Context + useReducer によるグローバルな診断フォーム状態管理（外部ライブラリ不使用）。
- **アクセシビリティ強化**: 5段階評価のラジオグループに `fieldset`/`legend` を付与、進捗バーに `aria-live`、スキップリンク、フォーカスリング、画像 alt 等を追加。
- **SEO強化**: meta description / OG / Twitter Card の整備に加え、JSON-LD（WebApplication）構造化データ、robots.txt、sitemap.xml を追加。
- **パフォーマンス改善**: 大きなPNG画像（1.6MB/2.1MB）をレスポンシブWebP（srcset対応、480/960/1600px）に変換し大幅に軽量化。React Vendorチャンクの分割。
- **グラフのSVG化**: 旧版の `<canvas>` 描画（スコアリング・レーダーチャート）を、読み上げ対応（`<title>`/`aria-label`）かつ高DPIでも鮮明なSVGコンポーネントに置き換え。
- **CI整備**: GitHub Actions で `npm ci` → lint → test → build → Pages デプロイの自動化フローを構築。

UI/UXの見た目・配色・コンテンツ構成は旧版を維持し、アクセシビリティ/視認性に関わる範囲のみ改善しています。

## 既知の制限・今後の改善余地

- Google Forms 連携（学習プラン共有フォームの送信）は `src/data/googleForms.ts` の `GOOGLE_FORMS_CONFIG.enabled` をデフォルト `false` にして無効化中。本番運用時はフォームIDとentry IDを設定し有効化が必要。
- コンポーネント単位のレンダリングテスト（Testing Library）は未整備。現状は `src/lib/` のロジックのみを単体テストでカバー。
- PWA化（`vite-plugin-pwa`）は依存関係としては導入済みだが未設定（Service Worker未設定）。オフライン対応が必要な場合は追加実装が必要。
- 画像の `og-image.png` は旧版のパスを参照しているのみで、新規生成はしていません（必要に応じて差し替えてください）。
