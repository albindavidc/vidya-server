export interface PaginationParamsInterface {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResultInterface<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
