import React from 'react';
import Header from '@/components/layouts/Header';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Contact', href: '/#contact' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header companyName="Inventory Manager" navItems={navItems} />
      
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Inventory Management System
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Streamline Your Inventory Management
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Efficiently manage your inventory, track stock levels, and optimize your supply chain with our comprehensive inventory management solution.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link href="/dashboard">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/#contact">
                  <Button variant="secondary" size="lg">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-10">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage your inventory
              </p>
            </div>
            
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900">Real-time Tracking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Monitor stock levels in real-time and get instant updates on inventory movements.
                  </p>
                </div>
                
                {/* Feature 2 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900">Auto-Replenishment</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Set reorder points and automatically generate purchase orders when stock is low.
                  </p>
                </div>
                
                {/* Feature 3 */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900">Analytics & Reporting</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Gain insights with powerful reports and analytics on your inventory performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">© {new Date().getFullYear()} Inventory Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}