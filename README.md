# 在庫管理システム

Python バックエンド & Next.js (App Router) フロントエンドを使用した在庫管理システム

## 概要

このシステムは、商品の在庫を効率的に管理し、入出庫履歴を追跡し、在庫状況を可視化することを目的としています。バックエンドは Python (FastAPI)、フロントエンドは Next.js (App Router) で実装されています。

## 設計ドキュメント

本リポジトリには以下の設計ドキュメントが含まれています：

1. [要件定義書](./documents/requirements.md) - システムの機能要件と非機能要件の定義
2. [技術アーキテクチャ設計書](./documents/architecture.md) - システム全体のアーキテクチャと技術スタックの詳細
3. [API仕様書](./documents/api_specification.md) - RESTful APIのエンドポイントとデータ形式の定義
4. [データベーススキーマ設計書](./documents/database_schema.md) - データベースのテーブル定義とリレーションシップ

## 主要機能

- ユーザー管理（ロールベースのアクセス制御）
- 商品マスタ管理
- カテゴリ管理
- 在庫管理（複数ロケーション対応）
- 入出庫管理
- 仕入先管理
- 発注管理
- レポート・分析機能
- バーコード・QRコード対応

## 技術スタック

### バックエンド
- Python 3.11+
- FastAPI
- SQLAlchemy 2.0+
- PostgreSQL
- Redis（キャッシュ・タスクキュー）
- Celery（バックグラウンドタスク）

### フロントエンド
- Next.js 14+（App Router）
- TypeScript
- Tailwind CSS
- React Query
- Zustand
- React Hook Form

### デプロイメント
- Docker / Docker Compose
- GitHub Actions (CI/CD)

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/takuyakubo/inventory-management-system.git
cd inventory-management-system

# Docker Composeでの環境起動
docker-compose up -d
```

詳細は各ディレクトリの README.md を参照してください。

## ライセンス

MIT

## 連絡先

開発に関するお問い合わせ：[メールアドレス]
