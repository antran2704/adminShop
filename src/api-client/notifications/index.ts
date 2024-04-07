import qs from "qs";

import { IQueryParam, INotificationItem } from "~/interface";
import { axiosGet, axiosPatch } from "~/ultils/configAxios";

const getNotifications = async (page: number = 1, limit: number = 6) => {
  return await axiosGet(
    `/notifications/admin/home?page=${page}&limit=${limit}`
  );
};

const getNotificationsWithPage = async (
  page: number = 1,
  limit: number = 6,
  query?: IQueryParam<Partial<INotificationItem>>
) => {
  const parseQuery = qs.stringify(query);
  return await axiosGet(
    `/notifications/admin?page=${page}&limit=${limit}&${parseQuery}`
  );
};

const updateNotification = async (
  notification_id: string,
  data: Partial<INotificationItem>
) => {
  return await axiosPatch(`/notifications/admin/${notification_id}`, data);
};

export { getNotifications, getNotificationsWithPage, updateNotification };
