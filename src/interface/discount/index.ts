import { ENUM_DISCOUNT_TYPE, ENUM_DISCOUNT_APPLIES } from "~/enums/discount";

interface IDiscount {
  _id: string;
  discount_name: string;
  discount_code: string;
  discount_value: number;
  discount_applies: ENUM_DISCOUNT_APPLIES;
  discount_type: ENUM_DISCOUNT_TYPE;
  discount_product_ids: string[];
  discount_start_date: string;
  discount_end_date: string;
  discount_max_uses: number;
  discount_used_count: number;
  discount_user_used: string[];
  discount_per_user: number;
  discount_min_value: number;
  discount_thumbnail: string;
  discount_active: boolean;
  discount_public: boolean;
}

interface ICreateDiscount {
  discount_name: string;
  discount_code: string;
  discount_value: number;
  discount_applies: ENUM_DISCOUNT_APPLIES;
  discount_type: ENUM_DISCOUNT_TYPE;
  discount_product_ids: string[];
  discount_start_date: string;
  discount_end_date: string;
  discount_max_uses: number;
  discount_per_user: number;
  discount_min_value: number;
  discount_thumbnail: string | null;
  discount_active: boolean;
  discount_public: boolean;
}

interface IDiscountTable {
  key: string;
  id: string;
  name: string;
  code: string;
  thumbnail: string;
  type: ENUM_DISCOUNT_TYPE;
  value: number;
  active: boolean;
  public: boolean;
  startDate: string;
  endDate: string;
}

export type { IDiscount, ICreateDiscount, IDiscountTable };
