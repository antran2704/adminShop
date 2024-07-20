interface IGross {
  total_gross: number;
  sub_gross: number;
  orders: number;
  delivered_orders: number;
  cancel_orders: number;
  updatedAt?: string | null;
}

export type { IGross };
