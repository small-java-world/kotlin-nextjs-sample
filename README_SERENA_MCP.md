# Serena MCP 設定ガイド

## 🚀 運用モード

### **STDIO運用（推奨）**
- **設定**: `mcp-servers.json` に `docker run -i ... --transport stdio` を記述
- **起動**: Claude Codeが自動的に `docker run -i` で起動
- **注意**: `docker compose up -d` では起動しない（正常動作）
- **特徴**: SerenaはSTDIO＝Claudeが起動するため、composeで常駐させない

### **SSE運用（常駐サービス）**
- **設定**: `docker-compose.yml` で `--transport sse --port ...` を指定
- **起動**: `docker compose up -d` で常駐サービスとして起動
- **接続**: Claude側はURL接続（例：`http://localhost:9121/sse`）
- **特徴**: 常駐させたい場合はSSEに切替

---

## 📋 設定ファイル

このプロジェクトでは以下の設定ファイルを使用します：

- **Serena MCP設定**: @SERENA_MCP_CONFIG.md
- **プロジェクト固有設定**: @PROJECT_CONFIG.md

---

**プロジェクト固有の設定は以下を参照してください：**

@PROJECT_CONFIG.md

---

*この設定は汎用的なポリシーを提供し、プロジェクト固有の詳細は別ファイルで管理します。*
