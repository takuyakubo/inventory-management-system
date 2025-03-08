import React from 'react';

export interface Column<T = any> {
  header: string;
  accessor: keyof T;
  formatter?: (value: any) => React.ReactNode;
}

interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  rowHighlighter?: (row: T) => boolean;
  highlightClass?: string;
  onRowClick?: (row: T) => void;
  zebraStriping?: boolean;
  className?: string;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = 'No data available',
  rowHighlighter,
  highlightClass = 'bg-red-100',
  onRowClick,
  zebraStriping = false,
  className = '',
}: DataTableProps<T>) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const isHighlighted = rowHighlighter ? rowHighlighter(row) : false;
              const isEven = rowIndex % 2 === 1;
              const rowClasses = [
                isHighlighted ? highlightClass : '',
                zebraStriping && isEven ? 'bg-gray-50' : '',
                onRowClick ? 'cursor-pointer hover:bg-gray-100' : '',
              ].filter(Boolean).join(' ');

              return (
                <tr
                  key={rowIndex}
                  className={rowClasses}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column, colIndex) => {
                    const value = row[column.accessor];
                    const displayValue = column.formatter ? column.formatter(value) : value;

                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;