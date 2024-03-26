import { PaymentStatus } from "~/enums";
import { ICoupon } from "../coupon";
import { IProductData, IVariantProduct } from "../product";

export enum statusOrder {
  pending = "pending",
  processing = "processing",
  delivered = "delivered",
  cancle = "cancle",
}

interface IItemOrder {
  _id: string;
  product: Partial<IProductData>;
  variation: Partial<IVariantProduct>;
  // options: string[];
  promotion_price: number;
  price: number;
  quantity: number;
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
  order_id: string;
  user_infor: IUserInfor;
  items: IItemOrder[];
  shipping_cost: number;
  sub_total: number;
  total: number;
  discount: Partial<ICoupon>;
  status: statusOrder;
  payment_method: string;
  payment_status: PaymentStatus;
  cancleContent?: string | null;
  note?: string | null;
  createdAt: string;
}

type IOrderCancle = Pick<IOrder, "note" | "cancleContent">;

export type { IItemOrder, IOrder, IOrderCancle };
