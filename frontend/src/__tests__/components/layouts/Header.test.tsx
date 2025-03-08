import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/layouts/Header';

// Mockデータ
const mockNavItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Products', href: '/products' },
  { label: 'Inventory', href: '/inventory' },
];

// Next.jsのLinkコンポーネントをモック
jest.mock('next/link', () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Header Component', () => {
  it('renders company name correctly', () => {
    render(<Header companyName="Acme Corp" navItems={mockNavItems} />);
    
    const companyName = screen.getByText('Acme Corp');
    expect(companyName).toBeInTheDocument();
  });

  it('renders navigation items correctly', () => {
    render(<Header companyName="Acme Corp" navItems={mockNavItems} />);
    
    mockNavItems.forEach(item => {
      const navItem = screen.getByText(item.label);
      expect(navItem).toBeInTheDocument();
      expect(navItem.closest('a')).toHaveAttribute('href', item.href);
    });
  });

  it('renders user profile section when user is provided', () => {
    render(
      <Header 
        companyName="Acme Corp" 
        navItems={mockNavItems} 
        user={{ name: 'John Doe', email: 'john@example.com' }} 
      />
    );
    
    const userName = screen.getByText('John Doe');
    expect(userName).toBeInTheDocument();
  });

  it('renders login button when user is not provided', () => {
    render(<Header companyName="Acme Corp" navItems={mockNavItems} />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });
});