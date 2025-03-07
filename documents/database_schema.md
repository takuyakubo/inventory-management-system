# 在庫管理システム データベーススキーマ設計書

## 概要

本ドキュメントでは、在庫管理システムのデータベーススキーマ設計を詳細に記述します。データベースエンジンとしてPostgreSQLを採用し、SQLAlchemyを使用してORMを実装します。

## データベース設計の方針

- 正規化されたスキーマ設計を基本とし、パフォーマンスが必要な場合に適切な非正規化を検討
- 一貫性のある命名規則（スネークケース）
- 履歴管理のためのタイムスタンプフィールドの標準実装
- 外部キー制約による参照整合性の確保
- インデックス設計によるクエリパフォーマンスの最適化

## テーブル定義

### 1. users (ユーザー)

ユーザー情報を管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | ユーザーID |
| username | VARCHAR(100) | UNIQUE, NOT NULL | ユーザー名（メールアドレス） |
| password_hash | VARCHAR(255) | NOT NULL | パスワードハッシュ |
| name | VARCHAR(100) | NOT NULL | ユーザー実名 |
| role | VARCHAR(20) | NOT NULL | ロール（admin/manager/inventory_manager/viewer） |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | アクティブ状態 |
| last_login | TIMESTAMP | | 最終ログイン日時 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- username (UNIQUE)
- role (通常のインデックス)

### 2. categories (カテゴリ)

商品カテゴリを管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | カテゴリID |
| name | VARCHAR(100) | NOT NULL | カテゴリ名 |
| description | TEXT | | カテゴリの説明 |
| parent_id | INTEGER | FOREIGN KEY (categories.id) | 親カテゴリID (階層構造) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- parent_id (外部キー)
- name (通常のインデックス)

### 3. products (商品)

商品マスタ情報を管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | 商品ID |
| name | VARCHAR(200) | NOT NULL | 商品名 |
| description | TEXT | | 商品説明 |
| category_id | INTEGER | FOREIGN KEY (categories.id), NOT NULL | カテゴリID |
| sku_code | VARCHAR(50) | UNIQUE, NOT NULL | SKUコード |
| barcode | VARCHAR(50) | UNIQUE | バーコード |
| unit | VARCHAR(20) | NOT NULL | 単位（個、箱、kg等） |
| min_stock_level | INTEGER | | 最小在庫レベル |
| optimal_stock_level | INTEGER | | 最適在庫レベル |
| image_url | VARCHAR(255) | | 商品画像URL |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | アクティブ状態 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- category_id (外部キー)
- sku_code (UNIQUE)
- barcode (UNIQUE)
- name (通常のインデックス)

### 4. locations (ロケーション)

倉庫や棚などの在庫保管場所を管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | ロケーションID |
| name | VARCHAR(100) | NOT NULL | ロケーション名 |
| type | VARCHAR(20) | NOT NULL | タイプ (warehouse/shelf/bin) |
| parent_id | INTEGER | FOREIGN KEY (locations.id) | 親ロケーションID |
| address | TEXT | | 住所 (倉庫の場合) |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | アクティブ状態 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- parent_id (外部キー)
- name (通常のインデックス)
- type (通常のインデックス)

### 5. inventory (在庫)

各ロケーションにおける商品の在庫数量を管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | 在庫ID |
| product_id | INTEGER | FOREIGN KEY (products.id), NOT NULL | 商品ID |
| location_id | INTEGER | FOREIGN KEY (locations.id), NOT NULL | ロケーションID |
| quantity | INTEGER | NOT NULL, DEFAULT 0 | 在庫数量 |
| last_updated_by | INTEGER | FOREIGN KEY (users.id), NOT NULL | 最終更新者ID |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- product_id (外部キー)
- location_id (外部キー)
- product_id, location_id (複合UNIQUE)

### 6. transactions (入出庫履歴)

商品の入出庫や在庫調整の履歴を管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | トランザクションID |
| type | VARCHAR(20) | NOT NULL | タイプ (in/out/adjustment) |
| product_id | INTEGER | FOREIGN KEY (products.id), NOT NULL | 商品ID |
| location_id | INTEGER | FOREIGN KEY (locations.id), NOT NULL | ロケーションID |
| quantity | INTEGER | NOT NULL | 数量 |
| reference_type | VARCHAR(20) | | 参照タイプ (purchase/sale/return/transfer/adjustment) |
| reference_id | VARCHAR(50) | | 参照ID |
| unit_price | DECIMAL(12,2) | | 単価 |
| performed_by | INTEGER | FOREIGN KEY (users.id), NOT NULL | 実行者ID |
| notes | TEXT | | 備考 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時（≒実行日時） |

**インデックス:**
- product_id (外部キー)
- location_id (外部キー)
- performed_by (外部キー)
- reference_type, reference_id (複合インデックス)
- created_at (通常のインデックス)

### 7. suppliers (仕入先)

仕入先情報を管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | 仕入先ID |
| name | VARCHAR(200) | NOT NULL | 仕入先名 |
| contact_person | VARCHAR(100) | | 担当者名 |
| email | VARCHAR(100) | | メールアドレス |
| phone | VARCHAR(20) | | 電話番号 |
| address | TEXT | | 住所 |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | アクティブ状態 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- name (通常のインデックス)
- email (通常のインデックス)

### 8. product_suppliers (商品と仕入先の関連)

商品と仕入先の関連情報を管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | 関連ID |
| product_id | INTEGER | FOREIGN KEY (products.id), NOT NULL | 商品ID |
| supplier_id | INTEGER | FOREIGN KEY (suppliers.id), NOT NULL | 仕入先ID |
| supplier_product_code | VARCHAR(50) | | 仕入先商品コード |
| default_unit_price | DECIMAL(12,2) | | 標準単価 |
| lead_time_days | INTEGER | | リードタイム（日数） |
| is_preferred | BOOLEAN | NOT NULL, DEFAULT FALSE | 優先仕入先フラグ |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- product_id (外部キー)
- supplier_id (外部キー)
- product_id, supplier_id (複合UNIQUE)

### 9. orders (発注)

発注データを管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | 発注ID |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | 発注番号 |
| supplier_id | INTEGER | FOREIGN KEY (suppliers.id), NOT NULL | 仕入先ID |
| order_date | DATE | NOT NULL | 発注日 |
| expected_arrival | DATE | | 入荷予定日 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'draft' | ステータス (draft/confirmed/received/cancelled) |
| total_amount | DECIMAL(14,2) | NOT NULL, DEFAULT 0 | 合計金額 |
| created_by | INTEGER | FOREIGN KEY (users.id), NOT NULL | 作成者ID |
| notes | TEXT | | 備考 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- order_number (UNIQUE)
- supplier_id (外部キー)
- created_by (外部キー)
- status (通常のインデックス)
- order_date (通常のインデックス)

### 10. order_items (発注明細)

発注の明細データを管理するテーブル

| 列名 | データ型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | SERIAL | PRIMARY KEY | 発注明細ID |
| order_id | INTEGER | FOREIGN KEY (orders.id), NOT NULL | 発注ID |
| product_id | INTEGER | FOREIGN KEY (products.id), NOT NULL | 商品ID |
| quantity | INTEGER | NOT NULL | 数量 |
| unit_price | DECIMAL(12,2) | NOT NULL | 単価 |
| subtotal | DECIMAL(14,2) | NOT NULL | 小計 |
| received_quantity | INTEGER | NOT NULL, DEFAULT 0 | 入荷済数量 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス:**
- order_id (外部キー)
- product_id (外部キー)

## リレーションシップ

主要なリレーションシップは以下の通りです:

1. **カテゴリの階層関係**:
   - categories.parent_id → categories.id (自己参照)

2. **ロケーションの階層関係**:
   - locations.parent_id → locations.id (自己参照)

3. **商品とカテゴリの関係**:
   - products.category_id → categories.id

4. **在庫と商品・ロケーションの関係**:
   - inventory.product_id → products.id
   - inventory.location_id → locations.id
   - inventory.last_updated_by → users.id

5. **トランザクションと商品・ロケーションの関係**:
   - transactions.product_id → products.id
   - transactions.location_id → locations.id
   - transactions.performed_by → users.id

6. **商品と仕入先の関係**:
   - product_suppliers.product_id → products.id
   - product_suppliers.supplier_id → suppliers.id

7. **発注と仕入先・ユーザーの関係**:
   - orders.supplier_id → suppliers.id
   - orders.created_by → users.id

8. **発注明細と発注・商品の関係**:
   - order_items.order_id → orders.id
   - order_items.product_id → products.id

## インデックス戦略

### 一般的なインデックス戦略

1. **主キー (PRIMARY KEY)**:
   - すべてのテーブルに主キーを設定し、自動採番のSERIAL型を使用

2. **外部キー (FOREIGN KEY)**:
   - すべての外部キーにインデックスを設定

3. **ユニーク制約 (UNIQUE)**:
   - ユニーク制約付きの列にはインデックスを設定
   - 例: users.username, products.sku_code など

4. **複合インデックス**:
   - 頻繁に組み合わせて検索される列には複合インデックスを設定
   - 例: inventory.product_id, inventory.location_id など

5. **検索・フィルタリング用インデックス**:
   - 頻繁に検索・フィルタリングされる列にはインデックスを設定
   - 例: products.name, transactions.created_at など

### パフォーマンス最適化のための特別なインデックス

1. **部分インデックス**:
   - アクティブなレコードのみに対するインデックス
   ```sql
   CREATE INDEX idx_active_products ON products (name) WHERE is_active = TRUE;
   ```

2. **GINインデックス（全文検索用）**:
   - 商品説明などのテキスト検索に使用
   ```sql
   CREATE INDEX idx_product_description_gin ON products USING GIN(to_tsvector('japanese', description));
   ```

## データ移行・シード戦略

1. **初期データ（マスターデータ）**:
   - カテゴリ、ユニット、ロケーションタイプなどの基本データを初期シードとして提供
   - 管理者ユーザーを初期シードとして作成

2. **テストデータ**:
   - 開発・テスト環境用のサンプルデータを提供
   - 各エンティティのダミーデータを適切な関連性を持って生成

3. **データ移行ツール**:
   - 既存システムからのデータ移行用スクリプトを提供
   - CSVインポート機能を実装

## パフォーマンス考慮事項

1. **パーティショニング**:
   - transactions テーブルは日付によるパーティショニングを検討
   ```sql
   CREATE TABLE transactions (
     ...
   ) PARTITION BY RANGE (created_at);
   
   CREATE TABLE transactions_y2025m01 PARTITION OF transactions 
   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
   ```

2. **定期的なメンテナンス**:
   - 統計情報の更新: `ANALYZE`
   - インデックスの再構築: `REINDEX`
   - 不要データの削除・アーカイブ

3. **大量データ対応**:
   - バルク操作の最適化
   - ページネーションとカーソルベースのページング実装
   - キャッシュ戦略の導入

## SQLAlchemy実装の注意点

1. **モデル定義**:
   - SQLAlchemy 2.0の型アノテーションを活用
   - リレーションシップを適切に定義

2. **マイグレーション管理**:
   - Alembicを使用したマイグレーション管理
   - バージョニングによる安全なスキーマ更新

3. **クエリ最適化**:
   - 必要な列のみを選択
   - JOIN操作の最適化
   - 適切なeager loading vs. lazy loading

## バックアップ戦略

1. **定期バックアップ**:
   - 日次フルバックアップ
   - WALアーカイブによるポイントインタイムリカバリ

2. **災害復旧計画**:
   - バックアップのオフサイト保存
   - レプリケーションによる冗長性確保

## セキュリティ対策

1. **データ暗号化**:
   - パスワードのハッシュ化 (bcrypt)
   - センシティブデータの暗号化保存

2. **アクセス制御**:
   - 行レベルセキュリティの実装
   - ロールベースのアクセス制御

3. **監査ログ**:
   - 重要なデータの変更履歴を記録
