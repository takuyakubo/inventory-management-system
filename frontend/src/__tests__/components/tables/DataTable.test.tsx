import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTable from '@/components/tables/DataTable';

// テスト用データ
const testColumns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Stock', accessor: 'stock' },
  { header: 'Price', accessor: 'price', formatter: (value: number) => `$${value.toFixed(2)}` },
];

const testData = [
  { id: 1, name: 'Product A', stock: 10, price: 25.99 },
  { id: 2, name: 'Product B', stock: 5, price: 39.99 },
  { id: 3, name: 'Product C', stock: 20, price: 15.50 },
  { id: 4, name: 'Product D', stock: 0, price: 99.00 },
];

describe('DataTable Component', () => {
  it('renders column headers correctly', () => {
    render(<DataTable columns={testColumns} data={testData} />);
    
    testColumns.forEach(column => {
      const header = screen.getByText(column.header);
      expect(header).toBeInTheDocument();
    });
  });

  it('renders rows correctly', () => {
    render(<DataTable columns={testColumns} data={testData} />);
    
    testData.forEach(row => {
      const nameCell = screen.getByText(row.name);
      expect(nameCell).toBeInTheDocument();
      
      const stockCell = screen.getByText(row.stock.toString());
      expect(stockCell).toBeInTheDocument();
    });
  });

  it('formats cell values using formatter function', () => {
    render(<DataTable columns={testColumns} data={testData} />);
    
    testData.forEach(row => {
      const formattedPrice = `$${row.price.toFixed(2)}`;
      const priceCell = screen.getByText(formattedPrice);
      expect(priceCell).toBeInTheDocument();
    });
  });

  it('renders empty state message when no data is provided', () => {
    render(<DataTable columns={testColumns} data={[]} emptyMessage="No data available" />);
    
    const emptyMessage = screen.getByText('No data available');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('highlights rows when rowHighlighter function returns true', () => {
    const highlighter = (row: any) => row.stock === 0;
    
    render(
      <DataTable 
        columns={testColumns} 
        data={testData} 
        rowHighlighter={highlighter}
        highlightClass="bg-red-100"
      />
    );
    
    // Find the cell with "Product D" (the one with 0 stock)
    const outOfStockCell = screen.getByText('Product D');
    // Get the parent row
    const row = outOfStockCell.closest('tr');
    
    expect(row).toHaveClass('bg-red-100');
  });

  it('calls onRowClick when a row is clicked', () => {
    const handleRowClick = jest.fn();
    
    render(
      <DataTable 
        columns={testColumns} 
        data={testData} 
        onRowClick={handleRowClick} 
      />
    );
    
    const row = screen.getByText('Product A').closest('tr');
    fireEvent.click(row as HTMLElement);
    
    expect(handleRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('applies zebra striping when zebraStriping is true', () => {
    render(
      <DataTable 
        columns={testColumns} 
        data={testData} 
        zebraStriping
      />
    );
    
    const rows = screen.getAllByRole('row').slice(1); // Skip header row
    
    // Even rows should have the zebra striping class
    expect(rows[1]).toHaveClass('bg-gray-50');
    expect(rows[3]).toHaveClass('bg-gray-50');
    
    // Odd rows should not have the class
    expect(rows[0]).not.toHaveClass('bg-gray-50');
    expect(rows[2]).not.toHaveClass('bg-gray-50');
  });
});