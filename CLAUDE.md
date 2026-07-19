# win-launcher-site

## 開発

開発サーバーを起動する際は、バックグラウンドモードを使用してください。

```sh
astro dev --background
```

バックグラウンドサーバーは `astro dev stop`、`astro dev status`、`astro dev logs` で管理します。

### base配下の画像パス生成時の注意

このプロジェクトは `astro.config.mjs` で `base: "/win-launcher-site"`(末尾スラッシュなし)を設定しているが、`import.meta.env.BASE_URL` はこの値をそのまま返すため、実際には**末尾スラッシュ無し**の文字列になる。`` `${import.meta.env.BASE_URL}favicon.svg` `` のように単純結合すると `/win-launcher-sitefavicon.svg` という区切りスラッシュ欠落のパスになり、GitHub Pages上で404になる(実際に発生した不具合)。

`public/` 配下のファイルをコンポーネント内で参照する際は、必ず末尾スラッシュを正規化してから結合すること。

```js
const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
```

## 運用上の注意

- カレントディレクトリが既にこのプロジェクトルート(`win-launcher-site`)になっているセッションでは、コマンドの先頭に `cd "D:/ai_work/dev_win/win-launcher-site" &&` を毎回付けないでください。カレントディレクトリが不明な場合のみ、確認してから実行してください。
- このリポジトリの `CLAUDE.md` は日本語で記載・更新する方針とします。

## GitHub Actionsワークフロー

`.github/workflows/deploy.yml` はmainブランチへのpushで `astro build` を実行し、GitHub Pagesへデプロイする。

- 使用アクション: `actions/checkout`、`actions/setup-node`、`actions/upload-pages-artifact`、`actions/deploy-pages`。
- 各アクションはNode.js 20ランタイムが2026年9月16日にランナーから削除される予定のため、Node.js 24ランタイムに対応したメジャーバージョン(`checkout@v7`、`setup-node@v7`、`upload-pages-artifact@v5`、`deploy-pages@v5`)に更新済み。各バージョンが `node24` ランタイムで動作することは、GitHub API経由で各アクションリポジトリの `action.yml`(`runs.using`)を確認して判断した。
- `setup-node` の `node-version: 22` はビルドに使うNode.jsのバージョン指定であり、アクション自体のランタイム(Node 20/24)とは別物。今回のNode 20非推奨警告とは無関係のため変更していない。
- 今後もこの種の警告が出た場合は、同様に各アクションの最新メジャーバージョンの `action.yml` を確認し、`node24`(またはそれ以降)に対応したバージョンへ追従すること。

## 画像素材の参照元

このサイトで使用しているスクリーンショット・アプリアイコンは、いずれも本体リポジトリ(`win-launcher`)側にある素材をコピーしたものです。更新が必要な場合は本体側の該当ファイルの最新版を都度コピーしてくること。

- スクリーンショット素材: `D:\ai_work\dev_win\win-launcher\docs\`(ファイル名は `screenshot-*.png`)→ `public/screenshots/` にコピー
- アプリアイコン: `D:\ai_work\dev_win\win-launcher\src-tauri\icons\` → `public/favicon.ico`(`icon.ico`)、`public/app-icon.png`(`128x128@2x.png`)、`public/favicon.svg`(`64x64.png` をbase64埋め込みしたSVGラッパー。本体側に真のベクター素材が無いため)

### 「主要機能」セクションのレイアウト(`Features.astro` / `FeatureGrid.tsx`)

4機能を2列×2行のカードグリッドで表示し、各カードのスクリーンショットはクリックでライトボックス(拡大モーダル)表示できる。

- `Features.astro` は静的なセクション見出し・データ配列(アイコン・タイトル・説明・画像パス)を組み立てるだけの薄いAstroコンポーネント。グリッド本体とライトボックスの状態管理(クリック開閉・Escキー・背景スクロールロック)はインタラクションが必要なため `FeatureGrid.tsx`(React, `client:load`)に実装している。スタイルは `FeatureGrid.css` に分離。
- グリッドは `grid-template-columns: repeat(2, 1fr)`(PC幅)。幅640px以下で `grid-template-columns: 1fr` の1カラムに切り替える。
- 各カードの画像は `aspect-ratio: 16 / 9` の枠(WinLauncher本体のスクリーンショットが概ね16:9前後のため)に `object-fit: contain` で収め、UIの一部が切れないようにしている(クロップしたい場合は `cover` に変更を検討)。画像は `<button>` でラップしてクリック可能にしている。
- ライトボックスは半透明オーバーレイ(`.lightbox-overlay`)+中央に原寸に近いサイズの画像(`.lightbox-image`、`max-width: 92vw` / `max-height: 88vh` で画面からはみ出さないよう制限)+右上の閉じるボタン(`.lightbox-close`)で構成。外部ライブラリは使わず、Reactの `useState` / `useEffect` のみで実装している。
- 閉じる手段は3通り: オーバーレイ部分のクリック、閉じるボタンのクリック、Escキー(`useEffect` 内で `keydown` を監視)。画像自体のクリックは `stopPropagation` でオーバーレイのクリック判定から除外している。
- モーダル表示中は `document.body.style.overflow = 'hidden'` で背景スクロールをロックし、閉じたとき/アンマウント時に元に戻す。

### ヒーロー部分のワードマーク表記

ロゴアイコンの下・大見出し(`<h1>`)の上に、アプリ名を示すワードマーク `<p class="wordmark">WinLauncher</p>` を1行追加している。既存の `<h1>` や `.subtext` のスタイルには手を加えず、`.wordmark` を新規スタイルとして追加した(`font-size: 1.05rem`、`font-weight: 700`、`color: var(--color-accent)` でアクセントカラーの小さめラベルとして表示)。`<p>` はグローバルCSSで `margin: 0 0 1em` が既定のため、`.hero-inner` の詰まったレイアウトを崩さないよう `margin: 0` で打ち消している。

### ヒーロー部分のダウンロードボタン(`DownloadDropdown.tsx`)

「GitHub Releasesからダウンロード」ボタンは、クリックで直下にドロップダウン(.exe / .msi / その他のアセット の3項目)を開く方式になっている。実装は `src/components/DownloadDropdown.tsx` + `DownloadDropdown.css`(Reactコンポーネント、`Hero.astro` から `client:load` で読み込み)。

- マウント時に GitHub API(`https://api.github.com/repos/hidecode365/win-launcher/releases/latest`)を `fetch` し、`assets` 配列から末尾が `.exe` / `.msi` のファイルを探して `browser_download_url` を取得する。リリースアセットのファイル名にはバージョン番号が含まれるためハードコードせず、常にAPIレスポンスから動的に解決している(新バージョンリリース時もサイト側のコード変更は不要)。
- 取得結果は `sessionStorage`(キー `winlauncher-latest-release-assets`)に一時キャッシュし、同一セッション内での再フェッチを避けている。
- API呼び出しが失敗した場合(レート制限・オフライン等)は、ボタン全体を Releases ページへの直接リンク(`<a>`)として描画するフォールバックに切り替わる。この場合ドロップダウンは開かない。
- ドロップダウンの開閉はメニュー外クリック(`mousedown` を監視し `ref` の外側判定)と Esc キーで閉じられる。
- 通常時(未クリック時)のボタンの見た目・ラベルは変更前の `.btn-secondary` と同一になるよう `.download-dropdown__trigger` に同じスタイルを移植している。Astroのスコープ付きCSSはReact島(子コンポーネント)側の要素には適用されないため、旧 `Hero.astro` の `.btn-secondary` ルールは削除し `DownloadDropdown.css` 側に持たせている。

### 「補足情報」セクション(旧「導入方法」セクション、`Install.astro`)

旧「導入方法」セクション(wingetコマンドのコードブロック+「手動インストールはこちら」リンク)は削除し、以下4項目を並べる補足情報セクションに差し替えた。

- 動作環境(Windows 11 x64)
- インストーラーの選び方(.exe = 個人向け通常インストール推奨 / .msi = 企業のサイレントインストール・MDM配布向け)
- 自動更新について(バックグラウンドで自動的に最新版へ更新される旨)
- オープンソース・サーバーレスである旨

wingetコマンドのコピー機能はヒーロー部分に既にあり重複するため、このセクションでは扱わない。ファイル名・コンポーネント名(`Install.astro`)は変更していないが、中身は `FeatureGrid` のカードと似た `info-card` グリッド(2列→640px以下で1列)に置き換わっている。

## ドキュメント

公式ドキュメント: <https://docs.astro.build>

関連タスクに着手する前に、以下のガイドを参照してください。

- [ページ、動的ルート、ミドルウェアの追加](https://docs.astro.build/en/guides/routing/)
- [Astroコンポーネントの利用](https://docs.astro.build/en/basics/astro-components/)
- [React、Vue、Svelteなど他フレームワークのコンポーネント利用](https://docs.astro.build/en/guides/framework-components/)
- [コンテンツの追加・管理](https://docs.astro.build/en/guides/content-collections/)
- [スタイルの追加・Tailwindの利用](https://docs.astro.build/en/guides/styling/)
- [多言語対応](https://docs.astro.build/en/guides/internationalization/)
