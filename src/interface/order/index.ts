import { ICoupon } from "../coupon";
import { IProductData } from "../product";

export enum statusOrder {
  pending = "pending",
  success = "success",
  cancle = "cancle",
}

interface IItemOrder {
  _id: string;
  product_id: string;
  name: string;
  options: string[];
  thumbnail: string | null;
  promotion_price: number;
  price: number;
  quantity: number;
  linkProduct: string;
}

type ICouponOrder = Pick<ICoupon, "discount_name" | "discount_code">;

interface IUserInfor {
  email: string;
  name: string;
  address: string;
  phoneNumber: string;
}

interface IOrder {
  _id: string;
  user_infor: IUserInfor;
  items: IItemOrder[];
  shipping_cost: number;
  sub_total: number;
  total: number;
  discount_codes: ICouponOrder[];
  status: statusOrder;
  cancleContent?: string;
  note?: string;
  createdAt: string;
}

export type { IItemOrder, IOrder };
