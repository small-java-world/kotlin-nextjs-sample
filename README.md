# Tsumiki Sample App

KotlinバックエンドとNext.jsフロントエンドのサンプルアプリケーションです。

## 技術スタック

### バックエンド
- **Kotlin** - プログラミング言語
- **Spring Boot** - Webフレームワーク
- **PostgreSQL** - データベース
- **Kotest** - テストフレームワーク

### フロントエンド
- **Next.js** - Reactフレームワーク
- **TypeScript** - プログラミング言語
- **Tailwind CSS** - CSSフレームワーク
- **Vitest** - テストフレームワーク

### インフラ
- **Docker Compose** - コンテナオーケストレーション
- **DevContainer** - 開発環境

## 起動方法

### Docker Composeを使用

```bash
# 全サービスを起動
docker-compose up -d

# ログを確認
docker-compose logs -f

# サービスを停止
docker-compose down
```

### DevContainerを使用

1. VS CodeでDevContainer拡張機能をインストール
2. プロジェクトを開く
3. `Ctrl+Shift+P` → `Dev Containers: Reopen in Container`

## アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## API エンドポイント

### ホームコンテンツ取得
```
GET /api/home/content
```

レスポンス例:
```json
{
  "title": "Tsumiki Sample App",
  "subtitle": "Kotlin + Next.js アプリケーション",
  "description": "Docker ComposeとDevContainerで起動できる、KotlinバックエンドとNext.jsフロントエンドのサンプルアプリケーションです。",
  "features": [
    {
      "id": "kotlin-backend",
      "title": "Kotlin Backend",
      "description": "Spring Boot + Kotlinで構築された高性能なバックエンドAPI",
      "icon": "⚡"
    }
  ],
  "generatedAt": "2024-01-01T00:00:00"
}
```

## 開発

### バックエンド開発

```bash
cd backend

# アプリケーション起動
./gradlew bootRun

# テスト実行
./gradlew test

# ビルド
./gradlew build
```

### フロントエンド開発

```bash
cd frontend

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# テスト実行
npm test

# ビルド
npm run build
```

## テスト

### バックエンドテスト (Kotest)
```bash
cd backend
./gradlew test
```

### フロントエンドテスト (Vitest)
```bash
cd frontend
npm test
```

## プロジェクト構造

```
tsumiki_sample/
├── backend/                 # Kotlinバックエンド
│   ├── src/
│   │   ├── main/kotlin/
│   │   │   └── com/tsumiki/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       └── dto/
│   │   └── test/kotlin/
│   ├── build.gradle.kts
│   └── Dockerfile
├── frontend/                # Next.jsフロントエンド
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── types/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Docker Compose設定
├── .devcontainer/           # DevContainer設定
└── README.md
```

## ライセンス

MIT License
