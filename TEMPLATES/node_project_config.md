# Node.js Project Configuration Template

## 🧩 プロジェクト構成

- **Backend**: Node.js + Express/Fastify
- **Frontend**: TypeScript + React/Vue（オプション）
- **AI支援**: Serena MCP + Language Server
- **開発環境**: Docker / Docker Compose

## 🧪 テスト実行コマンド

### Node.js Backend
```bash
npm test                         # テスト実行
npm run test:watch              # ウォッチモード
npm run lint                    # Lint
npm run type-check              # 型チェック
```

### Frontend (TypeScript/React)
```bash
npm test                        # テスト実行
npx tsc -p tsconfig.json --noEmit  # 型チェック
npx eslint . --ext .ts,.tsx --fix  # Lint
```

## 🔧 品質ゲート

### Node.js
- `npm test`
- `npm run lint`
- `npm run type-check`

### TypeScript/React
- `npx tsc -p tsconfig.json --noEmit`
- `npx eslint . --ext .ts,.tsx --fix`

## 🐳 Docker環境

```bash
# Backendテスト
docker compose exec backend npm test

# Frontendテスト
docker compose exec frontend npm test
```

## 📁 主要ファイル

- `package.json` - npm設定
- `tsconfig.json` - TypeScript設定
- `docker-compose.yml` - 開発環境
- `CLAUDE.md` - AI支援ポリシー
