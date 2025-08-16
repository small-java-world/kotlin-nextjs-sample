-- ==================================================
-- TODOアプリ データベーススキーマ
-- PostgreSQL 15+
-- ==================================================

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================================================
-- ENUM型の定義
-- ==================================================

-- 優先度レベル
CREATE TYPE priority_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- ==================================================
-- ユーザーテーブル
-- ==================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 制約
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_name_check CHECK (length(trim(name)) >= 1)
);

-- ユーザーテーブルのインデックス
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ==================================================
-- カテゴリテーブル
-- ==================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL, -- HEXカラーコード (#RRGGBB)
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 制約
    CONSTRAINT categories_name_check CHECK (length(trim(name)) >= 1),
    CONSTRAINT categories_color_check CHECK (color ~* '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT categories_unique_name_per_user UNIQUE(user_id, name)
);

-- カテゴリテーブルのインデックス
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_name ON categories(name);

-- ==================================================
-- タグテーブル
-- ==================================================

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL, -- HEXカラーコード (#RRGGBB)
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 制約
    CONSTRAINT tags_name_check CHECK (length(trim(name)) >= 1),
    CONSTRAINT tags_color_check CHECK (color ~* '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT tags_unique_name_per_user UNIQUE(user_id, name)
);

-- タグテーブルのインデックス
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_name ON tags(name);

-- ==================================================
-- TODOテーブル
-- ==================================================

CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(1000) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority priority_level NOT NULL DEFAULT 'MEDIUM',
    due_date TIMESTAMP WITH TIME ZONE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- 制約
    CONSTRAINT todos_title_check CHECK (length(trim(title)) >= 1),
    CONSTRAINT todos_completed_at_check CHECK (
        (completed = TRUE AND completed_at IS NOT NULL) OR 
        (completed = FALSE AND completed_at IS NULL)
    )
);

-- TODOテーブルのインデックス
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_due_date ON todos(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_todos_category_id ON todos(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX idx_todos_created_at ON todos(created_at);
CREATE INDEX idx_todos_updated_at ON todos(updated_at);

-- 全文検索用インデックス
CREATE INDEX idx_todos_title_search ON todos USING gin(to_tsvector('english', title));
CREATE INDEX idx_todos_description_search ON todos USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;

-- 複合インデックス (よく使われるクエリパターン用)
CREATE INDEX idx_todos_user_completed_created ON todos(user_id, completed, created_at DESC);
CREATE INDEX idx_todos_user_priority_due ON todos(user_id, priority, due_date) WHERE due_date IS NOT NULL;

-- ==================================================
-- TODOタグ関連テーブル (多対多)
-- ==================================================

CREATE TABLE todo_tags (
    todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (todo_id, tag_id)
);

-- TODOタグ関連テーブルのインデックス
CREATE INDEX idx_todo_tags_todo_id ON todo_tags(todo_id);
CREATE INDEX idx_todo_tags_tag_id ON todo_tags(tag_id);

-- ==================================================
-- リフレッシュトークンテーブル
-- ==================================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 制約
    CONSTRAINT refresh_tokens_expires_at_check CHECK (expires_at > created_at)
);

-- リフレッシュトークンテーブルのインデックス
CREATE UNIQUE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ==================================================
-- トリガー関数 - updated_at自動更新
-- ==================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーの作成
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- トリガー関数 - completed_at自動設定
-- ==================================================

CREATE OR REPLACE FUNCTION update_completed_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- 未完了から完了に変更された場合
    IF OLD.completed = FALSE AND NEW.completed = TRUE THEN
        NEW.completed_at = CURRENT_TIMESTAMP;
    -- 完了から未完了に変更された場合
    ELSIF OLD.completed = TRUE AND NEW.completed = FALSE THEN
        NEW.completed_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_completed_at BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_completed_at_column();

-- ==================================================
-- ビュー - TODO結合情報
-- ==================================================

CREATE VIEW todo_details AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.completed,
    t.priority,
    t.due_date,
    t.user_id,
    t.created_at,
    t.updated_at,
    t.completed_at,
    c.id as category_id,
    c.name as category_name,
    c.color as category_color,
    -- 期限ステータス
    CASE 
        WHEN t.due_date IS NULL THEN 'no_due_date'
        WHEN t.completed = TRUE THEN 'completed'
        WHEN t.due_date < CURRENT_TIMESTAMP THEN 'overdue'
        WHEN t.due_date < CURRENT_TIMESTAMP + INTERVAL '1 day' THEN 'due_soon'
        ELSE 'on_track'
    END as due_status,
    -- タグ情報 (JSON集約)
    COALESCE(
        json_agg(
            json_build_object(
                'id', tag.id,
                'name', tag.name,
                'color', tag.color
            )
        ) FILTER (WHERE tag.id IS NOT NULL),
        '[]'
    ) as tags
FROM todos t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN todo_tags tt ON t.id = tt.todo_id
LEFT JOIN tags tag ON tt.tag_id = tag.id
GROUP BY 
    t.id, t.title, t.description, t.completed, t.priority, 
    t.due_date, t.user_id, t.created_at, t.updated_at, t.completed_at,
    c.id, c.name, c.color;

-- ==================================================
-- パフォーマンス最適化関数
-- ==================================================

-- ユーザー統計情報取得関数
CREATE OR REPLACE FUNCTION get_user_todo_stats(p_user_id UUID)
RETURNS TABLE (
    total_count BIGINT,
    completed_count BIGINT,
    pending_count BIGINT,
    overdue_count BIGINT,
    completion_rate NUMERIC,
    high_priority_count BIGINT,
    medium_priority_count BIGINT,
    low_priority_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE completed = TRUE) as completed_count,
        COUNT(*) FILTER (WHERE completed = FALSE) as pending_count,
        COUNT(*) FILTER (WHERE completed = FALSE AND due_date < CURRENT_TIMESTAMP) as overdue_count,
        ROUND(
            (COUNT(*) FILTER (WHERE completed = TRUE))::NUMERIC / 
            NULLIF(COUNT(*), 0) * 100, 2
        ) as completion_rate,
        COUNT(*) FILTER (WHERE priority = 'HIGH') as high_priority_count,
        COUNT(*) FILTER (WHERE priority = 'MEDIUM') as medium_priority_count,
        COUNT(*) FILTER (WHERE priority = 'LOW') as low_priority_count
    FROM todos 
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ==================================================
-- データクリーンアップ関数
-- ==================================================

-- 期限切れリフレッシュトークン削除
CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM refresh_tokens 
    WHERE expires_at < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ==================================================
-- 初期データ投入 (デフォルトカテゴリ)
-- ==================================================

-- サンプルユーザー (開発環境用)
INSERT INTO users (id, email, name, password_hash) 
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'demo@example.com',
    'Demo User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' -- password: "password"
) ON CONFLICT (email) DO NOTHING;

-- デフォルトカテゴリ
INSERT INTO categories (name, color, user_id) 
VALUES 
    ('Work', '#3B82F6', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('Personal', '#10B981', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('Shopping', '#F59E0B', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ON CONFLICT (user_id, name) DO NOTHING;

-- デフォルトタグ
INSERT INTO tags (name, color, user_id) 
VALUES 
    ('Urgent', '#EF4444', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('Important', '#F97316', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('Meeting', '#8B5CF6', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ON CONFLICT (user_id, name) DO NOTHING;

-- ==================================================
-- インデックスのパフォーマンス調整
-- ==================================================

-- 統計情報更新 (パフォーマンス向上用)
ANALYZE users;
ANALYZE categories;
ANALYZE tags;
ANALYZE todos;
ANALYZE todo_tags;
ANALYZE refresh_tokens;

-- ==================================================
-- コメント - テーブル説明
-- ==================================================

COMMENT ON TABLE users IS 'ユーザー情報を管理するテーブル';
COMMENT ON TABLE categories IS 'TODOのカテゴリ情報を管理するテーブル';
COMMENT ON TABLE tags IS 'TODOに付与するタグ情報を管理するテーブル';
COMMENT ON TABLE todos IS 'TODOアイテムのメイン情報を管理するテーブル';
COMMENT ON TABLE todo_tags IS 'TODOとタグの多対多関連を管理するテーブル';
COMMENT ON TABLE refresh_tokens IS 'JWTリフレッシュトークンを管理するテーブル';
COMMENT ON VIEW todo_details IS 'TODOの詳細情報を取得するビュー (カテゴリ、タグ情報を含む)';
