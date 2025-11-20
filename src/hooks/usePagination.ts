import { useState } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialSize?: number;
}

interface UsePaginationReturn {
  page: number;
  size: number;
  total: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setTotal: (total: number) => void;
  handlePageChange: (newPage: number) => void;
  offset: number;
  reset: () => void;
}

export function usePagination(
  initialPageOrOptions: number | UsePaginationOptions = 1,
  initialSize: number = 20
): UsePaginationReturn {
  // Suportar ambos formatos: usePagination(1, 20) ou usePagination({ initialPage: 1, initialSize: 20 })
  let initialPage = 1;
  let size = initialSize;

  if (typeof initialPageOrOptions === 'object') {
    initialPage = initialPageOrOptions.initialPage || 1;
    size = initialPageOrOptions.initialSize || 20;
  } else {
    initialPage = initialPageOrOptions;
  }

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(size);
  const [total, setTotal] = useState(0);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const reset = () => {
    setPage(initialPage);
  };

  return {
    page,
    size: pageSize,
    total,
    setPage,
    setSize: setPageSize,
    setTotal,
    handlePageChange,
    offset: (page - 1) * pageSize,
    reset,
  };
}
