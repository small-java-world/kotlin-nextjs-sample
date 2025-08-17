# Rails Project Configuration Template

## 🧩 プロジェクト構成

- **Frontend**: TypeScript + Next.js（オプション）
- **Backend**: Ruby on Rails
- **AI支援**: Serena MCP + Language Server
- **開発環境**: Docker / Docker Compose

## 🧪 テスト実行コマンド

### Rails Backend
```bash
bin/rails test                    # Rails標準テスト
bundle exec rspec                 # RSpec（導入時）
bundle exec rubocop -A           # Lint/静的解析
bundle exec brakeman -q          # セキュリティ（必要に応じて）
```

### Frontend (TypeScript/Next.js)
```bash
npm test                         # テスト実行
npx tsc -p tsconfig.json --noEmit  # 型チェック
npx eslint . --ext .ts,.tsx --fix  # Lint
```

## 🔧 品質ゲート

### Rails
- `bin/rails test` または `bundle exec rspec`
- `bundle exec rubocop -A`

### TypeScript/Next.js
- `npx tsc -p tsconfig.json --noEmit`
- `npx eslint . --ext .ts,.tsx --fix`

## 🐳 Docker環境

```bash
# Railsテスト
docker compose exec web bin/rails test

# Frontendテスト
docker compose exec frontend npm test
```

## 📁 主要ファイル

- `Gemfile` - Ruby依存関係
- `package.json` - npm設定（フロントエンド）
- `docker-compose.yml` - 開発環境
- `CLAUDE.md` - AI支援ポリシー
