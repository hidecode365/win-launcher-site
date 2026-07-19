# WinLauncher紹介サイト

[WinLauncher](https://github.com/hidecode365/win-launcher) の紹介サイトです。Astro + Reactで構築し、GitHub Pagesで公開しています。

## 開発コマンド

```sh
npm install      # 依存関係のインストール
npm run dev      # 開発サーバーの起動(localhost:4321)
npm run build    # 本番用ビルド(./dist/ に出力)
```

## デプロイ

`main` ブランチへのpushをトリガーに、GitHub Actions (`.github/workflows/deploy.yml`) が自動でビルド・GitHub Pagesへのデプロイを行います。

## License

MIT
