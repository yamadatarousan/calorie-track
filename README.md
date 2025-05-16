This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Calorie Track

食事と運動のカロリーを記録・管理する Web アプリ。月間グラフで摂取/消費カロリーを可視化し、CRUD 機能でデータ管理。

## 技術スタック

### フロントエンド
- **Next.js** (15.3.2): React ベース、App Router、Server Components。
- **React** (18.x): クライアントコンポーネント、フォーム、状態管理。
- **TypeScript** (5.x): 型安全なコード、Zod 統合。
- **Tailwind CSS** (3.x): レスポンシブ UI、ナビバー、フォーム、テーブル。
- **Chart.js** (4.x) + **react-chartjs-2** (5.x): ダッシュボードの線グラフ。

### バックエンド
- **Next.js API Routes**: REST API でデータ処理（`/api/records`, `/api/exercises`）。
- **Prisma** (6.8.1): MySQL ORM、データ操作、マイグレーション。
- **MySQL** (8.x): データベース（`calorie_track`）、食事/運動/ユーザー管理。

### バリデーション
- **Zod** (3.x): フォームと API の入力バリデーション、型安全、日本語エラーメッセージ。

### ログ
- **Pino** (9.x): サーバー側 JSON ログ（ターミナル出力）。
- **next-logger** (0.x): Next.js ログ統合（ファイル出力は保留）。
- **pino-pretty** (11.x): 開発時のカラー付きターミナルログ。

### 開発ツール
- **Node.js** (20.x): ランタイム。
- **npm** (10.x): パッケージ管理。
- **ESLint** / **Prettier**: コードリント、フォーマット。
- **MySQL Workbench**: DB 管理。

### データモデル
- **Prisma Schema**:
  - `User`: ユーザー情報。
  - `Record`: 食事記録（食事名、カロリー、日時）。
  - `Exercise`: 運動記録（運動名、カロリー、日時）。