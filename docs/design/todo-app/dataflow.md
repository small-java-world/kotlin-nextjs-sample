# TODOアプリ データフロー図

## システム全体のデータフロー

```mermaid
flowchart TD
    User[👤 ユーザー] --> Browser[🌐 ブラウザ]
    Browser --> Frontend[⚛️ Next.js Frontend]
    Frontend -->|HTTPS/JSON| Backend[🚀 Spring Boot API]
    Backend -->|SQL| Database[(🗄️ PostgreSQL)]
    Backend -->|Cache| Redis[(📦 Redis Cache)]
    
    subgraph "Frontend Layer"
        Frontend --> Components[📱 React Components]
        Components --> Hooks[🎣 Custom Hooks]
        Hooks --> Context[🔄 React Context]
    end
    
    subgraph "Backend Layer"
        Backend --> Controller[🎯 Controller]
        Controller --> Service[⚙️ Service]
        Service --> Repository[🗃️ Repository]
        Repository --> Entity[📋 Entity]
    end
    
    subgraph "Security Layer"
        Frontend -.->|JWT Token| Auth[🔐 Authentication]
        Auth -.-> Backend
    end
```

## ユーザーインタラクションフロー

### 1. 認証フロー

```mermaid
sequenceDiagram
    participant U as 👤 ユーザー
    participant F as ⚛️ Frontend
    participant B as 🚀 Backend
    participant D as 🗄️ Database
    
    U->>F: ログイン情報入力
    F->>F: バリデーション
    F->>B: POST /auth/login
    B->>D: ユーザー認証
    D-->>B: ユーザー情報
    B->>B: JWT生成
    B-->>F: JWT + ユーザー情報
    F->>F: JWT保存 (localStorage)
    F-->>U: ダッシュボード表示
```

### 2. TODO CRUD フロー

```mermaid
sequenceDiagram
    participant U as 👤 ユーザー
    participant F as ⚛️ Frontend
    participant B as 🚀 Backend
    participant D as 🗄️ Database
    
    Note over F,B: 認証済み状態
    
    U->>F: TODO作成
    F->>F: 入力バリデーション
    F->>B: POST /todos (+ JWT)
    B->>B: JWT検証
    B->>B: データバリデーション
    B->>D: INSERT todo
    D-->>B: 作成されたTODO
    B-->>F: TODO + 201 Created
    F->>F: 状態更新
    F-->>U: UI更新
```

### 3. リアルタイム検索フロー

```mermaid
sequenceDiagram
    participant U as 👤 ユーザー
    participant F as ⚛️ Frontend
    participant B as 🚀 Backend
    participant D as 🗄️ Database
    participant C as 📦 Cache
    
    U->>F: 検索キーワード入力
    F->>F: デバウンス (300ms)
    F->>B: GET /todos/search?q=keyword
    B->>C: キャッシュ確認
    
    alt キャッシュヒット
        C-->>B: キャッシュ結果
        B-->>F: 検索結果
    else キャッシュミス
        B->>D: SELECT with LIKE
        D-->>B: 検索結果
        B->>C: 結果をキャッシュ
        B-->>F: 検索結果
    end
    
    F->>F: 結果表示
    F-->>U: フィルタリング済みリスト
```

## データ処理パターン

### 1. 楽観的更新パターン

```mermaid
flowchart TD
    A[ユーザーアクション] --> B[UI即座更新]
    B --> C[API呼び出し]
    C --> D{API成功?}
    
    D -->|成功| E[状態確定]
    D -->|失敗| F[UI巻き戻し]
    F --> G[エラー表示]
    
    E --> H[ユーザー体験向上]
    G --> I[適切なフィードバック]
```

### 2. エラーハンドリングフロー

```mermaid
flowchart TD
    A[API呼び出し] --> B{Response Status}
    
    B -->|200-299| C[成功処理]
    B -->|400| D[バリデーションエラー]
    B -->|401| E[認証エラー]
    B -->|403| F[認可エラー]
    B -->|404| G[リソース未発見]
    B -->|500| H[サーバーエラー]
    B -->|Network| I[ネットワークエラー]
    
    D --> J[フォームエラー表示]
    E --> K[ログイン画面へ]
    F --> L[権限不足メッセージ]
    G --> M[404ページ表示]
    H --> N[エラーページ表示]
    I --> O[リトライ機能提供]
```

## 状態管理フロー

### Frontend状態管理

```mermaid
flowchart TD
    A[ユーザーアクション] --> B[Action Dispatch]
    B --> C[Reducer]
    C --> D[State更新]
    D --> E[Component Re-render]
    
    subgraph "Global State"
        F[User State]
        G[Todos State]
        H[UI State]
    end
    
    C --> F
    C --> G
    C --> H
    
    subgraph "Local State"
        I[Form State]
        J[Modal State]
        K[Loading State]
    end
    
    E --> I
    E --> J
    E --> K
```

### Backend状態管理

```mermaid
flowchart TD
    A[HTTP Request] --> B[Controller]
    B --> C[Service Layer]
    C --> D[Repository Layer]
    D --> E[(Database)]
    
    subgraph "Transaction Boundary"
        C1[Business Logic]
        C2[Data Validation]
        C3[Authorization Check]
    end
    
    C --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D
    
    E --> F[Entity Mapping]
    F --> G[DTO Transformation]
    G --> H[JSON Response]
```

## パフォーマンス最適化フロー

### 1. キャッシュ戦略

```mermaid
flowchart TD
    A[Request] --> B{Cache Hit?}
    
    B -->|Yes| C[Return Cached Data]
    B -->|No| D[Database Query]
    
    D --> E[Store in Cache]
    E --> F[Return Data]
    
    subgraph "Cache Layers"
        G[Browser Cache]
        H[CDN Cache]
        I[Application Cache]
        J[Database Query Cache]
    end
    
    C --> G
    F --> H
    F --> I
    D --> J
```

### 2. ページネーション戦略

```mermaid
flowchart TD
    A[無限スクロール] --> B[Intersection Observer]
    B --> C{画面下部到達?}
    
    C -->|Yes| D[次ページAPI呼び出し]
    C -->|No| E[待機]
    
    D --> F[データ取得]
    F --> G[既存データと結合]
    G --> H[UI更新]
    
    H --> I[ローディング状態解除]
    I --> E
```

## セキュリティデータフロー

### JWT認証フロー

```mermaid
sequenceDiagram
    participant C as 👤 Client
    participant F as ⚛️ Frontend
    participant B as 🚀 Backend
    participant D as 🗄️ Database
    
    C->>F: Login Credentials
    F->>B: POST /auth/login
    B->>D: Verify User
    D-->>B: User Data
    B->>B: Generate JWT
    B-->>F: JWT Token
    F->>F: Store JWT (httpOnly)
    
    Note over F: For subsequent requests
    F->>B: API Request + JWT
    B->>B: Verify JWT
    B->>B: Extract User Info
    B->>D: Authorized Query
    D-->>B: User-specific Data
    B-->>F: Response
```