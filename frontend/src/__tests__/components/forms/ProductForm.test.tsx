import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductForm from '@/components/forms/ProductForm';

// Mock form submission handler
const mockSubmit = jest.fn();

// Mock categories for select options
const mockCategories = [
  { id: 'cat1', name: 'Electronics' },
  { id: 'cat2', name: 'Office' },
  { id: 'cat3', name: 'Accessories' },
];

// Sample product data for edit mode
const sampleProduct = {
  id: 'P001',
  name: 'Wireless Mouse',
  description: 'High-precision wireless mouse',
  sku: 'WM-1234',
  category: 'cat1',
  price: 29.99,
  cost: 15.99,
  stock: 45,
  reorderPoint: 10,
};

describe('ProductForm Component', () => {
  it('renders in create mode correctly', () => {
    render(
      <ProductForm 
        onSubmit={mockSubmit} 
        categories={mockCategories} 
      />
    );
    
    // Check if form fields are empty
    expect(screen.getByLabelText(/product name/i).getAttribute('value')).toBe('');
    expect(screen.getByLabelText(/sku/i).getAttribute('value')).toBe('');
    
    // Check if submit button text
    expect(screen.getByRole('button', { name: /create product/i })).toBeInTheDocument();
  });

  it('renders in edit mode correctly with product data', () => {
    render(
      <ProductForm 
        onSubmit={mockSubmit} 
        categories={mockCategories} 
        product={sampleProduct}
      />
    );
    
    // Check if form fields are pre-filled
    expect(screen.getByLabelText(/product name/i).getAttribute('value')).toBe(sampleProduct.name);
    expect(screen.getByLabelText(/sku/i).getAttribute('value')).toBe(sampleProduct.sku);
    
    // Check if submit button says "Update Product"
    expect(screen.getByRole('button', { name: /update product/i })).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', () => {
    render(
      <ProductForm 
        onSubmit={mockSubmit} 
        categories={mockCategories} 
      />
    );
    
    // Fill out all required fields for validation to pass
    fireEvent.change(screen.getByLabelText(/product name/i), { 
      target: { value: 'Test Product' } 
    });
    fireEvent.change(screen.getByLabelText(/sku/i), { 
      target: { value: 'TST-1234' } 
    });
    // Price is also required
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '19.99' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create product/i }));
    
    // Check if onSubmit was called
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the form when isSubmitting is true', () => {
    render(
      <ProductForm 
        onSubmit={mockSubmit} 
        categories={mockCategories} 
        isSubmitting={true}
      />
    );
    
    // Check if form elements are disabled and button text
    expect(screen.getByLabelText(/product name/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /processing/i })).toBeDisabled();
  });
});