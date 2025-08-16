# Serena MCP + Language Server セットアップ

## 概要

このプロジェクトには、AI駆動開発支援のためのSerena MCPサーバーと、TypeScript/JavaScript/Kotlin対応の言語サーバーが含まれています。

## 構成

### Serena MCP Server
- **ポート**: 8082
- **機能**: コード分析、テスト生成、リファクタリング提案、ドキュメント生成
- **対応言語**: TypeScript, JavaScript, Kotlin

### Language Server
- **ポート**: 8081
- **機能**: 補完、定義ジャンプ、参照検索、シンボル検索、ホバー情報、コードアクション、フォーマット、リネーム
- **対応言語**: TypeScript, JavaScript, Kotlin

## セットアップ

### 1. 環境変数の設定

```bash
# env.exampleをコピーして.envファイルを作成
cp env.example .env

# .envファイルを編集してAPIキーを設定
SERENA_API_KEY=your_actual_api_key_here
```

### 2. Dockerイメージのビルド

```bash
# MCPサーバーとアプリケーションを同時にビルド
docker-compose --profile mcp build

# または個別にビルド
docker-compose build serena-mcp
docker-compose build language-server
```

### 3. サーバーの起動

```bash
# MCPサーバーのみ起動
docker-compose --profile mcp up -d serena-mcp language-server

# 全サービスを起動（アプリケーション + MCPサーバー）
docker-compose --profile mcp up -d
```

## 使用方法

### Serena MCP Server

#### 利用可能なツール

1. **serena_analyze_code**
   - コードを分析して改善提案を生成
   - 分析タイプ: quality, performance, security, architecture

2. **serena_generate_test**
   - コードからテストケースを自動生成
   - テストフレームワーク: jest, pytest, junit, vitest

3. **serena_refactor_suggest**
   - リファクタリング提案を生成
   - リファクタリングタイプ: extract_method, rename, simplify, optimize

4. **serena_documentation_generate**
   - コードからドキュメントを自動生成
   - ドキュメントタイプ: api, readme, comments, architecture

#### 使用例

```bash
# コード分析
curl -X POST http://localhost:8082/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "backend/src/main/kotlin/com/tsumiki/controller/HomeController.kt",
    "analysis_type": "quality"
  }'

# テスト生成
curl -X POST http://localhost:8082/generate-test \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "frontend/src/components/FeatureCard.tsx",
    "test_framework": "jest"
  }'
```

### Language Server

#### 機能

- **補完**: コード入力時の自動補完
- **定義ジャンプ**: 関数やクラスの定義にジャンプ
- **参照検索**: シンボルの使用箇所を検索
- **シンボル検索**: ファイル内のシンボルを検索
- **ホバー情報**: マウスホバー時の情報表示
- **コードアクション**: クイックフィックスやリファクタリング
- **フォーマット**: コードの自動フォーマット
- **リネーム**: シンボルの一括リネーム

#### エディタでの設定

**VS Code**の場合:

```json
// settings.json
{
  "languageServer.port": 8081,
  "languageServer.host": "localhost"
}
```

**Neovim**の場合:

```lua
-- init.lua
require'lspconfig'.language_server.setup{
  cmd = {"docker", "run", "--rm", "-i", "-v", vim.fn.getcwd() .. ":/workspace", "language-server:latest"},
  root_dir = require'lspconfig'.util.root_pattern("package.json", "build.gradle.kts"),
}
```

## 開発

### ローカル開発

```bash
# Python環境でSerena MCPサーバーを起動
pip install -r requirements-serena.txt
python serena-mcp-server.py

# Node.js環境で言語サーバーを起動
npm install
node language-server.js
```

### ログの確認

```bash
# MCPサーバーのログ
docker-compose logs serena-mcp

# 言語サーバーのログ
docker-compose logs language-server

# リアルタイムログ
docker-compose logs -f serena-mcp language-server
```

## トラブルシューティング

### よくある問題

1. **ポートが使用中**
   ```bash
   # ポートの確認
   netstat -tulpn | grep :8081
   netstat -tulpn | grep :8082
   
   # プロセスの終了
   sudo kill -9 <PID>
   ```

2. **Dockerイメージのビルドエラー**
   ```bash
   # キャッシュをクリアして再ビルド
   docker-compose build --no-cache serena-mcp language-server
   ```

3. **環境変数が読み込まれない**
   ```bash
   # .envファイルの確認
   cat .env
   
   # 環境変数の確認
   docker-compose config
   ```

### デバッグ

```bash
# コンテナ内でデバッグ
docker-compose exec serena-mcp bash
docker-compose exec language-server sh

# ログレベルの変更
export LOG_LEVEL=DEBUG
```

## 設定ファイル

### mcp-servers.json
MCPサーバーの設定ファイル

### Dockerfile.serena-mcp
Serena MCPサーバー用のDockerfile

### Dockerfile.language-server
言語サーバー用のDockerfile

### requirements-serena.txt
Python依存関係

### package-language-server.json
Node.js依存関係

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。
