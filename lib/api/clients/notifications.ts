import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type { Notification, UnreadCount } from "../types/notifications";

export async function getNotifications(): Promise<ApiResponse<Notification[]>> {
  return apiClient<Notification[]>("/notifications/");
}

export async function getUnreadCount(): Promise<ApiResponse<UnreadCount>> {
  return apiClient<UnreadCount>("/notifications/unread-count/");
}

export async function markAllRead(): Promise<ApiResponse<{ marked_read: number }>> {
  return apiClient<{ marked_read: number }>("/notifications/read-all/", {
    method: "PATCH",
  });
}

export async function markRead(id: string): Promise<ApiResponse<Notification>> {
  return apiClient<Notification>(`/notifications/${id}/read/`, {
    method: "PATCH",
  });
}

export async function dismissNotification(id: string): Promise<ApiResponse<null>> {
  return apiClient<null>(`/notifications/${id}/`, {
    method: "DELETE",
  });
}
