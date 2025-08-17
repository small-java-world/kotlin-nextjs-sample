# 生成AI対応ガイド

**Claude Code × Serena MCP × LSP × Docker**

## 0) 結論（運用の選び方）

* **STDIO運用（推奨）**：`docker compose up -d` で常駐させない。
  **Claude 側の `mcp-servers*.json` から `docker run -i` で起動**させる。
* **SSE運用（常駐したい場合）**：Serenaを **SSEモード**でコンテナ常駐 → Claude は **URL接続**。

---

## 1) STDIO方式（推奨）設定

### 1-1. Claude 側設定（`mcp-servers.json` 例）

```json
{
  "mcpServers": {
    "serena": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "--network", "host",
        "-v", "D:\\tsumiki_sample:/workspaces/projects",
        "tsumiki_sample-serena-mcp",
        "python", "serena-mcp-server.py"
      ]
    }
  }
}
```

* Windows はパスを `C:\\path\\to\\projects` のように記述（バックスラッシュをエスケープ）。
* **LSP（TypeScript/Kotlin）はこのイメージ内にインストール**しておく（同居）。Serena が必要時に利用。

### 1-2. LSP 同居（Serenaコンテナ内に入れる）例

```Dockerfile
# Dockerfile.serena-mcp (例: Serenaベースに LSP を同居)
FROM python:3.11-slim

# Node/TS LSP
RUN apt-get update && apt-get install -y curl ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm i -g typescript typescript-language-server

# JDK + Kotlin LSP
RUN apt-get install -y openjdk-21-jdk && \
    curl -L -o /usr/local/bin/kotlin-language-server \
      https://github.com/fwcd/kotlin-language-server/releases/latest/download/server && \
    chmod +x /usr/local/bin/kotlin-language-server

# STDIO運用はエントリポイント不要（Claudeが docker run -i で起動する）
```

> **ポイント**：STDIOは「**クライアントが起動**する」前提。`compose up -d` では即終了するのが正常挙動。

---

## 2) SSE方式（常駐サービス化したい場合）

### 2-1. docker-compose 例

```yaml
services:
  serena-mcp:
    image: tsumiki_sample-serena-mcp
    command: ["python", "serena-mcp-server.py", "--transport", "sse", "--port", "9121", "--host", "0.0.0.0"]
    ports: ["9121:9121"]
    volumes:
      - ./:/workspaces/projects
    profiles: ["mcp"]
```

### 2-2. Claude 側（SSE URL接続）

* Claude の MCP設定で **SSEのURL**（例：`http://localhost:9121/sse`）を指定。
* ヘルス確認は `curl http://localhost:9121/health` 等（実装により異なる場合あり）。

> **注意**：SSEにする場合も **LSPバイナリはこのコンテナに同居**させておくと安定。

---

## 3) プロジェクトに置く運用ポリシー（CLAUDE.md 例）

```md
# Serena MCP 優先ポリシー

## 前提
- /mcp で Serena が接続可であること。
- 開始時に「このリポジトリをSerenaでアクティベートして、シンボルをインデックス化してから作業して」。

## 方針
- コード解析・編集は Serena の **シンボル指向ツール**を最優先:
  - find:  mcp__serena__find_symbol / find_references
  - edit:  mcp__serena__replace_in_symbol / insert_after_symbol
- 素朴な全文置換・手動編集は最終手段。

## TDDループ
1) Serenaで対象のシンボル特定 → 2) シンボル限定編集 → 3) テスト & 型/リンタ → 4) リファクタ

## テスト
- TS: `npm test` / `pnpm test` / `yarn test`, `npx tsc --noEmit`, `npx eslint . --fix`
- Kotlin: `./gradlew test`
```

---

## 4) Claude hooks（tdd-red.mdに触れずにSerena優先化）

**.claude/settings.json 抜粋**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit|Grep",
        "hooks": [
          { "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/serena_guard.sh" }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/serena_prime.sh" }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(npm test.*|pnpm test.*|yarn test.*)",
      "Bash(./gradlew test.*)",
      "mcp__*"
    ]
  }
}
```

**.claude/hooks/serena_guard.sh（例）**

```bash
#!/usr/bin/env bash
DATA="$(cat)"; TOOL="$(printf '%s' "$DATA" | sed -n 's/.*\"tool_name\":\"\([^\"]*\)\".*/\1/p')"
[[ "$TOOL" =~ ^mcp__serena__ ]] && exit 0
[[ "$TOOL" =~ ^(Read|Glob)$ ]] && exit 0
cat 1>&2 <<'ERR'
Prefer Serena's symbol-aware tools:
- find:  mcp__serena__find_symbol / find_references
- edit:  mcp__serena__replace_in_symbol / insert_after_symbol
ERR
exit 2
```

---

## 5) 動作チェック（5項目）

1. **LSPバイナリ**：
   `node -v && npm -v && which typescript-language-server`
   `java -version && which kotlin-language-server || echo "kotlin-ls optional"`
2. **MCP接続**：`claude mcp list` に `serena` が enabled。
3. **アクティベート**：開始時に「Serenaでこのリポジトリをアクティベートしてインデックス化」。
4. **シンボル編集**：`find_symbol → replace_in_symbol` が通る。
5. **ガード発火**：素朴な `Edit/Write/Grep` を指示 → **ブロックされる** → Serenaツールで再実行して通る。

---

## 6) トラブルシュート（超要約）

* **STDIOで `compose up -d` すると即終了**：正常。STDIOは**Claudeが起動**する。SSEに切替えるか、`mcp-servers.json` に `docker run -i` を書く。
* **"ツールが見つからない"**：LSPを**Serenaイメージ内に同居**させる（PATHずれ防止）。
* **"シンボルが見つからない"**：**アクティベート &インデックス**を明示してから再試行。
* **Windowsでパス問題**：`-v C:\\path\\to\\projects:/workspaces/projects` のように書く。

---

これをREADMEや `CLAUDE.md` に貼れば、**AI（Claude Code）にも人間メンバーにも意図が明確に伝わり、再現性の高い運用**になります。
