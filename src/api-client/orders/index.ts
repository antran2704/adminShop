import { PaymentStatus } from "~/enums";
import { IFilter } from "~/interface";
import { IOrderCancle, statusOrder } from "~/interface/order";
import { axiosGet, axiosPatch } from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getOrders = async (page: number = 1) => {
  return await axiosGet(BASE_URL + `/orders?page=${page}`);
};

const getOrdersWithFilter = async (
  filter: IFilter | null,
  page: number = 1
) => {
  return await axiosGet(
    BASE_URL + `${process.env.NEXT_PUBLIC_ENDPOINT_API}/orders/search?search=${
      filter?.search || ""
    }&status=${filter?.status || ""}&payment_method=${
      filter?.payment_method || ""
    }&start_date=${filter?.start_date || ""}&end_date=${
      filter?.end_date || ""
    }&page=${page}`
  );
};

const getOrder = async (order_id: string) => {
  return await axiosGet(BASE_URL + `/orders/order_id/${order_id}`);
};

const updateOrder = async (
  order_id: string,
  status: statusOrder,
  options?: Partial<IOrderCancle>
) => {
  return await axiosPatch(BASE_URL + `/orders/status/${order_id}`, {
    status,
    ...options,
  });
};

const updatePaymentStatusOrder = async (
  order_id: string,
  status: PaymentStatus,
  options?: Partial<IOrderCancle>
) => {
  return await axiosPatch(BASE_URL + `/orders/payment_status/${order_id}`, {
    payment_status: status,
    ...options
  });
};

export { getOrders, getOrdersWithFilter, getOrder, updateOrder, updatePaymentStatusOrder };
