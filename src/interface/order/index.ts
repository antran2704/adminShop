import {
  ENUM_ORDER_CANCEL,
  ENUM_ORDER_PROCESS,
  ENUM_ORDER_STATUS,
  ENUM_PAYMENT_METHOD,
  ENUM_PAYMENT_STATUS,
} from "~/enums/order";
import { IDiscount } from "../discount";
import { ISearch } from "../queryParams";

type ICouponOrder = Pick<
  IDiscount,
  "discount_name" | "discount_code" | "discount_type" | "discount_value"
>;

interface IAddressOrder {
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_email: string;
}

interface Cancel {
  canCancle: boolean;
  content: ENUM_ORDER_CANCEL | null;
  note: string | null;
}

interface IItemOrder {
  _id: string;
  product_id: string;
  model_id: string;
  image: string;
  model_name: string;
  price: number;
  promotion_price: number;
  quantity: number;
}

interface IProcessingOrder {
  _id: string;
  label: ENUM_ORDER_PROCESS;
  value: string;
}

interface Shipping {
  shipping_name: string;
  shipping_fee: number;
}

interface IOrder {
  _id: string;
  order_id: string;
  address: IAddressOrder;
  user_id: string;
  items: IItemOrder[];
  shipping: Shipping;
  processing_info: IProcessingOrder[];
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

interface IOrderDetailTable {
  key: string;
  id: string;
  orderNumber: number;
  productName: string;
  thumbnail: string;
  price: number;
  promotionPrice: number;
  quantity: number;
  total: number;
}

interface ICancelOrder {
  status: ENUM_ORDER_STATUS;
  optionCancel: ENUM_ORDER_CANCEL;
  note: string | null;
}

interface ISearchOrder extends ISearch {
  paymentMethod?: ENUM_PAYMENT_METHOD;
  paymentStatus?: ENUM_PAYMENT_STATUS;
  orderStatus?: ENUM_ORDER_STATUS;
}

export type {
  IOrder,
  ISearchOrder,
  IOrderTable,
  IOrderDetailTable,
  IItemOrder,
  IAddressOrder,
  IProcessingOrder,
  ICancelOrder,
};
