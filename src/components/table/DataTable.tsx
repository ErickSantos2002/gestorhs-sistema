import React from 'react';
import { cn } from '@/utils';
import { Spinner, EmptyState } from '@/components/common';
import { Pagination } from './Pagination';

export interface Column<T> {
  key: string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface PaginationConfig {
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  pagination?: PaginationConfig;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading,
  pagination,
  emptyMessage = 'Nenhum registro encontrado',
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Nenhum resultado"
        message={emptyMessage}
      />
    );
  }

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.size)
    : 1;

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200',
                    column.width
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-gray-200 dark:border-gray-700 transition-colors',
                  onRowClick &&
                    'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render ? column.render(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
