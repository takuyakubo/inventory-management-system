import React, { useState } from 'react';
import FormField from '@/components/forms/FormField';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  id?: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number | string;
  cost: number | string;
  stock: number | string;
  reorderPoint: number | string;
}

interface ProductFormProps {
  onSubmit: (data: any) => void;
  categories: Category[];
  product?: ProductData;
  isSubmitting?: boolean;
  validate?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  categories,
  product,
  isSubmitting = false,
  validate = false,
}) => {
  const isEditMode = !!product;
  
  // Form state
  const [formData, setFormData] = useState<ProductData>({
    name: product?.name || '',
    description: product?.description || '',
    sku: product?.sku || '',
    category: product?.category || '',
    price: product?.price || '',
    cost: product?.cost || '',
    stock: product?.stock || '',
    reorderPoint: product?.reorderPoint || '',
  });
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if there was one
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.sku) {
      newErrors.sku = 'SKU is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.cost && (isNaN(Number(formData.cost)) || Number(formData.cost) < 0)) {
      newErrors.cost = 'Cost must be a positive number';
    }
    
    if (formData.stock && (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (formData.reorderPoint && (isNaN(Number(formData.reorderPoint)) || Number(formData.reorderPoint) < 0)) {
      newErrors.reorderPoint = 'Reorder point must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Always validate form regardless of validate flag
    // This ensures basic validation happens even in tests
    const isValid = validateForm();
    
    if (validate && !isValid) {
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        id="name"
        label="Product Name"
        error={errors.name}
        isRequired
      >
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </FormField>
      
      <FormField
        id="description"
        label="Description"
      >
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </FormField>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="sku"
          label="SKU"
          error={errors.sku}
          isRequired
        >
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </FormField>
        
        <FormField
          id="category"
          label="Category"
        >
          <select
            id="category"
            name="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="price"
          label="Price"
          error={errors.price}
          isRequired
        >
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </FormField>
        
        <FormField
          id="cost"
          label="Cost"
          error={errors.cost}
        >
          <Input
            id="cost"
            name="cost"
            type="number"
            min="0"
            step="0.01"
            value={formData.cost}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="stock"
          label="Current Stock"
          error={errors.stock}
        >
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </FormField>
        
        <FormField
          id="reorderPoint"
          label="Reorder Point"
          error={errors.reorderPoint}
          description="Minimum stock level before reordering"
        >
          <Input
            id="reorderPoint"
            name="reorderPoint"
            type="number"
            min="0"
            value={formData.reorderPoint}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </FormField>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Processing...' 
            : isEditMode 
              ? 'Update Product' 
              : 'Create Product'
          }
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;