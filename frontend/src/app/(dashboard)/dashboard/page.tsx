import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard | Inventory Management System',
  description: 'Main dashboard for the Inventory Management System',
};

// ダッシュボードカードコンポーネント
function DashboardCard({ 
  title, 
  value, 
  description, 
  link,
}: { 
  title: string; 
  value: string | number; 
  description: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="block bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-semibold text-blue-600">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  // 実際のアプリケーションではAPIから取得したデータを使用します
  const dashboardData = {
    totalProducts: 258,
    lowStockItems: 12,
    pendingOrders: 7,
    totalTransactions: 865,
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={dashboardData.totalProducts}
          description="Products in your inventory"
          link="/dashboard/products"
        />
        
        <DashboardCard
          title="Low Stock Items"
          value={dashboardData.lowStockItems}
          description="Items that need attention"
          link="/dashboard/inventory?filter=low_stock"
        />
        
        <DashboardCard
          title="Pending Orders"
          value={dashboardData.pendingOrders}
          description="Orders waiting to be processed"
          link="/dashboard/orders?status=pending"
        />
        
        <DashboardCard
          title="Transactions"
          value={dashboardData.totalTransactions}
          description="Total transactions this month"
          link="/dashboard/transactions"
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {['IN', 'OUT', 'ADJ', 'PO', 'TR'][i % 5]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {['Product received', 'Product shipped', 'Inventory adjusted', 'Purchase order created', 'Stock transferred'][i % 5]}
                    </p>
                    <p className="text-sm text-gray-500">
                      {`${i + 1} hour${i !== 0 ? 's' : ''} ago`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Link 
                href="/dashboard/transactions"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quick Actions Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/dashboard/products/new"
                className="px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Add New Product
              </Link>
              
              <Link 
                href="/dashboard/inventory/add"
                className="px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Record Stock In
              </Link>
              
              <Link 
                href="/dashboard/inventory/remove"
                className="px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Record Stock Out
              </Link>
              
              <Link 
                href="/dashboard/orders/new"
                className="px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Create Purchase Order
              </Link>
              
              <Link 
                href="/dashboard/reports"
                className="px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Generate Report
              </Link>
              
              <Link 
                href="/dashboard/settings"
                className="px-4 py-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                System Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}