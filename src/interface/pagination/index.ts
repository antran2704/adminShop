interface IPagination {
  page: number;
  total: number;
  take: number;
  pageCount?: number;
}

export type { IPagination };
