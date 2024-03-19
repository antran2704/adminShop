import { Notification } from "~/interface";
import { axiosGet, axiosPatch } from "~/ultils/configAxios";

const getNotifications = async (page: number = 1, limit: number = 6) => {
  return await axiosGet(`/notifications/admin?page=${page}&limit=${limit}`);
};

const updateNotification = async (
  notification_id: string,
  data: Partial<Notification>
) => {
  return await axiosPatch(`/notifications/admin/${notification_id}`, data);
};

export { getNotifications, updateNotification };
