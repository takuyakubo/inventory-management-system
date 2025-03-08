import React from 'react';
import Header from '@/components/layouts/Header';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Products', href: '/dashboard/products' },
  { label: 'Inventory', href: '/dashboard/inventory' },
  { label: 'Transactions', href: '/dashboard/transactions' },
  { label: 'Suppliers', href: '/dashboard/suppliers' },
  { label: 'Reports', href: '/dashboard/reports' },
];

// このコンポーネントは認証後のダッシュボード関連ページのレイアウトを提供します
// 実際のアプリケーションでは、認証状態を確認する処理が必要です
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 認証済みユーザー情報（実際のアプリケーションではAPIから取得）
  const user = {
    name: 'Demo User',
    email: 'demo@example.com',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        companyName="Inventory Manager" 
        navItems={navItems} 
        user={user} 
      />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Inventory Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}