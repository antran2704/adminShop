import { IFilter } from "~/interface";
import { IOrderCancle, statusOrder } from "~/interface/order";
import { axiosGet, axiosPatch } from "~/ultils/configAxios";

const getOrders = async (page: number = 1) => {
  return await axiosGet(`/orders?page=${page}`);
};

const getOrdersWithFilter = async (
  filter: IFilter | null,
  page: number = 1
) => {
  return await axiosGet(
    `${process.env.NEXT_PUBLIC_ENDPOINT_API}/orders/search?search=${
      filter?.search || ""
    }&status=${filter?.status || ""}&payment_method=${
      filter?.payment_method || ""
    }&start_date=${filter?.start_date || ""}&end_date=${
      filter?.end_date || ""
    }&page=${page}`
  );
};

const getOrder = async (order_id: string) => {
  return await axiosGet(`/orders/${order_id}`);
};

const updateOrder = async (
  order_id: string,
  status: statusOrder,
  options?: Partial<IOrderCancle>
) => {
  return await axiosPatch(`orders/status/${order_id}`, {
    status,
    ...options,
  });
};

export { getOrders, getOrdersWithFilter, getOrder, updateOrder };
