## 開発

開発サーバーを起動する際は、バックグラウンドモードを使用してください。

```
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

## 画像素材の参照元

このサイトで使用しているスクリーンショット・アプリアイコンは、いずれも本体リポジトリ(`win-launcher`)側にある素材をコピーしたものです。更新が必要な場合は本体側の該当ファイルの最新版を都度コピーしてくること。

- スクリーンショット素材: `D:\ai_work\dev_win\win-launcher\docs\`(ファイル名は `screenshot-*.png`)→ `public/screenshots/` にコピー
- アプリアイコン: `D:\ai_work\dev_win\win-launcher\src-tauri\icons\` → `public/favicon.ico`(`icon.ico`)、`public/app-icon.png`(`128x128@2x.png`)、`public/favicon.svg`(`64x64.png` をbase64埋め込みしたSVGラッパー。本体側に真のベクター素材が無いため)

### 「主要機能」セクションのレイアウト(`Features.astro`)

4カード横並びグリッドではなく、1機能1行(row)で画像とテキストを左右交互配置するレイアウトを採用している。

- DOM順は常に「テキスト→画像」(`.feature-text` → `.feature-media`)で固定し、スクリーンリーダーの読み上げ順を安定させている。視覚的な左右の入れ替えは `flex-direction` で行う: 奇数行(1, 3番目)はそのまま(テキスト→画像)、偶数行(2, 4番目)は `.feature-row:nth-child(even) { flex-direction: row-reverse; }` で反転(画像→テキスト)。
- 画像側 `.feature-media` は `flex: 1 1 58%`、テキスト側 `.feature-text` は `flex: 1 1 40%` とし、画像を大きく見せている。
- 画像は `aspect-ratio: 16 / 9` の枠(WinLauncher本体のスクリーンショットが概ね16:9前後のため)に `object-fit: contain` で収め、UIの一部が切れないようにしている(クロップしたい場合は `cover` に変更を検討)。
- 幅720px以下では `flex-direction: column-reverse` に切り替え、画像を上・テキストを下に縦積みする1カラムレイアウトになる(交互配置は解除)。DOM順が「テキスト→画像」のため `column-reverse` で画像が先頭に来る。
- ライトボックス(画像クリック拡大)は現状未実装。

## ドキュメント

公式ドキュメント: https://docs.astro.build

関連タスクに着手する前に、以下のガイドを参照してください。

- [ページ、動的ルート、ミドルウェアの追加](https://docs.astro.build/en/guides/routing/)
- [Astroコンポーネントの利用](https://docs.astro.build/en/basics/astro-components/)
- [React、Vue、Svelteなど他フレームワークのコンポーネント利用](https://docs.astro.build/en/guides/framework-components/)
- [コンテンツの追加・管理](https://docs.astro.build/en/guides/content-collections/)
- [スタイルの追加・Tailwindの利用](https://docs.astro.build/en/guides/styling/)
- [多言語対応](https://docs.astro.build/en/guides/internationalization/)
