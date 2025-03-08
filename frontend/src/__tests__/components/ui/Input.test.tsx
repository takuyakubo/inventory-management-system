import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '@/components/ui/Input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input id="test" name="test" />);
    const input = screen.getByRole('textbox');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test');
    expect(input).toHaveAttribute('name', 'test');
    expect(input).not.toBeDisabled();
  });

  it('renders with a label when label prop is provided', () => {
    render(<Input id="test" name="test" label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test');
  });

  it('renders with error state when error prop is provided', () => {
    render(<Input id="test" name="test" error="This field is required" />);
    
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('This field is required');
    
    expect(input).toHaveClass('border-red-500');
    expect(errorMessage).toBeInTheDocument();
  });

  it('calls onChange handler when typing', () => {
    const handleChange = jest.fn();
    render(<Input id="test" name="test" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Input id="test" name="test" disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies placeholder text correctly', () => {
    render(<Input id="test" name="test" placeholder="Enter text here" />);
    
    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Input id="test" name="test" className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('renders with a required attribute when required prop is true', () => {
    render(<Input id="test" name="test" required />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
  });
});