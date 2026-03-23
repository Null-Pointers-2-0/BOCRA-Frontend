import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  StaffPublicationListItem,
  StaffPublicationDetail,
  PublicationCreateRequest,
  PublicationUpdateRequest,
  StaffPublicationListParams,
} from "../types/publications";

export async function getPublications(
  params?: StaffPublicationListParams
): Promise<ApiResponse<PaginatedData<StaffPublicationListItem>>> {
  return apiClient<PaginatedData<StaffPublicationListItem>>(
    "/publications/staff/",
    { params: params as Record<string, string | number | boolean | undefined> }
  );
}

export async function getPublication(
  id: string
): Promise<ApiResponse<StaffPublicationDetail>> {
  return apiClient<StaffPublicationDetail>(`/publications/staff/${id}/`);
}

export async function createPublication(
  data: PublicationCreateRequest
): Promise<ApiResponse<StaffPublicationDetail>> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });
  return apiClient<StaffPublicationDetail>("/publications/staff/", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function updatePublication(
  id: string,
  data: PublicationUpdateRequest
): Promise<ApiResponse<StaffPublicationDetail>> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });
  return apiClient<StaffPublicationDetail>(
    `/publications/staff/${id}/edit/`,
    { method: "PATCH", body: formData, isFormData: true }
  );
}

export async function publishPublication(
  id: string
): Promise<ApiResponse<StaffPublicationDetail>> {
  return apiClient<StaffPublicationDetail>(
    `/publications/staff/${id}/publish/`,
    { method: "PATCH" }
  );
}

export async function archivePublication(
  id: string
): Promise<ApiResponse<StaffPublicationDetail>> {
  return apiClient<StaffPublicationDetail>(
    `/publications/staff/${id}/archive/`,
    { method: "PATCH" }
  );
}

export async function deletePublication(
  id: string
): Promise<ApiResponse<null>> {
  return apiClient<null>(`/publications/staff/${id}/delete/`, {
    method: "DELETE",
  });
}
