# Tsumiki Sample Project Configuration

## 🧩 プロジェクト構成

- **Frontend**: TypeScript + Next.js
- **Backend**: Kotlin + Spring Boot
- **AI支援**: Serena MCP + Language Server
- **開発環境**: Docker / Docker Compose

## 🧪 テスト実行コマンド

### Backend (Kotlin/Spring Boot)
```bash
./gradlew test                    # 全テスト実行
./gradlew test --tests "*HomeControllerTest*"  # 特定テスト
./gradlew build                   # ビルド確認
./gradlew flywayMigrate          # マイグレーション
```

### Frontend (TypeScript/Next.js)
```bash
npm test                         # テスト実行
npx tsc -p tsconfig.json --noEmit  # 型チェック
npx eslint . --ext .ts,.tsx --fix  # Lint
```

## 🔧 品質ゲート

### TypeScript/Next.js
- `npx tsc -p tsconfig.json --noEmit`
- `npx eslint . --ext .ts,.tsx --fix`

### Kotlin/Spring Boot
- `./gradlew test`
- `./gradlew build`

## 🐳 Docker環境

```bash
# Backendテスト
docker compose exec backend ./gradlew test

# Frontendテスト
docker compose exec frontend npm test
```

## 📁 主要ファイル

- `backend/build.gradle.kts` - Gradle設定
- `frontend/package.json` - npm設定
- `docker-compose.yml` - 開発環境
- `CLAUDE.md` - AI支援ポリシー
