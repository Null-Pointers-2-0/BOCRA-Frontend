import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  ComplaintListItem,
  ComplaintDetail,
  ComplaintTrack,
  ComplaintCategoryOption,
  ComplaintCreateRequest,
  ComplaintDocument,
} from "../types/complaints";

// ── Public ──
export async function getCategories(): Promise<
  ApiResponse<ComplaintCategoryOption[]>
> {
  return apiClient<ComplaintCategoryOption[]>("/complaints/categories/");
}

export async function submitComplaint(
  data: ComplaintCreateRequest
): Promise<ApiResponse<ComplaintDetail>> {
  return apiClient<ComplaintDetail>("/complaints/submit/", {
    method: "POST",
    body: data,
  });
}

export async function trackComplaint(
  referenceNumber: string
): Promise<ApiResponse<ComplaintTrack>> {
  return apiClient<ComplaintTrack>("/complaints/track/", {
    params: { reference: referenceNumber },
  });
}

// ── Authenticated complainant ──
export async function getMyComplaints(
  params?: { page?: number }
): Promise<ApiResponse<PaginatedData<ComplaintListItem>>> {
  return apiClient<PaginatedData<ComplaintListItem>>("/complaints/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getMyComplaint(
  id: string
): Promise<ApiResponse<ComplaintDetail>> {
  return apiClient<ComplaintDetail>(`/complaints/${id}/`);
}

export async function uploadComplaintDocument(
  complaintId: string,
  data: { name: string; file: File }
): Promise<ApiResponse<ComplaintDocument>> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("file", data.file);
  return apiClient<ComplaintDocument>(
    `/complaints/${complaintId}/documents/`,
    { method: "POST", body: formData, isFormData: true }
  );
}
