import { NotitficationType } from "~/enums";

interface INotificationItem {
  _id: string;
  content: string;
  type: NotitficationType;
  path: string | null;
  isReaded: boolean;
  createdAt: string;
}

interface TagNotification {
  title: string;
  value: "" | NotitficationType;
}

interface INotification {
  notifications: INotificationItem[];
  total: number;
  totalUnread: number;
}

export type { INotificationItem, INotification, TagNotification };
