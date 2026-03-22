import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  StaffApplicationListItem,
  StaffApplicationDetail,
  StatusUpdateRequest,
  StaffApplicationListParams,
} from "../types/licensing";

export async function getApplications(
  params?: StaffApplicationListParams
): Promise<ApiResponse<PaginatedData<StaffApplicationListItem>>> {
  return apiClient<PaginatedData<StaffApplicationListItem>>(
    "/licensing/staff/applications/",
    { params: params as Record<string, string | number | boolean | undefined> }
  );
}

export async function getApplication(
  id: string
): Promise<ApiResponse<StaffApplicationDetail>> {
  return apiClient<StaffApplicationDetail>(
    `/licensing/staff/applications/${id}/`
  );
}

export async function updateApplicationStatus(
  id: string,
  data: StatusUpdateRequest
): Promise<ApiResponse<StaffApplicationDetail>> {
  return apiClient<StaffApplicationDetail>(
    `/licensing/applications/${id}/status/`,
    { method: "PATCH", body: data }
  );
}
