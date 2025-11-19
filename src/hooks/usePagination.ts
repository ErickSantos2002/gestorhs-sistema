import { useState } from 'react';

interface UsePaginationReturn {
  page: number;
  size: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  offset: number;
  reset: () => void;
}

export function usePagination(
  initialPage: number = 1,
  initialSize: number = 20
): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const reset = () => {
    setPage(initialPage);
  };

  return {
    page,
    size,
    setPage,
    setSize,
    offset: (page - 1) * size,
    reset,
  };
}
