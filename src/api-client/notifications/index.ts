import qs from "qs";
import httpConfig from "~/configs/configAxios";

import { IQueryParam, INotificationItem } from "~/interface";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getNotifications = async (page: number = 1, limit: number = 6) => {
  return await httpConfig
    .get(BASE_URL + `/notifications/admin/home?page=${page}&limit=${limit}`)
    .then((res) => res.data);
};

const getNotificationsWithPage = async (
  page: number = 1,
  limit: number = 6,
  query?: IQueryParam<Partial<INotificationItem>>,
) => {
  const parseQuery = qs.stringify(query);
  return await httpConfig
    .get(
      BASE_URL +
        `/notifications/admin?page=${page}&limit=${limit}&${parseQuery}`,
    )
    .then((res) => res.data);
};

const updateNotification = async (
  notification_id: string,
  data: Partial<INotificationItem>,
) => {
  return await httpConfig
    .patch(BASE_URL + `/notifications/admin/${notification_id}`, data)
    .then((res) => res.data);
};

export { getNotifications, getNotificationsWithPage, updateNotification };
