import {
  ENUM_ORDER_PROCESS,
  ENUM_ORDER_STATUS,
  ENUM_PAYMENT_METHOD,
  ENUM_PAYMENT_STATUS,
} from "~/enums/order";
import { ICoupon } from "../coupon";
import { ISearch } from "../queryParams";

export enum statusOrder {
  pending = "pending",
  processing = "processing",
  delivered = "delivered",
  cancle = "cancle",
}

type ICouponOrder = Pick<ICoupon, "discount_name" | "discount_code">;

interface Address {
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_email: string;
}

interface Cancel {
  canCancle: boolean;
  content: null;
}

interface Item {
  _id: string;
  product_id: string;
  model_id: string;
  image: string;
  model_name: string;
  price: number;
  promotion_price: number;
  quantity: number;
}

interface ProcessingInfo {
  _id: string;
  label: ENUM_ORDER_PROCESS;
  value: Date;
}

interface Shipping {
  shipping_name: string;
  shipping_fee: number;
}

interface IOrder {
  _id: string;
  order_id: string;
  address: Address;
  user_id: string;
  items: Item[];
  shipping: Shipping;
  processing_info: ProcessingInfo[];
  order_status: ENUM_ORDER_STATUS;
  sub_total: number;
  total_before_discount: number;
  total: number;
  discount: ICouponOrder;
  currency: string;
  payment_method: ENUM_PAYMENT_METHOD;
  payment_status: ENUM_PAYMENT_STATUS;
  cancel: Cancel;
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface IOrderTable {
  key: string;
  id: string;
  customer: string;
  total: number;
  orderStatus: ENUM_ORDER_STATUS;
  paymentMethod: ENUM_PAYMENT_METHOD;
  createdAt: string;
}

interface ISearchOrder extends ISearch {
  paymentMethod?: ENUM_PAYMENT_METHOD;
  paymentStatus?: ENUM_PAYMENT_STATUS;
  orderStatus?: ENUM_ORDER_STATUS;
}

export type { IOrder, ISearchOrder, IOrderTable };
