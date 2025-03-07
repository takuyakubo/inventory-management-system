# 在庫管理システム API仕様書

## 概要

この文書は在庫管理システムのRESTful API仕様を定義しています。
全てのエンドポイントは `/api/v1` をベースパスとして使用します。

## 認証

- 認証には JWT (JSON Web Token) を使用します
- 認証が必要なリクエストでは、`Authorization` ヘッダーにBearerトークンを含める必要があります
- 例: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 共通レスポンス形式

### 成功レスポンス

```json
{
  "success": true,
  "data": { ... },
  "message": "操作が成功しました"
}
```

### エラーレスポンス

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}
```

### 共通ステータスコード

- `200 OK`: リクエストが成功しました
- `201 Created`: リソースが正常に作成されました
- `400 Bad Request`: リクエストに問題があります
- `401 Unauthorized`: 認証が必要です
- `403 Forbidden`: 権限がありません
- `404 Not Found`: リソースが見つかりません
- `422 Unprocessable Entity`: バリデーションエラー
- `500 Internal Server Error`: サーバーエラー

## エンドポイント一覧

### 認証 (Authentication)

#### ログイン

- **URL**: `/auth/login`
- **メソッド**: `POST`
- **認証**: 不要
- **リクエスト本文**:
  ```json
  {
    "username": "user@example.com",
    "password": "password123"
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "access_token": "eyJhbG...",
      "refresh_token": "eyJhbG...",
      "token_type": "bearer",
      "expires_in": 3600,
      "user": {
        "id": 1,
        "username": "user@example.com",
        "role": "admin",
        "name": "管理者"
      }
    },
    "message": "ログインに成功しました"
  }
  ```

#### トークン更新

- **URL**: `/auth/refresh`
- **メソッド**: `POST`
- **認証**: 不要
- **リクエスト本文**:
  ```json
  {
    "refresh_token": "eyJhbG..."
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "access_token": "eyJhbG...",
      "token_type": "bearer",
      "expires_in": 3600
    },
    "message": "トークンが更新されました"
  }
  ```

#### ユーザー登録

- **URL**: `/auth/register`
- **メソッド**: `POST`
- **認証**: 管理者のみ
- **リクエスト本文**:
  ```json
  {
    "username": "user@example.com",
    "password": "password123",
    "name": "山田太郎",
    "role": "user"
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "username": "user@example.com",
      "role": "user",
      "name": "山田太郎",
      "created_at": "2025-03-07T12:00:00Z"
    },
    "message": "ユーザーが登録されました"
  }
  ```

### ユーザー管理 (Users)

#### ユーザー一覧取得

- **URL**: `/users`
- **メソッド**: `GET`
- **認証**: 管理者のみ
- **クエリパラメータ**:
  - `page` (デフォルト: 1): ページ番号
  - `per_page` (デフォルト: 20): 1ページあたりの件数
  - `role` (オプション): ロールでフィルタリング
  - `search` (オプション): 検索キーワード
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": 1,
          "username": "admin@example.com",
          "name": "管理者",
          "role": "admin",
          "is_active": true,
          "created_at": "2025-03-01T00:00:00Z",
          "updated_at": "2025-03-01T00:00:00Z"
        },
        ...
      ],
      "total": 100,
      "page": 1,
      "per_page": 20,
      "pages": 5
    },
    "message": "ユーザー一覧を取得しました"
  }
  ```

#### ユーザー詳細取得

- **URL**: `/users/{user_id}`
- **メソッド**: `GET`
- **認証**: 管理者または本人のみ
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "admin@example.com",
      "name": "管理者",
      "role": "admin",
      "is_active": true,
      "created_at": "2025-03-01T00:00:00Z",
      "updated_at": "2025-03-01T00:00:00Z",
      "last_login": "2025-03-07T10:00:00Z"
    },
    "message": "ユーザー情報を取得しました"
  }
  ```

#### ユーザー更新

- **URL**: `/users/{user_id}`
- **メソッド**: `PUT`
- **認証**: 管理者または本人のみ
- **リクエスト本文**:
  ```json
  {
    "name": "山田太郎",
    "role": "manager",
    "is_active": true
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "username": "user@example.com",
      "name": "山田太郎",
      "role": "manager",
      "is_active": true,
      "updated_at": "2025-03-07T12:30:00Z"
    },
    "message": "ユーザー情報が更新されました"
  }
  ```

#### ユーザー削除

- **URL**: `/users/{user_id}`
- **メソッド**: `DELETE`
- **認証**: 管理者のみ
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": null,
    "message": "ユーザーが削除されました"
  }
  ```

### 商品管理 (Products)

#### 商品一覧取得

- **URL**: `/products`
- **メソッド**: `GET`
- **認証**: 必要
- **クエリパラメータ**:
  - `page` (デフォルト: 1): ページ番号
  - `per_page` (デフォルト: 20): 1ページあたりの件数
  - `category_id` (オプション): カテゴリIDでフィルタリング
  - `search` (オプション): 検索キーワード
  - `sort` (オプション): ソートフィールド (例: `name`, `-created_at`)
  - `is_active` (オプション): アクティブな商品のみ
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": 1,
          "name": "商品A",
          "description": "商品の説明",
          "category": {
            "id": 1,
            "name": "カテゴリA"
          },
          "sku_code": "SKU001",
          "barcode": "1234567890123",
          "unit": "個",
          "min_stock_level": 10,
          "optimal_stock_level": 50,
          "image_url": "/images/products/1.jpg",
          "is_active": true,
          "created_at": "2025-03-01T00:00:00Z",
          "updated_at": "2025-03-01T00:00:00Z"
        },
        ...
      ],
      "total": 100,
      "page": 1,
      "per_page": 20,
      "pages": 5
    },
    "message": "商品一覧を取得しました"
  }
  ```

#### 商品詳細取得

- **URL**: `/products/{product_id}`
- **メソッド**: `GET`
- **認証**: 必要
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "商品A",
      "description": "商品の説明",
      "category": {
        "id": 1,
        "name": "カテゴリA"
      },
      "sku_code": "SKU001",
      "barcode": "1234567890123",
      "unit": "個",
      "min_stock_level": 10,
      "optimal_stock_level": 50,
      "image_url": "/images/products/1.jpg",
      "is_active": true,
      "created_at": "2025-03-01T00:00:00Z",
      "updated_at": "2025-03-01T00:00:00Z",
      "inventory_summary": {
        "total_quantity": 120,
        "locations": [
          {
            "location_id": 1,
            "location_name": "倉庫A",
            "quantity": 100
          },
          {
            "location_id": 2,
            "location_name": "倉庫B",
            "quantity": 20
          }
        ]
      }
    },
    "message": "商品情報を取得しました"
  }
  ```

#### 商品登録

- **URL**: `/products`
- **メソッド**: `POST`
- **認証**: 管理者または在庫管理者のみ
- **リクエスト本文**:
  ```json
  {
    "name": "新商品",
    "description": "新商品の説明",
    "category_id": 1,
    "sku_code": "SKU002",
    "barcode": "1234567890124",
    "unit": "個",
    "min_stock_level": 5,
    "optimal_stock_level": 30,
    "is_active": true
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "name": "新商品",
      "description": "新商品の説明",
      "category": {
        "id": 1,
        "name": "カテゴリA"
      },
      "sku_code": "SKU002",
      "barcode": "1234567890124",
      "unit": "個",
      "min_stock_level": 5,
      "optimal_stock_level": 30,
      "image_url": null,
      "is_active": true,
      "created_at": "2025-03-07T13:00:00Z",
      "updated_at": "2025-03-07T13:00:00Z"
    },
    "message": "商品が登録されました"
  }
  ```

#### 商品更新

- **URL**: `/products/{product_id}`
- **メソッド**: `PUT`
- **認証**: 管理者または在庫管理者のみ
- **リクエスト本文**:
  ```json
  {
    "name": "商品A（更新）",
    "description": "更新された説明",
    "category_id": 2,
    "min_stock_level": 15,
    "is_active": true
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "商品A（更新）",
      "description": "更新された説明",
      "category": {
        "id": 2,
        "name": "カテゴリB"
      },
      "sku_code": "SKU001",
      "barcode": "1234567890123",
      "unit": "個",
      "min_stock_level": 15,
      "optimal_stock_level": 50,
      "image_url": "/images/products/1.jpg",
      "is_active": true,
      "updated_at": "2025-03-07T13:30:00Z"
    },
    "message": "商品情報が更新されました"
  }
  ```

#### 商品削除

- **URL**: `/products/{product_id}`
- **メソッド**: `DELETE`
- **認証**: 管理者のみ
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": null,
    "message": "商品が削除されました"
  }
  ```

### 在庫管理 (Inventory)

#### 在庫一覧取得

- **URL**: `/inventory`
- **メソッド**: `GET`
- **認証**: 必要
- **クエリパラメータ**:
  - `page` (デフォルト: 1): ページ番号
  - `per_page` (デフォルト: 20): 1ページあたりの件数
  - `product_id` (オプション): 商品IDでフィルタリング
  - `location_id` (オプション): ロケーションIDでフィルタリング
  - `low_stock` (オプション): 在庫が最小レベル以下のみ
  - `search` (オプション): 商品名で検索
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": 1,
          "product": {
            "id": 1,
            "name": "商品A",
            "sku_code": "SKU001",
            "min_stock_level": 10
          },
          "location": {
            "id": 1,
            "name": "倉庫A"
          },
          "quantity": 100,
          "last_updated": "2025-03-05T10:00:00Z",
          "last_updated_by": {
            "id": 1,
            "name": "管理者"
          },
          "status": "normal" // low, critical, excess
        },
        ...
      ],
      "total": 50,
      "page": 1,
      "per_page": 20,
      "pages": 3
    },
    "message": "在庫一覧を取得しました"
  }
  ```

#### 在庫詳細取得

- **URL**: `/inventory/{inventory_id}`
- **メソッド**: `GET`
- **認証**: 必要
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "product": {
        "id": 1,
        "name": "商品A",
        "sku_code": "SKU001",
        "description": "商品の説明",
        "barcode": "1234567890123",
        "unit": "個",
        "min_stock_level": 10,
        "optimal_stock_level": 50
      },
      "location": {
        "id": 1,
        "name": "倉庫A",
        "type": "warehouse",
        "address": "東京都..."
      },
      "quantity": 100,
      "last_updated": "2025-03-05T10:00:00Z",
      "last_updated_by": {
        "id": 1,
        "name": "管理者"
      },
      "transaction_history": [
        {
          "id": 123,
          "type": "in",
          "quantity": 50,
          "date": "2025-03-05T10:00:00Z",
          "performed_by": "管理者"
        },
        {
          "id": 100,
          "type": "in",
          "quantity": 50,
          "date": "2025-03-01T09:00:00Z",
          "performed_by": "山田太郎"
        }
      ]
    },
    "message": "在庫情報を取得しました"
  }
  ```

#### 在庫調整

- **URL**: `/inventory/adjust`
- **メソッド**: `POST`
- **認証**: 管理者または在庫管理者のみ
- **リクエスト本文**:
  ```json
  {
    "product_id": 1,
    "location_id": 1,
    "quantity": 120,
    "notes": "実地棚卸による調整"
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "product": {
        "id": 1,
        "name": "商品A"
      },
      "location": {
        "id": 1,
        "name": "倉庫A"
      },
      "old_quantity": 100,
      "new_quantity": 120,
      "adjustment": 20,
      "transaction_id": 150,
      "last_updated": "2025-03-07T14:00:00Z"
    },
    "message": "在庫が調整されました"
  }
  ```

### 入出庫管理 (Transactions)

#### 入庫処理

- **URL**: `/transactions/inbound`
- **メソッド**: `POST`
- **認証**: 管理者または在庫管理者のみ
- **リクエスト本文**:
  ```json
  {
    "product_id": 1,
    "location_id": 1,
    "quantity": 50,
    "reference_type": "purchase",
    "reference_id": "PO12345",
    "unit_price": 1000,
    "notes": "発注書PO12345からの入庫"
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "transaction_id": 151,
      "product": {
        "id": 1,
        "name": "商品A"
      },
      "location": {
        "id": 1,
        "name": "倉庫A"
      },
      "quantity": 50,
      "old_stock": 120,
      "new_stock": 170,
      "reference_type": "purchase",
      "reference_id": "PO12345",
      "performed_at": "2025-03-07T14:30:00Z",
      "performed_by": {
        "id": 1,
        "name": "管理者"
      }
    },
    "message": "入庫処理が完了しました"
  }
  ```

#### 出庫処理

- **URL**: `/transactions/outbound`
- **メソッド**: `POST`
- **認証**: 管理者または在庫管理者のみ
- **リクエスト本文**:
  ```json
  {
    "product_id": 1,
    "location_id": 1,
    "quantity": 20,
    "reference_type": "sale",
    "reference_id": "SO67890",
    "unit_price": 1500,
    "notes": "受注SO67890に対する出荷"
  }
  ```
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "transaction_id": 152,
      "product": {
        "id": 1,
        "name": "商品A"
      },
      "location": {
        "id": 1,
        "name": "倉庫A"
      },
      "quantity": 20,
      "old_stock": 170,
      "new_stock": 150,
      "reference_type": "sale",
      "reference_id": "SO67890",
      "performed_at": "2025-03-07T15:00:00Z",
      "performed_by": {
        "id": 1,
        "name": "管理者"
      }
    },
    "message": "出庫処理が完了しました"
  }
  ```

#### トランザクション履歴取得

- **URL**: `/transactions`
- **メソッド**: `GET`
- **認証**: 必要
- **クエリパラメータ**:
  - `page` (デフォルト: 1): ページ番号
  - `per_page` (デフォルト: 20): 1ページあたりの件数
  - `product_id` (オプション): 商品IDでフィルタリング
  - `location_id` (オプション): ロケーションIDでフィルタリング
  - `type` (オプション): タイプでフィルタリング (in, out, adjustment)
  - `reference_type` (オプション): 参照タイプでフィルタリング
  - `from_date` (オプション): 開始日
  - `to_date` (オプション): 終了日
  - `performed_by` (オプション): 実行者IDでフィルタリング
- **レスポンス**: 
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": 152,
          "type": "out",
          "product": {
            "id": 1,
            "name": "商品A",
            "sku_code": "SKU001"
          },
          "location": {
            "id": 1,
            "name": "倉庫A"
          },
          "quantity": 20,
          "reference_type": "sale",
          "reference_id": "SO67890",
          "unit_price": 1500,
          "total_amount": 30000,
          "notes": "受注SO67890に対する出荷",
          "performed_at": "2025-03-07T15:00:00Z",
          "performed_by": {
            "id": 1,
            "name": "管理者"
          }
        },
        ...
      ],
      "total": 152,
      "page": 1,
      "per_page": 20,
      "pages": 8
    },
    "message": "トランザクション履歴を取得しました"
  }
  ```

### その他のエンドポイント

他のエンドポイントも同様の形式で実装します：

- カテゴリ管理 (Categories)
  - `/categories` - GET, POST
  - `/categories/{category_id}` - GET, PUT, DELETE

- 倉庫・ロケーション管理 (Locations)
  - `/locations` - GET, POST
  - `/locations/{location_id}` - GET, PUT, DELETE

- 仕入先管理 (Suppliers)
  - `/suppliers` - GET, POST
  - `/suppliers/{supplier_id}` - GET, PUT, DELETE

- 発注管理 (Orders)
  - `/orders` - GET, POST
  - `/orders/{order_id}` - GET, PUT, DELETE
  - `/orders/{order_id}/items` - GET
  - `/orders/generate-proposal` - POST (発注提案生成)

- レポート (Reports)
  - `/reports/inventory-status` - GET
  - `/reports/stock-movements` - GET
  - `/reports/low-stock` - GET
  - `/reports/inventory-value` - GET
  - `/reports/turnover-rate` - GET

## データ型定義

### ユーザーロール

```
admin: 管理者
manager: マネージャー
inventory_manager: 在庫管理者
viewer: 閲覧者
```

### トランザクションタイプ

```
in: 入庫
out: 出庫
adjustment: 調整
```

### 参照タイプ

```
purchase: 仕入
sale: 販売
return: 返品
transfer: 移動
adjustment: 調整
other: その他
```

### 在庫ステータス

```
normal: 通常
low: 最小在庫レベル以下
critical: 在庫切れまたは危機的に低い
excess: 最適在庫レベルを超過
```

## バージョニング

APIのバージョンアップを行う場合は、新しいバージョンのエンドポイントを用意します（例: `/api/v2/...`）。互換性を保つため、古いバージョンのAPIも一定期間は維持されます。

## レート制限

APIの安定性を確保するため、レート制限が適用されます：

- 認証済みリクエスト: 1分あたり100リクエスト
- 認証なしリクエスト: 1分あたり20リクエスト

制限を超えた場合は、`429 Too Many Requests` エラーが返されます。
