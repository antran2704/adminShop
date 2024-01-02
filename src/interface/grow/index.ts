interface IGrow {
  gross: number;
  sub_gross: number;
  orders: number;
  delivered_orders: number;
  cancle_orders: number;
  updatedAt?: string | null;
}

interface IGrowDate extends IGrow {
  day?: string;
  month?: string;
  year?: string;
  date: string;
}

export type { IGrow, IGrowDate };
