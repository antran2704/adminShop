import { ICancelOrder, ISearchOrder } from "~/interface/order";
import httpConfig from "~/configs/configAxios";
import { ENUM_ORDER_STATUS, ENUM_PAYMENT_STATUS } from "~/enums/order";
import { parseQueryString } from "~/helper/url";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getOrders = async (paramater: ISearchOrder) => {
  const parseParameters = parseQueryString(paramater);

  return await httpConfig
    .get(BASE_URL + `/admin/orders?${parseParameters}`)
    .then((res) => res.data);
};

const countOrders = async (orderStatus: ENUM_ORDER_STATUS) => {
  return await httpConfig
    .get(BASE_URL + `/admin/orders/count?order_status=${orderStatus}`)
    .then((res) => res.data);
};

const getOrder = async (order_id: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/orders/${order_id}`)
    .then((res) => res.data);
};

const updateStatusOrder = async (
  order_id: string,
  status: ENUM_ORDER_STATUS,
) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/orders/${order_id}/status`, {
      status,
    })
    .then((res) => res.data);
};

const cancelOrder = async (order_id: string, data: ICancelOrder) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/orders/${order_id}/cancel`, data)
    .then((res) => res.data);
};

const updatePaymentStatusOrder = async (
  order_id: string,
  status: ENUM_PAYMENT_STATUS,
) => {
  return await httpConfig
    .patch(BASE_URL + `/orders/payment_status/${order_id}`, {
      payment_status: status,
    })
    .then((res) => res.data);
};

export {
  getOrders,
  countOrders,
  getOrder,
  updateStatusOrder,
  updatePaymentStatusOrder,
  cancelOrder,
};
