# Claude Code × Serena MCP × LSP 運用ガイド（kotlin-nextjs-sample）

---

## ✅ TL;DR（最重要ポイントだけ）

* **Serena MCP は既定で STDIO**。**`docker compose up -d` の常駐対象にしない**（SSEで常駐させる場合のみ compose）。
* **Claude 側の `mcp-servers*.json` に `docker run -i … --transport stdio`** を書き、**Claude が必要時に起動**するのが正解。
* **LSP（TypeScript / Kotlin）は Serena コンテナに"同居"**させる（PATH/依存の事故を防ぎ、シンボリック編集を安定化）。
* **セッション開始時に必ず「Activate & Index」**（Serenaでプロジェクトを有効化→シンボル索引化）。
* **素朴な編集はブロック**（PreToolUse Hook）。**`mcp__serena__find_symbol / replace_in_symbol`**を**最優先**で使う。

---

## 1. アーキテクチャ俯瞰

* **AI実行体**：Claude Code（slashコマンド実行・MCPクライアント）
* **コード操作**：Serena MCP（シンボル探索・シンボル単位編集・shell実行）
* **解析エンジン**：Language Server（TypeScript / Kotlin を Serena と同一コンテナに同居）
* **開発環境**：Docker / Docker Compose / DevContainer

---

## 2. Serena の運用モード（超重要）

### A) STDIO（推奨）

* **やること**：Claude 側に起動定義を書く。**composeで常駐しない**。
* **`mcp-servers.json`（例）**

```json
{
  "mcpServers": {
    "serena": {
      "command": "docker",
      "args": [
        "run","--rm","-i",
        "--network","host",
        "-v","/ABS/PATH/projects:/workspaces/projects",
        "ghcr.io/oraios/serena:latest",
        "serena","start-mcp-server","--transport","stdio"
      ]
    }
  }
}
```

> Windows は `C:\\path\\to\\projects` のようにバックスラッシュをエスケープ。

### B) SSE（常駐させたい場合のみ）

* **やること**：Serena を SSE サーバとして常駐、Claude は URL 接続。
* **`docker-compose.yml` 抜粋**

```yaml
services:
  serena-mcp:
    image: ghcr.io/oraios/serena:latest
    command: ["uv","run","serena","start-mcp-server","--transport","sse","--port","9121","--host","0.0.0.0"]
    ports: ["9121:9121"]
    volumes:
      - ./:/workspaces/projects
    healthcheck:
      test: ["CMD","curl","-fsS","http://localhost:9121/health"]
      interval: 10s
      timeout: 3s
      retries: 10
```

> **注意**：STDIO と SSE を**混在させない**こと。README に運用モードを明記する。

---

## 3. LSP 同居（TypeScript / Kotlin）

**ねらい**：PATH・依存・バージョン差をなくし、Serena のシンボリック解析を安定化。

**`Dockerfile.serena-mcp` への典型追加（抜粋）**

```dockerfile
FROM ghcr.io/oraios/serena:latest

# Node / TS-LS（固定推奨）
RUN apt-get update && apt-get install -y curl ca-certificates \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && npm i -g typescript@~5.4.0 typescript-language-server@~4.3.0

# JDK 17 / Kotlin-LS（固定推奨）
RUN apt-get install -y openjdk-17-jdk wget \
 && wget -O /usr/local/bin/kotlin-language-server \
    https://github.com/fwcd/kotlin-language-server/releases/download/1.2.40/server \
 && chmod +x /usr/local/bin/kotlin-language-server
```

**動作確認（コンテナ内）**

```bash
node -v && npm -v && which typescript-language-server
java -version && which kotlin-language-server || echo "kotlin-ls optional"
```

---

## 4. チーム／生成AIに効く運用ポリシー

### 4.1 CLAUDE.md（推奨ひな形）

```md
# Serena MCP 優先ポリシー

## 前提
- /mcp で Serena が接続可。
- セッション開始時に「このリポジトリをSerenaでアクティベートして、シンボルをインデックス化してから作業して」。

## 方針
- 解析・編集は Serena の**シンボル指向ツールを最優先**。
  - find:  mcp__serena__find_symbol / mcp__serena__find_references
  - edit:  mcp__serena__replace_in_symbol / mcp__serena__insert_after_symbol
- 素朴な全文置換や手動編集は**最終手段**。

## TDDループ
1) Serenaで対象シンボル特定 → 2) シンボル限定編集 → 3) テスト/型/リンタ → 4) リファクタ
```

### 4.2 Hooks（tdd-red.md を触らずに Serena 優先を強制）

**`.claude/settings.json`（抜粋）**

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
      { "hooks": [ { "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/serena_prime.sh" } ] }
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

**`.claude/hooks/serena_guard.sh`（例）**

```bash
#!/usr/bin/env bash
DATA="$(cat)"
TOOL="$(printf '%s' "$DATA" | sed -n 's/.*\"tool_name\":\"\([^\"]*\)\".*/\1/p')"
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

## 5. README への必須但し書き（最小差分）

**`README.md` の「Docker Composeを使用」直下に追記**

```diff
 ### Docker Composeを使用

   # 全サービスを起動
   docker-compose up -d

   # ログを確認
   docker-compose logs -f

   # サービスを停止
   docker-compose down

+ > ℹ️ **Serena MCP の運用モード**
+ > - **STDIO（推奨）**: Serena は **compose の常駐対象にしません**。  
+ >   Claude 側の `mcp-servers*.json` に `docker run -i ... --transport stdio` を記載し、
+ >   **Claude が必要時に起動**します。
+ > - **常駐したい場合**: Serena を **SSE**（`--transport sse --port 9121`）で起動し、
+ >   Claude は **SSE の URL 接続**に切り替えます。
```

---

## 6. 開発者のクイックチェック（毎回これだけ）

1. `claude mcp list` に `serena` が表示（STDIOならここで起動）。
2. セッション開始：「Serenaでこのリポジトリをアクティベートしてインデックス化」。
3. 任意関数で **`find_symbol → replace_in_symbol`**（シンボル限定で差分が出ること）。
4. 素朴な **`Edit/Write/Grep` はブロック**され、Serenaツール利用に誘導。
5. テスト：`npm test`／`./gradlew test`（+ TS は `tsc --noEmit`、ESLint）。

---

## 7. CI（最小ワークフローの例）

```yaml
name: ci
on: [push, pull_request]
jobs:
  check-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: LSP presence (container-style)
        run: |
          which node || true
          which typescript-language-server || echo "ts-ls missing"; true
          java -version || true
          which kotlin-language-server || echo "kotlin-ls missing"; true
      - name: Frontend tests
        working-directory: frontend
        run: |
          npm ci
          npm run typecheck
          npm test -- --run
      - name: Backend tests
        working-directory: backend
        run: ./gradlew --no-daemon test
```

---

## 8. よくあるつまずきと対処

* **compose で STDIO の Serena を `up -d` → 即終了**：正常。STDIO は**クライアント起動**が前提。常駐したければ **SSE** に切替。
* **ツールが見えない／解析が弱い**：LSP を**同居**させる。`node`/`ts-ls`/`java`/`kotlin-ls` 有無を `which` で確認。
* **シンボルが見つからない**：**Activate & Index** を明示してから再試行。
* **Windows パス問題**：`-v C:\\path\\to\\projects:/workspaces/projects` のように書く。

---

## 9. サンプル・勝ちパターン

* **安全リネーム**：`find_references` → `replace_in_symbol` → `tsc --noEmit`/`./gradlew test`。
* **DTO→フロント伝播**：バックで置換→型生成/定義更新→フロント `find_references`→最小差分→ビルド/テスト。
* **安全挿入**：`insert_after_symbol`（before でも可）でガード付きロジック→即テスト→リファクタ。

---

## 10. 付記（バージョン固定とセキュリティ）

* **バージョン固定**：`Dockerfile.serena-mcp` に Node/TS-LS、JDK/Kotlin-LS の **minor 固定**を推奨。
* **セキュリティ**：`env.example` に秘密情報を置かない旨を README に明記。Dependabot を有効化。

---

以上。README への但し書き（§5）を入れておけば、初見でも迷わず**「STDIO＝Claudeが起動／SSE＝compose常駐」**の流儀で運用できます。
