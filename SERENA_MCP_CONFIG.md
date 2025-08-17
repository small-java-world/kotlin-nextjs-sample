# Serena MCP 設定（Kotlin/Spring Boot特化）

## ✅ 前提（毎セッション最初に自動&手動で満たすこと）

* Serena MCP が接続済みであること（/mcp で `serena` が見える）。
* **プロジェクトをSerenaで有効化**してから編集を開始すること。例：

  * `/mcp__serena__activate_project` または
  * 「このリポジトリをSerenaでアクティベートして、シンボルをインデックス化してから作業して」

---

## 🎯 基本方針

このプロジェクトでは、**Serena MCP のシンボル指向ツールを最優先**で使用し、**素朴な全文編集**は避けます。

**Kotlin/Spring Boot特化の利点：**
- Kotlin LSPとTypeScript LSPが同一コンテナに同居
- PATH/依存関係の事故を防止
- Serenaのシンボリック編集が安定化

---

## 🔧 推奨ツール（Kotlin/Spring Boot特化）

### コード検索・ナビゲーション

* `mcp__serena__find_symbol`（Kotlin/TypeScriptのシンボル検索）
* `mcp__serena__find_references`（Kotlin/TypeScriptの参照検索）
* `mcp__serena__analyze_code`（Kotlin/TypeScriptの解析）

### コード編集（シンボル安全）

* `mcp__serena__replace_in_symbol`（Kotlin/TypeScriptのシンボル置換）
* `mcp__serena__insert_after_symbol`（シンボル後の挿入）
* `mcp__serena__insert_before_symbol`（シンボル前の挿入）

### 補助（必要に応じて）

* `mcp__serena__execute_shell_command`（Gradle/npmコマンド実行）

> **注意**：Serenaツール名はビルドにより差がある場合があります。上記は**代表例**であり、名称が近いものを優先して用いてください。

---

## 🚫 避けるべき操作

* 素朴な `Edit` / `Write` / `MultiEdit` / `Grep`（全文・正規表現置換を含む）
* 手動でのファイル直接編集（必要時は理由を述べ、最小限に限定）

---

## 🔄 TDDワークフロー（Kotlin/Spring Boot特化）

1. **Serenaで分析**：該当箇所のシンボルを特定（`find_symbol` / `find_references`）
2. **Serenaで編集**：シンボル単位で追加・置換（`replace_in_symbol` / `insert_after_symbol`）
3. **品質ゲート**：プロジェクト固有のテスト・品質チェックを実行
   - **Backend**: `./gradlew test` / `./gradlew build`
   - **Frontend**: `npm test` / `npx tsc --noEmit`
4. **リファクタ**：再びSerenaのナビゲーション→編集。必要に応じてテスト更新
5. **コミット**：最小差分でこまめに（Conventional Commits推奨）

---

## 🛟 フォールバック手順（Serenaで解決できない場合）

1. **近接限定編集**：Serenaの範囲API（対象シンボル/ファイル）で再試行
2. **検索条件の見直し**：`find_symbol` と `find_references` のクエリを変える
3. **限定的な全文置換**：影響範囲を明示（対象ディレクトリ/拡張子/件数）し、レビュー前提
4. **最後の手段**：手動編集。理由と影響範囲、テスト計画をプロンプトに記録

---

## 🔐 権限と安全運用の目安

* Bashでのテスト実行は許可（プロジェクト固有のコマンド）
  - **Backend**: `./gradlew test`, `./gradlew build`
  - **Frontend**: `npm test`, `npx tsc --noEmit`
* 破壊的操作（大量置換・削除）は**事前に差分プランを説明**し、Serenaのシンボル編集で代替できないか再検討

---

## 🐳 Docker環境での最適化

**Serena MCPコンテナの利点：**
- Kotlin LSPとTypeScript LSPが同一コンテナに同居
- PATH競合や依存関係の問題を回避
- Serenaのシンボリック編集が安定化
- フロントエンド/バックエンド両方のLSPが利用可能

---

*このポリシーは `/tdd-red` を含む全コマンドの再現性・品質を底上げします（コマンド本体の改変は不要）。*
