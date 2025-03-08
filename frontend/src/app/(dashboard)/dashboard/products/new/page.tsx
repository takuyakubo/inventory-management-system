import React from 'react';
import Link from 'next/link';
import ProductForm from '@/components/forms/ProductForm';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Add New Product | Inventory Management System',
  description: 'Add a new product to your inventory',
};

// 仮のカテゴリーデータ（実際のアプリではAPIから取得）
const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'office', name: 'Office Supplies' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'lighting', name: 'Lighting' },
];

export default function AddProductPage() {
  // 実際のアプリケーションではAPIと連携してフォームを処理
  const handleSubmit = (productData: any) => {
    console.log('Creating new product:', productData);
    // APIリクエストや状態更新のロジックを実装
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
        <Link href="/dashboard/products">
          <Button variant="secondary">Cancel</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Product Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            Fill out the form below to add a new product to your inventory.
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <ProductForm 
            onSubmit={handleSubmit}
            categories={categories}
            validate={true}
          />
        </div>
      </div>
    </div>
  );
}