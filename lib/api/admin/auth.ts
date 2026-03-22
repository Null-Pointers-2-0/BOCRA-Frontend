import { apiClient, setTokens, clearTokens } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  User,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  ProfileUpdateRequest,
} from "../types/auth";

export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const res = await apiClient<LoginResponse>("/accounts/login/", {
    method: "POST",
    body: data,
  });
  if (res.success && res.data?.access) {
    setTokens(res.data.access, res.data.refresh);
  }
  return res;
}

export async function logout(): Promise<ApiResponse<null>> {
  const res = await apiClient<null>("/accounts/logout/", { method: "POST" });
  clearTokens();
  return res;
}

export async function getProfile(): Promise<ApiResponse<User>> {
  return apiClient<User>("/accounts/profile/");
}

export async function updateProfile(
  data: ProfileUpdateRequest
): Promise<ApiResponse<User>> {
  return apiClient<User>("/accounts/profile/", {
    method: "PATCH",
    body: data,
  });
}

export async function changePassword(
  data: PasswordChangeRequest
): Promise<ApiResponse<null>> {
  return apiClient<null>("/accounts/change-password/", {
    method: "POST",
    body: data,
  });
}
