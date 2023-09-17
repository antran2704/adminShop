export enum statusOrder {
  pending = "pending",
  success = "success",
  cancle = "cancle",
}

interface IItemOrder {
  product: string;
  price: number;
  quantity: number;
  linkProduct: string;
}

interface IOrder {
  _id: string;
  email: string;
  name: string;
  address: string;
  phoneNumber: string;
  items: IItemOrder[];
  total: number;
  status: statusOrder;
  cancleContent?: string;
  note?: string;
  createdAt: string;
}

export type { IItemOrder, IOrder };
