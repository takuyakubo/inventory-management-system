# 在庫管理システム 技術アーキテクチャ設計書

## 1. システムアーキテクチャ概要

### 1.1 全体構成
在庫管理システムは以下の3層アーキテクチャで構成されます：

1. **プレゼンテーション層** (フロントエンド)
   - Next.js (App Router) を使用したモダンなWebアプリケーション
   - レスポンシブデザインによる多デバイス対応

2. **アプリケーション層** (バックエンド)
   - Python FastAPIを使用したRESTful API
   - ビジネスロジックの実装
   - 認証・認可の処理

3. **データ層**
   - PostgreSQLデータベース
   - SQLAlchemy ORMによるデータアクセス

![システムアーキテクチャ図](./images/system_architecture.png)

### 1.2 技術スタック詳細

#### フロントエンド
- **フレームワーク**: Next.js 14.0以上 (App Router)
- **言語**: TypeScript 5.0以上
- **UIライブラリ**: React 18.0以上
- **スタイリング**: Tailwind CSS
- **状態管理**: 
  - React Query (データフェッチング)
  - Zustand (グローバル状態管理)
- **フォーム管理**: React Hook Form
- **バリデーション**: Zod
- **グラフ・チャート**: Chart.js / D3.js
- **テスト**: Jest, React Testing Library
- **日付処理**: Day.js
- **国際化**: next-intl

#### バックエンド
- **フレームワーク**: FastAPI
- **言語**: Python 3.11以上
- **ORM**: SQLAlchemy 2.0以上
- **マイグレーション**: Alembic
- **認証**: JWT, OAuth2 with FastAPI Security
- **バリデーション**: Pydantic v2
- **バックグラウンドタスク**: Celery
- **メッセージキュー**: Redis
- **テスト**: Pytest
- **ドキュメント**: OpenAPI (Swagger UI)

#### データベース
- **RDBMS**: PostgreSQL 15以上
- **キャッシュ**: Redis
- **全文検索**: PostgreSQL全文検索機能

#### インフラストラクチャ
- **コンテナ化**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **デプロイメント**: 
  - 開発環境: Docker Compose
  - 本番環境: Kubernetes (オプション)
- **監視**: Prometheus, Grafana
- **ロギング**: ELK Stack (オプション)

## 2. バックエンド詳細設計

### 2.1 API設計

#### RESTful APIエンドポイント構造

```
/api/v1
  /auth
    /login        # ログイン
    /refresh      # トークン更新
    /register     # ユーザー登録
  /users          # ユーザー管理
  /products       # 商品管理
  /categories     # カテゴリ管理
  /inventory      # 在庫管理
  /transactions   # 入出庫履歴
  /locations      # 倉庫・ロケーション管理
  /suppliers      # 仕入先管理
  /orders         # 発注管理
  /reports        # レポート生成
```

#### 認証方式
- JWTベースの認証
- アクセストークン（短期間有効）
- リフレッシュトークン（長期間有効）
- Role-Based Access Control (RBAC)

### 2.2 データベース設計

#### 主要テーブル

1. **users**: ユーザー情報
   - id (PK)
   - username
   - email
   - password_hash
   - role
   - is_active
   - created_at
   - updated_at

2. **products**: 商品マスタ
   - id (PK)
   - name
   - description
   - category_id (FK)
   - sku_code
   - barcode
   - unit
   - min_stock_level
   - optimal_stock_level
   - image_url
   - is_active
   - created_at
   - updated_at

3. **categories**: 商品カテゴリ
   - id (PK)
   - name
   - description
   - parent_id (FK, self-reference)
   - created_at
   - updated_at

4. **inventory**: 在庫テーブル
   - id (PK)
   - product_id (FK)
   - location_id (FK)
   - quantity
   - last_updated_by (FK to users)
   - created_at
   - updated_at

5. **transactions**: 入出庫履歴
   - id (PK)
   - type (enum: 'in', 'out', 'adjustment')
   - product_id (FK)
   - location_id (FK)
   - quantity
   - reference_type (enum: 'purchase', 'sale', 'return', 'transfer', 'adjustment')
   - reference_id
   - unit_price
   - performed_by (FK to users)
   - notes
   - created_at

6. **locations**: 倉庫・ロケーション
   - id (PK)
   - name
   - type (enum: 'warehouse', 'shelf', 'bin')
   - parent_id (FK, self-reference)
   - address
   - is_active
   - created_at
   - updated_at

7. **suppliers**: 仕入先
   - id (PK)
   - name
   - contact_person
   - email
   - phone
   - address
   - is_active
   - created_at
   - updated_at

8. **orders**: 発注データ
   - id (PK)
   - supplier_id (FK)
   - order_date
   - expected_arrival
   - status
   - total_amount
   - created_by (FK to users)
   - notes
   - created_at
   - updated_at

9. **order_items**: 発注明細
   - id (PK)
   - order_id (FK)
   - product_id (FK)
   - quantity
   - unit_price
   - subtotal
   - created_at
   - updated_at

#### ERD図

![ER図](./images/erd.png)

### 2.3 バックエンドモジュール構成

```
/backend
  /app
    /api
      /v1
        /auth
        /users
        /products
        /categories
        /inventory
        /transactions
        /locations
        /suppliers
        /orders
        /reports
    /core
      /config
      /security
      /errors
    /db
      /models
      /repositories
      /migrations
    /services
    /schemas
    /tasks
    /utils
  /tests
  /docs
  docker-compose.yml
  Dockerfile
  requirements.txt
  alembic.ini
  .env.example
```

## 3. フロントエンド詳細設計

### 3.1 アプリケーション構造 (Next.js App Router)

```
/frontend
  /app
    /api        # API関連のルート
    /(auth)     # 認証関連ページ
      /login
      /register
      /forgot-password
    /(dashboard) # ダッシュボード関連ページ（認証必須）
      /page.tsx  # ダッシュボードトップページ
      /products  # 商品管理
      /inventory # 在庫管理
      /transactions # 入出庫履歴
      /locations # 倉庫管理
      /suppliers # 仕入先管理
      /orders    # 発注管理
      /reports   # レポート
      /settings  # 設定
    /layout.tsx
    /page.tsx   # ランディングページ
  /components
    /ui         # 基本UIコンポーネント
    /forms      # フォーム関連コンポーネント
    /tables     # テーブル関連コンポーネント
    /charts     # グラフ・チャート関連コンポーネント
    /layouts    # レイアウト関連コンポーネント
    /modals     # モーダル関連コンポーネント
  /hooks        # カスタムフック
  /lib          # ユーティリティ関数
  /types        # TypeScript型定義
  /public       # 静的ファイル
  /styles       # グローバルスタイル
  next.config.js
  tailwind.config.js
  package.json
  tsconfig.json
```

### 3.2 状態管理設計

- **React Query**: サーバーデータの取得・キャッシュ・更新
  - 商品一覧、在庫状況、トランザクション履歴など
  - 最適化されたキャッシュと再フェッチ戦略

- **Zustand**: グローバル状態管理
  - ユーザーセッション
  - UIの状態（サイドバーの開閉、テーマ設定など）
  - フィルタや選択状態

### 3.3 UIコンポーネント設計

- **Atomic Design**に基づいたコンポーネント設計
  - Atoms: ボタン、入力フィールド、アイコンなど
  - Molecules: フォームグループ、カード、検索バーなど
  - Organisms: ナビゲーション、データテーブル、ダッシュボードパネルなど
  - Templates: ページレイアウト、ダッシュボードレイアウトなど
  - Pages: 実際のページコンポーネント

### 3.4 レスポンシブデザイン戦略

- **Tailwind CSSのブレークポイント**を活用
  - sm (640px)
  - md (768px)
  - lg (1024px)
  - xl (1280px)
  - 2xl (1536px)

- **モバイルファースト**アプローチ
  - デフォルトのスタイルはモバイル向け
  - メディアクエリで大きい画面サイズに対応

### 3.5 認証フロー

1. ユーザーがログイン情報を入力
2. バックエンドAPIでの認証
3. JWTトークンの取得とローカルストレージへの保存
4. 認証状態の管理（Zustand）
5. 保護されたルートへのアクセス制御
6. トークンの有効期限管理と自動更新
7. ログアウト処理

## 4. デプロイメント・インフラ設計

### 4.1 開発環境

Docker Composeを使用した開発環境の構築：

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://backend:8000/api/v1

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - ENVIRONMENT=development
      - DATABASE_URL=postgresql://user:password@db:5432/inventory_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=inventory_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 4.2 本番環境デプロイオプション

#### オプション1: クラウドプロバイダーでのデプロイ

- **フロントエンド**: Vercel/Netlify
- **バックエンド**: AWS ECS, Azure App Service, GCP Cloud Run
- **データベース**: AWS RDS, Azure Database for PostgreSQL, GCP Cloud SQL
- **キャッシュ**: AWS ElastiCache, Azure Cache for Redis, GCP Memorystore

#### オプション2: Kubernetes

- コンテナオーケストレーションによる柔軟なスケーリング
- マイクロサービスアーキテクチャへの将来的な移行を視野に入れた設計
- Helmチャートによるデプロイの標準化

### 4.3 CI/CD パイプライン (GitHub Actions)

```yaml
# ワークフロー例
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    # テスト実行ジョブ
    # ...

  build:
    # Dockerイメージのビルドジョブ
    # ...

  deploy:
    # デプロイジョブ
    # ...
```

### 4.4 監視・ロギング

- **アプリケーション監視**: Prometheus + Grafana
- **ログ管理**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **エラー追跡**: Sentry
- **パフォーマンス監視**: New Relic (オプション)

## 5. セキュリティ設計

### 5.1 認証・認可

- JWT認証の実装
- RBAC (Role-Based Access Control)
- 多要素認証 (オプション)
- OAuth2による外部認証 (オプション)

### 5.2 データセキュリティ

- データの暗号化 (保存時および転送時)
- センシティブ情報のマスキング
- パスワードハッシュ化 (bcrypt)
- データバックアップ戦略

### 5.3 APIセキュリティ

- CORS設定
- レート制限
- CSRFトークン
- API鍵管理 (第三者連携用)

### 5.4 脆弱性対策

- 定期的な依存関係の更新
- セキュリティスキャンの実施
- OWASP Top 10対策
- 入力検証とサニタイズ

## 6. 拡張性・保守性

### 6.1 コード品質管理

- ESLint, Prettier (フロントエンド)
- Black, isort, Flake8 (バックエンド)
- Pre-commitフック
- コードレビュープロセス

### 6.2 テスト戦略

- 単体テスト
- 統合テスト
- エンドツーエンドテスト (Cypress)
- テストカバレッジ目標: 80%以上

### 6.3 ドキュメント

- APIドキュメント (OpenAPI / Swagger)
- コンポーネントドキュメント (Storybook)
- 技術ドキュメント (Markdown)
- セットアップと運用ガイド

### 6.4 バージョン管理

- セマンティックバージョニング
- リリースノート管理
- 変更履歴の追跡

## 7. 今後の技術的課題と対応策

### 7.1 スケーラビリティ

- 水平スケーリング設計
- データベースパフォーマンスの最適化
- マイクロサービスへの移行計画 (必要に応じて)

### 7.2 国際化・多言語対応

- i18nフレームワークの導入
- 多言語コンテンツ管理
- 地域ごとの設定

### 7.3 オフライン対応

- PWA (Progressive Web App) 対応
- オフラインファーストの設計
- データ同期メカニズム

### 7.4 アクセシビリティ

- WCAG 2.1ガイドラインへの準拠
- スクリーンリーダー対応
- キーボードナビゲーション

## 8. 付録

### 8.1 用語集

- **SKU**: Stock Keeping Unit
- **FIFO**: First In, First Out
- **LIFO**: Last In, First Out
- **EOQ**: Economic Order Quantity
- **WMS**: Warehouse Management System

### 8.2 参考リソース

- FastAPI公式ドキュメント
- Next.js App Router ドキュメント
- PostgreSQL公式ドキュメント
- SQLAlchemy 2.0ドキュメント
