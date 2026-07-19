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

### 「主要機能」セクションのレイアウト(`Features.astro` / `FeatureGrid.tsx`)

4機能を2列×2行のカードグリッドで表示し、各カードのスクリーンショットはクリックでライトボックス(拡大モーダル)表示できる。

- `Features.astro` は静的なセクション見出し・データ配列(アイコン・タイトル・説明・画像パス)を組み立てるだけの薄いAstroコンポーネント。グリッド本体とライトボックスの状態管理(クリック開閉・Escキー・背景スクロールロック)はインタラクションが必要なため `FeatureGrid.tsx`(React, `client:load`)に実装している。スタイルは `FeatureGrid.css` に分離。
- グリッドは `grid-template-columns: repeat(2, 1fr)`(PC幅)。幅640px以下で `grid-template-columns: 1fr` の1カラムに切り替える。
- 各カードの画像は `aspect-ratio: 16 / 9` の枠(WinLauncher本体のスクリーンショットが概ね16:9前後のため)に `object-fit: contain` で収め、UIの一部が切れないようにしている(クロップしたい場合は `cover` に変更を検討)。画像は `<button>` でラップしてクリック可能にしている。
- ライトボックスは半透明オーバーレイ(`.lightbox-overlay`)+中央に原寸に近いサイズの画像(`.lightbox-image`、`max-width: 92vw` / `max-height: 88vh` で画面からはみ出さないよう制限)+右上の閉じるボタン(`.lightbox-close`)で構成。外部ライブラリは使わず、Reactの `useState` / `useEffect` のみで実装している。
- 閉じる手段は3通り: オーバーレイ部分のクリック、閉じるボタンのクリック、Escキー(`useEffect` 内で `keydown` を監視)。画像自体のクリックは `stopPropagation` でオーバーレイのクリック判定から除外している。
- モーダル表示中は `document.body.style.overflow = 'hidden'` で背景スクロールをロックし、閉じたとき/アンマウント時に元に戻す。

## ドキュメント

公式ドキュメント: https://docs.astro.build

関連タスクに着手する前に、以下のガイドを参照してください。

- [ページ、動的ルート、ミドルウェアの追加](https://docs.astro.build/en/guides/routing/)
- [Astroコンポーネントの利用](https://docs.astro.build/en/basics/astro-components/)
- [React、Vue、Svelteなど他フレームワークのコンポーネント利用](https://docs.astro.build/en/guides/framework-components/)
- [コンテンツの追加・管理](https://docs.astro.build/en/guides/content-collections/)
- [スタイルの追加・Tailwindの利用](https://docs.astro.build/en/guides/styling/)
- [多言語対応](https://docs.astro.build/en/guides/internationalization/)
