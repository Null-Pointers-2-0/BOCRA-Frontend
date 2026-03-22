import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  User,
  UserListItem,
  AdminUserUpdateRequest,
  UserListParams,
} from "../types/auth";

export async function getUsers(
  params?: UserListParams
): Promise<ApiResponse<PaginatedData<UserListItem>>> {
  return apiClient<PaginatedData<UserListItem>>("/accounts/users/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getUser(id: string): Promise<ApiResponse<User>> {
  return apiClient<User>(`/accounts/users/${id}/`);
}

export async function updateUser(
  id: string,
  data: AdminUserUpdateRequest
): Promise<ApiResponse<User>> {
  return apiClient<User>(`/accounts/users/${id}/`, {
    method: "PATCH",
    body: data,
  });
}
