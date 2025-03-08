import React from 'react';
import Link from 'next/link';
import DataTable from '@/components/tables/DataTable';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Products | Inventory Management System',
  description: 'Manage your product catalog',
};

// 仮の製品データ（実際のアプリではAPIから取得）
const products = [
  { id: 'P001', name: 'Wireless Mouse', category: 'Electronics', sku: 'WM-1234', stock: 45, price: 29.99 },
  { id: 'P002', name: 'Bluetooth Keyboard', category: 'Electronics', sku: 'BK-5678', stock: 32, price: 59.99 },
  { id: 'P003', name: 'USB-C Cable', category: 'Accessories', sku: 'UC-9012', stock: 120, price: 14.99 },
  { id: 'P004', name: 'Laptop Stand', category: 'Office', sku: 'LS-3456', stock: 18, price: 35.99 },
  { id: 'P005', name: 'Monitor Arm', category: 'Office', sku: 'MA-7890', stock: 7, price: 89.99 },
  { id: 'P006', name: 'Webcam HD', category: 'Electronics', sku: 'WC-2345', stock: 0, price: 65.99 },
  { id: 'P007', name: 'Desk Lamp', category: 'Lighting', sku: 'DL-6789', stock: 23, price: 42.50 },
  { id: 'P008', name: 'Wireless Charger', category: 'Electronics', sku: 'WC-0123', stock: 56, price: 27.99 },
  { id: 'P009', name: 'Ergonomic Chair', category: 'Furniture', sku: 'EC-4567', stock: 5, price: 249.99 },
  { id: 'P010', name: 'Desk Mat', category: 'Office', sku: 'DM-8901', stock: 48, price: 19.99 },
];

// テーブルのカラム定義
const productColumns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Category', accessor: 'category' },
  { header: 'SKU', accessor: 'sku' },
  { 
    header: 'Stock', 
    accessor: 'stock',
    formatter: (value: number) => (
      <span className={value === 0 ? 'text-red-600 font-medium' : ''}>
        {value}
      </span>
    )
  },
  { 
    header: 'Price', 
    accessor: 'price',
    formatter: (value: number) => `$${value.toFixed(2)}` 
  },
];

export default function ProductsPage() {
  // 在庫切れの行をハイライト
  const rowHighlighter = (row: any) => row.stock === 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Link href="/dashboard/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Product Catalog</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product inventory, update details, or add new products.
          </p>
        </div>

        <DataTable
          columns={productColumns}
          data={products}
          rowHighlighter={rowHighlighter}
          highlightClass="bg-red-50"
          zebraStriping
          onRowClick={(product) => console.log('Product clicked:', product)}
          emptyMessage="No products found. Add a new product to get started."
        />
      </div>
    </div>
  );
}