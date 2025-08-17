# Serena MCP 設定ガイド

## 📁 ファイル構成

```
📁 tsumiki_sample/
├── 📄 CLAUDE.md                    # 汎用Claude設定
├── 📄 SERENA_MCP_CONFIG.md         # Serena MCP設定
├── 📄 PROJECT_CONFIG.md            # プロジェクト固有設定
├── 📁 TEMPLATES/                   # 他プロジェクト用テンプレート
│   ├── 📄 rails_project_config.md
│   └── 📄 node_project_config.md
└── 📁 .claude/                     # Claude設定
    ├── 📄 settings.local.json
    └── 📁 hooks/
```

## 🔗 ファイルリンクの仕組み

### CLAUDE.md（汎用版）
- Serena MCP設定は `@SERENA_MCP_CONFIG.md` で参照
- プロジェクト固有の設定は `@PROJECT_CONFIG.md` で参照
- どのプロジェクトでも使える汎用的なポリシー

### SERENA_MCP_CONFIG.md（Serena MCP専用）
- Serena MCPの使用方法とポリシー
- シンボル指向ツールの推奨事項
- TDDワークフローとフォールバック手順

### PROJECT_CONFIG.md（プロジェクト固有）
- 現在のプロジェクト（Kotlin + Spring Boot）の設定
- テストコマンド、品質ゲート、Docker環境など

## 🚀 新しいプロジェクトでの使い方

### 1. 基本ファイルをコピー
```bash
cp CLAUDE.md /path/to/new-project/
cp SERENA_MCP_CONFIG.md /path/to/new-project/
```

### 2. プロジェクト設定ファイルを作成
```bash
# Railsプロジェクトの場合
cp TEMPLATES/rails_project_config.md PROJECT_CONFIG.md

# Node.jsプロジェクトの場合
cp TEMPLATES/node_project_config.md PROJECT_CONFIG.md

# または、手動でPROJECT_CONFIG.mdを作成
```

### 3. 設定をカスタマイズ
- `PROJECT_CONFIG.md` を編集してプロジェクト固有の設定を記述
- テストコマンド、品質ゲート、Docker環境などを更新

## 🎯 メリット

1. **汎用性**: CLAUDE.mdとSERENA_MCP_CONFIG.mdはどのプロジェクトでも使える
2. **保守性**: 各設定が専用ファイルで管理
3. **再利用性**: テンプレートから簡単に新しいプロジェクト設定を作成
4. **明確性**: ファイルリンクで設定の関係性が明確
5. **分離**: Serena MCP設定とプロジェクト設定が独立

## 📋 設定ファイルの役割

| ファイル | 役割 | 更新頻度 |
|---------|------|----------|
| `CLAUDE.md` | 汎用Claude設定 | 低（基本方針） |
| `SERENA_MCP_CONFIG.md` | Serena MCP設定 | 低（Serena方針） |
| `PROJECT_CONFIG.md` | プロジェクト固有設定 | 中（プロジェクト変更時） |
| `.claude/settings.local.json` | Claude設定 | 低（環境設定） |
| `TEMPLATES/*.md` | テンプレート | 低（新技術追加時） |

## 🔧 カスタマイズ例

### Railsプロジェクトの場合
```markdown
# CLAUDE.md内
@SERENA_MCP_CONFIG.md
@PROJECT_CONFIG.md

# PROJECT_CONFIG.md内
bin/rails test
bundle exec rspec
```

### Node.jsプロジェクトの場合
```markdown
# CLAUDE.md内
@SERENA_MCP_CONFIG.md
@PROJECT_CONFIG.md

# PROJECT_CONFIG.md内
npm test
npm run lint
```

**これで、設定が完全に分離され、より管理しやすくなりました！** 🎉
