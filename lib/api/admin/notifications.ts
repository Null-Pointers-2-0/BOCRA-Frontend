import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  Notification,
  UnreadCount,
  NotificationListParams,
} from "../types/notifications";

export async function getNotifications(
  params?: NotificationListParams
): Promise<ApiResponse<PaginatedData<Notification>>> {
  return apiClient<PaginatedData<Notification>>("/notifications/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getUnreadCount(): Promise<ApiResponse<UnreadCount>> {
  return apiClient<UnreadCount>("/notifications/unread-count/");
}

export async function markAsRead(
  id: string
): Promise<ApiResponse<Notification>> {
  return apiClient<Notification>(`/notifications/${id}/read/`, {
    method: "PATCH",
  });
}

export async function markAllAsRead(): Promise<ApiResponse<null>> {
  return apiClient<null>("/notifications/read-all/", { method: "POST" });
}
