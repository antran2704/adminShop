import qs from "qs";

import { IQueryParam, INotificationItem } from "~/interface";
import { axiosGet, axiosPatch } from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getNotifications = async (page: number = 1, limit: number = 6) => {
  return await axiosGet(
    BASE_URL + `/notifications/admin/home?page=${page}&limit=${limit}`
  );
};

const getNotificationsWithPage = async (
  page: number = 1,
  limit: number = 6,
  query?: IQueryParam<Partial<INotificationItem>>
) => {
  const parseQuery = qs.stringify(query);
  return await axiosGet(
    BASE_URL + `/notifications/admin?page=${page}&limit=${limit}&${parseQuery}`
  );
};

const updateNotification = async (
  notification_id: string,
  data: Partial<INotificationItem>
) => {
  return await axiosPatch(BASE_URL + `/notifications/admin/${notification_id}`, data);
};

export { getNotifications, getNotificationsWithPage, updateNotification };
