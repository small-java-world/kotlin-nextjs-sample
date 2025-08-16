// ==================================================
// TODOアプリ TypeScript型定義
// ==================================================

// ==================================================
// Core Entity Types
// ==================================================

/**
 * ユーザーエンティティ
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * カテゴリエンティティ
 */
export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * タグエンティティ
 */
export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TODOエンティティ
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  categoryId?: string;
  userId: string;
  tags: Tag[];
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// ==================================================
// Enum Types
// ==================================================

/**
 * 優先度レベル
 */
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

/**
 * ソート順序
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

/**
 * ソート項目
 */
export enum SortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DUE_DATE = 'dueDate',
  PRIORITY = 'priority',
  TITLE = 'title'
}

// ==================================================
// Request/Response Types
// ==================================================

/**
 * 汎用APIレスポンス
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

/**
 * ページネーションレスポンス
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}

// ==================================================
// Authentication Types
// ==================================================

/**
 * ログインリクエスト
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * ユーザー登録リクエスト
 */
export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

/**
 * 認証レスポンス
 */
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

/**
 * JWTペイロード
 */
export interface JwtPayload {
  sub: string; // user ID
  email: string;
  name: string;
  iat: number;
  exp: number;
}

// ==================================================
// TODO CRUD Types
// ==================================================

/**
 * TODO作成リクエスト
 */
export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // ISO string
  categoryId?: string;
  tagIds?: string[];
}

/**
 * TODO更新リクエスト
 */
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string; // ISO string
  categoryId?: string;
  tagIds?: string[];
}

/**
 * TODO検索パラメータ
 */
export interface TodoSearchParams {
  q?: string; // キーワード検索
  completed?: boolean;
  priority?: Priority;
  categoryId?: string;
  tagIds?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  sortField?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

/**
 * TODO一括操作リクエスト
 */
export interface BulkTodoRequest {
  todoIds: string[];
  action: 'complete' | 'incomplete' | 'delete';
}

// ==================================================
// Category & Tag Types
// ==================================================

/**
 * カテゴリ作成リクエスト
 */
export interface CreateCategoryRequest {
  name: string;
  color: string;
}

/**
 * カテゴリ更新リクエスト
 */
export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
}

/**
 * タグ作成リクエスト
 */
export interface CreateTagRequest {
  name: string;
  color: string;
}

/**
 * タグ更新リクエスト
 */
export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

// ==================================================
// Statistics & Analytics Types
// ==================================================

/**
 * 統計データ
 */
export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: {
    [Priority.HIGH]: number;
    [Priority.MEDIUM]: number;
    [Priority.LOW]: number;
  };
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  recentActivity: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

// ==================================================
// UI State Types
// ==================================================

/**
 * アプリケーション状態
 */
export interface AppState {
  user: UserState;
  todos: TodoState;
  ui: UiState;
}

/**
 * ユーザー状態
 */
export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * TODO状態
 */
export interface TodoState {
  todos: Todo[];
  categories: Category[];
  tags: Tag[];
  currentTodo: Todo | null;
  filters: TodoSearchParams;
  stats: TodoStats | null;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
}

/**
 * UI状態
 */
export interface UiState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  modals: {
    createTodo: boolean;
    editTodo: boolean;
    deleteTodo: boolean;
    createCategory: boolean;
    createTag: boolean;
  };
  toasts: Toast[];
}

/**
 * トースト通知
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// ==================================================
// Form Types
// ==================================================

/**
 * TODOフォームデータ
 */
export interface TodoFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  categoryId: string;
  tagIds: string[];
}

/**
 * フォームバリデーションエラー
 */
export interface FormErrors {
  [key: string]: string[];
}

/**
 * フォーム状態
 */
export interface FormState<T> {
  data: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// ==================================================
// Hook Types
// ==================================================

/**
 * APIフックの返却値
 */
export interface UseApiReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

/**
 * 無限スクロールフックの返却値
 */
export interface UseInfiniteScrollReturn<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => Promise<void>;
}

// ==================================================
// Utility Types
// ==================================================

/**
 * エンティティのIDのみを持つ型
 */
export type EntityId<T> = Pick<T, 'id'>;

/**
 * エンティティからタイムスタンプを除いた型
 */
export type WithoutTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>;

/**
 * 部分更新用の型
 */
export type PartialUpdate<T> = Partial<WithoutTimestamps<T>>;

/**
 * オプションフィールドを持つ型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ==================================================
// Event Types
// ==================================================

/**
 * TODOイベント
 */
export interface TodoEvent {
  type: 'TODO_CREATED' | 'TODO_UPDATED' | 'TODO_DELETED' | 'TODO_COMPLETED';
  payload: {
    todoId: string;
    userId: string;
    timestamp: Date;
    data?: Partial<Todo>;
  };
}

/**
 * ユーザーイベント
 */
export interface UserEvent {
  type: 'USER_LOGGED_IN' | 'USER_LOGGED_OUT' | 'USER_UPDATED';
  payload: {
    userId: string;
    timestamp: Date;
    data?: Partial<User>;
  };
}

// ==================================================
// Configuration Types
// ==================================================

/**
 * アプリ設定
 */
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
  };
  ui: {
    defaultTheme: 'light' | 'dark';
    pageSize: number;
    toastDuration: number;
  };
}

// ==================================================
// Export Default Types
// ==================================================

export type { Todo as DefaultTodo, User as DefaultUser };
