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

## 設定ファイル

このプロジェクトでは以下の設定ファイルを使用します：

- **Serena MCP設定**: @SERENA_MCP_CONFIG.md
- **プロジェクト固有設定**: @PROJECT_CONFIG.md

---

**プロジェクト固有の設定は以下を参照してください：**

@PROJECT_CONFIG.md

---

*この設定は汎用的なポリシーを提供し、プロジェクト固有の詳細は別ファイルで管理します。*
