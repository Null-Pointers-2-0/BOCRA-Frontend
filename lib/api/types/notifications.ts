import type { NotificationType } from "./common";

export type Notification = {
  id: string;
  recipient: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  status: "PENDING" | "SENT" | "READ" | "FAILED";
  related_object_type: string | null;
  related_object_id: string | null;
  created_at: string;
};

export type UnreadCount = {
  count: number;
};

export type NotificationListParams = {
  is_read?: boolean;
  page?: number;
};
