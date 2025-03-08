import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormField from '@/components/forms/FormField';
import Input from '@/components/ui/Input';

describe('FormField Component', () => {
  it('renders input with label correctly', () => {
    render(
      <FormField
        id="name"
        label="Full Name"
      >
        <Input id="name" name="name" />
      </FormField>
    );
    
    const label = screen.getByText('Full Name');
    const input = screen.getByRole('textbox');
    
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(
      <FormField
        id="email"
        label="Email Address"
        error="Invalid email format"
      >
        <Input id="email" name="email" />
      </FormField>
    );
    
    const errorMessage = screen.getByText('Invalid email format');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders with required indicator when isRequired is true', () => {
    render(
      <FormField
        id="username"
        label="Username"
        isRequired
      >
        <Input id="username" name="username" />
      </FormField>
    );
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  it('renders with description when provided', () => {
    render(
      <FormField
        id="password"
        label="Password"
        description="Password must be at least 8 characters"
      >
        <Input id="password" name="password" type="password" />
      </FormField>
    );
    
    const description = screen.getByText('Password must be at least 8 characters');
    expect(description).toBeInTheDocument();
  });

  it('renders children components correctly', () => {
    render(
      <FormField
        id="test"
        label="Test Field"
      >
        <div data-testid="test-child">Child component</div>
      </FormField>
    );
    
    const child = screen.getByTestId('test-child');
    expect(child).toBeInTheDocument();
  });
});