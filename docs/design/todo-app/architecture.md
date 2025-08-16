# TODOアプリ アーキテクチャ設計

## システム概要

Tsumiki + Kotlin/Spring Boot + Next.js/TypeScriptによるモダンなTODOアプリケーション。ユーザーが効率的にタスクを管理し、生産性を向上させることを目的とした包括的なタスク管理システム。

## アーキテクチャパターン

- **パターン**: レイヤードアーキテクチャ + RESTful API
- **理由**: 
  - フロントエンドとバックエンドの明確な分離
  - 将来的なモバイルアプリなど他のクライアントへの対応が容易
  - チーム開発での並列作業が可能
  - 技術スタックの独立性確保

## システム構成図

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend       │────▶│   Database      │
│   (Next.js)     │     │   (Spring Boot) │     │   (PostgreSQL)  │
│   TypeScript    │     │   Kotlin        │     │                 │
│   Tailwind CSS  │     │   JPA/Hibernate │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## コンポーネント構成

### フロントエンド (Next.js + TypeScript)

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **状態管理**: React Context + useReducer
- **スタイリング**: Tailwind CSS
- **HTTPクライアント**: fetch API with custom hooks
- **テスト**: Vitest + React Testing Library
- **バリデーション**: Zod

#### ディレクトリ構造
```
src/
├── app/                    # Next.js App Router
├── components/             # 再利用可能コンポーネント
├── hooks/                  # カスタムフック
├── lib/                    # ユーティリティ関数
├── types/                  # TypeScript型定義
└── stores/                 # 状態管理
```

### バックエンド (Spring Boot + Kotlin)

- **フレームワーク**: Spring Boot 3.x
- **言語**: Kotlin
- **認証方式**: JWT (JSON Web Token)
- **ORM**: Spring Data JPA + Hibernate
- **バリデーション**: Bean Validation (JSR-303)
- **テスト**: Kotest + MockK
- **API文書**: OpenAPI 3.0 (Swagger)

#### レイヤー構成
```
Controller Layer    # REST API エンドポイント
    ↓
Service Layer       # ビジネスロジック
    ↓
Repository Layer    # データアクセス
    ↓
Entity Layer        # データモデル
```

### データベース (PostgreSQL)

- **DBMS**: PostgreSQL 15+
- **接続プール**: HikariCP
- **マイグレーション**: Flyway
- **キャッシュ**: Redis (オプション)

### インフラ・DevOps

- **コンテナ**: Docker + Docker Compose
- **開発環境**: DevContainer
- **CI/CD**: GitHub Actions
- **監視**: ヘルスチェックエンドポイント

## セキュリティ設計

### 認証・認可

- **認証方式**: JWT Bearer Token
- **トークン有効期限**: 24時間
- **リフレッシュトークン**: 7日間
- **パスワードハッシュ**: bcrypt

### セキュリティ対策

- **HTTPS通信の強制**
- **CORS設定の適切な実装**
- **入力値のサニタイゼーション**
- **SQLインジェクション対策** (JPA使用)
- **XSS対策** (エスケープ処理)
- **CSRF対策** (SameSite Cookie)

## パフォーマンス設計

### フロントエンド

- **コード分割**: Next.js dynamic imports
- **画像最適化**: Next.js Image component
- **キャッシュ戦略**: SWR pattern
- **仮想化**: 大量データ表示時のvirtual scrolling

### バックエンド

- **データベース接続プール**: HikariCP
- **クエリ最適化**: JPA N+1問題の回避
- **ページネーション**: Cursor-based pagination
- **インデックス戦略**: 検索クエリの最適化

### データベース

- **インデックス設計**: 検索・ソート列への適切なインデックス
- **クエリ最適化**: EXPLAIN ANALYZEによる実行計画の確認
- **パーティショニング**: 大量データ対応 (将来拡張)

## スケーラビリティ設計

### 水平スケーリング対応

- **ステートレス設計**: セッション情報をJWTで管理
- **データベース読み取り専用レプリカ**: 読み取り負荷分散
- **CDN対応**: 静的ファイルの配信最適化

### モニタリング

- **ヘルスチェック**: `/actuator/health`
- **メトリクス**: Micrometer + Prometheus (将来拡張)
- **ログ**: 構造化ログ (JSON format)

## 開発・デプロイフロー

### 開発環境

1. **DevContainer**: 統一された開発環境
2. **Hot Reload**: フロントエンド・バックエンド両方対応
3. **テスト自動実行**: ファイル変更時の自動テスト

### CI/CDパイプライン

```
┌─────────────┐   ┌──────────────┐   ┌─────────────┐   ┌─────────────┐
│   Commit    │──▶│  Unit Tests  │──▶│  Build      │──▶│   Deploy    │
│   to main   │   │  Integration │   │  Docker     │   │  Staging    │
│             │   │  Tests       │   │  Images     │   │             │
└─────────────┘   └──────────────┘   └─────────────┘   └─────────────┘
```

## 品質保証

### テスト戦略

- **単体テスト**: 80%以上のカバレッジ
- **統合テスト**: API エンドポイントの動作確認
- **E2Eテスト**: 主要ユーザーフローの自動テスト
- **パフォーマンステスト**: 負荷テスト

### コード品質

- **静的解析**: ESLint, ktlint
- **型安全性**: TypeScript strict mode, Kotlin null safety
- **コードレビュー**: Pull Request ベース
- **API仕様**: OpenAPI による仕様駆動開発