import { EDicount_type, EDiscount_applies } from "~/enums";

interface ICoupon {
  _id: string;
  discount_name: string;
  discount_code: string;
  discount_value: number;
  discount_applies: EDiscount_applies;
  discount_type: EDicount_type;
  discount_product_ids: string[];
  discount_start_date: string;
  discount_end_date: string;
  discount_max_uses: number;
  discount_used_count: number;
  discount_user_used: string[];
  discount_per_user: number;
  discount_min_value: number;
  discount_thumbnail: string | null;
  discount_active: boolean;
  discount_public: boolean;
}

type ICouponCreate = Omit<ICoupon, "_id" | "discount_used_count" | "discount_user_used">

type ICouponHome = Omit<
  ICoupon,
  | "discount_applies"
  | "discount_product_ids"
  | "discount_max_uses"
  | "discount_used_count"
  | "discount_user_used"
  | "discount_per_user"
  | "discount_min_value"
>;

export type { ICoupon, ICouponHome, ICouponCreate };
