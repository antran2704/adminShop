import {
  ORDER_STATUS_ENUM,
  PAYMENT_METHOD_ENUM,
  PAYMENT_STATUS_ENUM,
  PROCESS_ORDER_ENUM,
} from "~/enums";
import { ICoupon } from "../coupon";
import { IProductData, IVariantProduct } from "../product";
import { ISearch } from "../queryParams";

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

// interface IOrder {
//   _id: string;
//   order_id: string;
//   user_infor: IUserInfor;
//   items: IItemOrder[];
//   shipping_cost: number;
//   sub_total: number;
//   total: number;
//   discount: Partial<ICoupon>;
//   status: statusOrder;
//   payment_method: string;
//   payment_status: PaymentStatus;
//   cancleContent?: string | null;
//   note?: string | null;
//   createdAt: string;
// }

// type IOrderCancle = Pick<IOrder, "note" | "cancleContent">;

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
  product_id: string;
  model_id: string;
  image: string;
  model_name: string;
  price: number;
  promotion_price: number;
  quantity: number;
  _id: string;
}

interface ProcessingInfo {
  label: PROCESS_ORDER_ENUM;
  value: Date;
  _id: string;
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
  order_status: ORDER_STATUS_ENUM;
  sub_total: number;
  total_before_discount: number;
  total: number;
  discount: null;
  currency: string;
  payment_method: PAYMENT_METHOD_ENUM;
  payment_status: PAYMENT_STATUS_ENUM;
  cancel: Cancel;
  note: null;
  createdAt: string;
  updatedAt: string;
}

interface IOrderTable {
  key: string;
  orderId: string;
  customer: string;
  total: number;
  orderStatus: ORDER_STATUS_ENUM;
  paymentMethod: PAYMENT_METHOD_ENUM;
  createdAt: string;
}

interface ISearchOrder extends ISearch {
  paymentMethod?: PAYMENT_METHOD_ENUM;
  paymentStatus?: PAYMENT_STATUS_ENUM;
  orderStatus?: ORDER_STATUS_ENUM;
}

export type { IItemOrder, IOrder, ISearchOrder, IOrderTable };
