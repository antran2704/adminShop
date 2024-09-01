import qs from "qs";

import { IFilter } from "~/interface";
import { ISearchOrder, statusOrder } from "~/interface/order";
import httpConfig from "~/configs/configAxios";
import { ENUM_ORDER_STATUS, ENUM_PAYMENT_STATUS } from "~/enums/order";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getOrders = async (paramater: ISearchOrder) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await httpConfig
    .get(BASE_URL + `/admin/orders?${parseParameters}`)
    .then((res) => res.data);
};

const countOrders = async (orderStatus: ENUM_ORDER_STATUS) => {
  return await httpConfig
    .get(BASE_URL + `/admin/orders/count?order_status=${orderStatus}`)
    .then((res) => res.data);
};

const getOrdersWithFilter = async (
  filter: IFilter | null,
  page: number = 1,
) => {
  return await httpConfig.get(
    BASE_URL +
      `${process.env.NEXT_PUBLIC_ENDPOINT_API}/orders/search?search=${
        filter?.search || ""
      }&status=${filter?.status || ""}&payment_method=${
        filter?.payment_method || ""
      }&start_date=${filter?.start_date || ""}&end_date=${
        filter?.end_date || ""
      }&page=${page}`,
  );
};

const getOrder = async (order_id: string) => {
  return await httpConfig.get(BASE_URL + `/orders/order_id/${order_id}`);
};

const updateOrder = async (
  order_id: string,
  status: statusOrder,
  // options?: Partial<IOrderCancle>,
) => {
  return await httpConfig.patch(BASE_URL + `/orders/status/${order_id}`, {
    status,
    // ...options,
  });
};

const updatePaymentStatusOrder = async (
  order_id: string,
  status: ENUM_PAYMENT_STATUS,
) => {
  return await httpConfig.patch(
    BASE_URL + `/orders/payment_status/${order_id}`,
    {
      payment_status: status,
    },
  );
};

export {
  getOrders,
  countOrders,
  getOrdersWithFilter,
  getOrder,
  updateOrder,
  updatePaymentStatusOrder,
};
