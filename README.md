# Tsumiki Sample Project

Kotlin + Spring Boot + Next.js + AI支援開発環境

## 🚀 クイックスタート

### 1. 環境準備
```bash
# リポジトリをクローン
git clone <repository-url>
cd tsumiki_sample

# 環境変数を設定
cp env.example .env
# .envファイルを編集してAPIキーを設定
```

**⚠️ 注意**: `env.example` はテンプレートファイルです。秘密情報（APIキー等）は `.env` ファイルに設定し、Gitにコミットしないでください。

### 2. アプリケーション起動
```bash
# バックエンド・フロントエンド・データベースを起動
docker compose up -d

# アプリケーションにアクセス
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

> ℹ️ **Serena MCP の運用モード**
> - **STDIO（推奨）**: Serena は **compose の常駐対象にしません**。  
>   Claude 側の `mcp-servers*.json` に  
>   `docker run -i ... --transport stdio` を記述し、**Claude が必要時に起動**します。
> - **常駐させたい場合**: Serena を **SSE**（`--transport sse --port 9121`）で起動し、  
>   Claude は **SSEのURL接続**に切り替えます。

**📝 注意**: `docker compose up -d` では **Serena(STDIO)は起動しません**。SerenaはClaude Codeが自動起動します。

### 3. AI支援開発環境（STDIO運用）
```bash
# Claude Codeでmcp-servers.jsonを使用して起動
claude --mcp-config mcp-servers.json

# プロジェクトをSerenaでアクティベート
# 「このリポジトリをSerenaでアクティベートして、シンボルをインデックス化してから作業して」
```

**🚀 Serena運用**: STDIO運用では `docker compose up -d` でSerenaを起動しません（Claude Codeが自動起動）。常駐させたい場合はSSE運用に切替してください。

## 🧩 技術スタック

- **Frontend**: TypeScript + Next.js
- **Backend**: Kotlin + Spring Boot
- **Database**: PostgreSQL
- **AI支援**: Serena MCP + Language Server
- **開発環境**: Docker / Docker Compose

## 📁 プロジェクト構成

```
tsumiki_sample/
├── backend/                 # Kotlin + Spring Boot
├── frontend/                # TypeScript + Next.js
├── docker-compose.yml       # 開発環境
├── mcp-servers.json         # AI支援設定（STDIO運用）
├── .claude/                 # Claude Code設定
├── README_AI_GUIDE.md       # AI支援ガイド
└── README_SERENA_MCP.md     # Serena MCP設定
```

## 🔧 開発コマンド

### Backend (Kotlin/Spring Boot)
```bash
# テスト実行
./gradlew test

# ビルド
./gradlew build

# マイグレーション
./gradlew flywayMigrate
```

### Frontend (TypeScript/Next.js)
```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# テスト実行
npm test

# ビルド
npm run build
```

## 🧪 テスト

```bash
# バックエンドテスト
docker compose exec backend ./gradlew test

# フロントエンドテスト
docker compose exec frontend npm test
```

## 📚 ドキュメント

- [AI支援開発ガイド](README_AI_GUIDE.md)
- [Serena MCP設定](README_SERENA_MCP.md)
- [プロジェクト設定](PROJECT_CONFIG.md)

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。

## 📄 ライセンス

MIT License
