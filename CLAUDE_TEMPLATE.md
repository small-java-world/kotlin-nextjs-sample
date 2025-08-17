# Serena MCP 優先ポリシー（最小テンプレート）

## ✅ 前提チェックリスト

- [ ] Serena MCP が接続済み（/mcp で `serena` が見える）
- [ ] プロジェクトをSerenaで有効化済み（`/mcp__serena__activate_project` または同等）

## 🎯 基本方針

**Serena MCP のシンボル指向ツールを最優先**、**素朴な全文編集は避ける**

## 🔧 推奨ツール（例示名）

### 検索・ナビゲーション
- `mcp__serena__find_symbol` / `find_definition`
- `mcp__serena__find_references`
- `mcp__serena__analyze_code`

### 編集（シンボル安全）
- `mcp__serena__replace_in_symbol`
- `mcp__serena__insert_after_symbol` / `insert_before_symbol`

### 補助
- `mcp__serena__execute_shell_command`

## 🚫 避けるべき操作

- 素朴な `Edit` / `Write` / `MultiEdit` / `Grep`
- 手動ファイル直接編集（必要時は理由を述べ、最小限に限定）

## 🧪 テスト実行 & 品質ゲート

### TypeScript/Next.js
```bash
npm test | pnpm test | yarn test
npx tsc -p tsconfig.json --noEmit
npx eslint . --ext .ts,.tsx --fix
```

### Rails（推奨）
```bash
bin/rails test | bundle exec rspec
bundle exec rubocop -A
bundle exec brakeman -q  # 必要に応じて
```

### Kotlin/Spring（オプション）
```bash
./gradlew test
```

## 🔄 TDDワークフロー

1. **Serenaで分析**：シンボル特定
2. **Serenaで編集**：シンボル単位で追加・置換
3. **品質ゲート**：型チェック・Lint・テスト
4. **リファクタ**：再びSerenaのナビゲーション→編集
5. **コミット**：最小差分でこまめに

## 🛟 フォールバック手順

1. **近接限定編集**：Serenaの範囲APIで再試行
2. **検索条件見直し**：クエリを変える
3. **限定的全文置換**：影響範囲を明示
4. **最後の手段**：手動編集（理由と影響範囲を記録）

---

*このポリシーは `/tdd-red` を含む全コマンドの再現性・品質を底上げします。*
