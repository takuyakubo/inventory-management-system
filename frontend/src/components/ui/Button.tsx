import React, { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1 text-sm',
        lg: 'h-12 px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

const Button = ({
  children,
  className = '',
  variant,
  size,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;