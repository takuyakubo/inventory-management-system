import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label?: string;
  error?: string;
  className?: string;
}

const Input = ({
  id,
  name,
  label,
  error,
  className = '',
  disabled = false,
  required = false,
  ...props
}: InputProps) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        className={inputClasses}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;