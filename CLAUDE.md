## 開発

開発サーバーを起動する際は、バックグラウンドモードを使用してください。

```
astro dev --background
```

バックグラウンドサーバーは `astro dev stop`、`astro dev status`、`astro dev logs` で管理します。

## 運用上の注意

- カレントディレクトリが既にこのプロジェクトルート(`win-launcher-site`)になっているセッションでは、コマンドの先頭に `cd "D:/ai_work/dev_win/win-launcher-site" &&` を毎回付けないでください。カレントディレクトリが不明な場合のみ、確認してから実行してください。
- このリポジトリの `CLAUDE.md` は日本語で記載・更新する方針とします。

## ドキュメント

公式ドキュメント: https://docs.astro.build

関連タスクに着手する前に、以下のガイドを参照してください。

- [ページ、動的ルート、ミドルウェアの追加](https://docs.astro.build/en/guides/routing/)
- [Astroコンポーネントの利用](https://docs.astro.build/en/basics/astro-components/)
- [React、Vue、Svelteなど他フレームワークのコンポーネント利用](https://docs.astro.build/en/guides/framework-components/)
- [コンテンツの追加・管理](https://docs.astro.build/en/guides/content-collections/)
- [スタイルの追加・Tailwindの利用](https://docs.astro.build/en/guides/styling/)
- [多言語対応](https://docs.astro.build/en/guides/internationalization/)
