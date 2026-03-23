import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  StaffComplaintListItem,
  StaffComplaintDetail,
  ComplaintStatusUpdateRequest,
  ComplaintAssignRequest,
  ComplaintResolveRequest,
  CaseNoteCreateRequest,
  CaseNote,
  StaffComplaintListParams,
} from "../types/complaints";

export async function getComplaints(
  params?: StaffComplaintListParams
): Promise<ApiResponse<PaginatedData<StaffComplaintListItem>>> {
  return apiClient<PaginatedData<StaffComplaintListItem>>(
    "/complaints/staff/",
    { params: params as Record<string, string | number | boolean | undefined> }
  );
}

export async function getComplaint(
  id: string
): Promise<ApiResponse<StaffComplaintDetail>> {
  return apiClient<StaffComplaintDetail>(`/complaints/staff/${id}/`);
}

export async function assignComplaint(
  id: string,
  data: ComplaintAssignRequest
): Promise<ApiResponse<StaffComplaintDetail>> {
  return apiClient<StaffComplaintDetail>(`/complaints/${id}/assign/`, {
    method: "PATCH",
    body: data,
  });
}

export async function updateComplaintStatus(
  id: string,
  data: ComplaintStatusUpdateRequest
): Promise<ApiResponse<StaffComplaintDetail>> {
  return apiClient<StaffComplaintDetail>(`/complaints/${id}/status/`, {
    method: "PATCH",
    body: data,
  });
}

export async function addCaseNote(
  id: string,
  data: CaseNoteCreateRequest
): Promise<ApiResponse<CaseNote>> {
  return apiClient<CaseNote>(`/complaints/${id}/notes/`, {
    method: "POST",
    body: data,
  });
}

export async function resolveComplaint(
  id: string,
  data: ComplaintResolveRequest
): Promise<ApiResponse<StaffComplaintDetail>> {
  return apiClient<StaffComplaintDetail>(`/complaints/${id}/resolve/`, {
    method: "POST",
    body: data,
  });
}
