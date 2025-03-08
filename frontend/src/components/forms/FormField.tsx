import React from 'react';

interface FormFieldProps {
  id: string;
  label?: string;
  error?: string;
  description?: string;
  isRequired?: boolean;
  children: React.ReactNode;
}

const FormField = ({
  id,
  label,
  error,
  description,
  isRequired = false,
  children,
}: FormFieldProps) => {
  return (
    <div className="space-y-2 mb-4">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;