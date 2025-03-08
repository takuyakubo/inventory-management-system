import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface NavItem {
  label: string;
  href: string;
}

interface User {
  name: string;
  email: string;
}

interface HeaderProps {
  companyName: string;
  navItems: NavItem[];
  user?: User;
}

const Header = ({ companyName, navItems, user }: HeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">{companyName}</h1>
            </div>
            <nav className="ml-6 flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs font-medium text-gray-500">{user.email}</p>
                </div>
                <div className="ml-4">
                  <Button variant="secondary" size="sm">
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Button>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;