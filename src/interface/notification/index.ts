import { NotitficationType } from "~/enums";

interface NotificationItem {
  _id: string;
  content: string;
  type: NotitficationType;
  path: string | null;
  isReaded: boolean;
  createdAt: string;
}

interface Notification {
  notifications: NotificationItem[];
  total: number;
  totalUnread: number;
}

export type { NotificationItem, Notification };
