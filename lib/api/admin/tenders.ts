import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  StaffTenderListItem,
  StaffTenderDetail,
  TenderCreateRequest,
  TenderUpdateRequest,
  TenderAwardCreateRequest,
  TenderAddendumCreateRequest,
  TenderDocumentUploadRequest,
  TenderDocument,
  TenderAddendum,
  TenderAward,
  StaffTenderListParams,
} from "../types/tenders";

export async function getTenders(
  params?: StaffTenderListParams
): Promise<ApiResponse<PaginatedData<StaffTenderListItem>>> {
  return apiClient<PaginatedData<StaffTenderListItem>>(
    "/tenders/staff/list/",
    { params: params as Record<string, string | number | boolean | undefined> }
  );
}

export async function getTender(
  id: string
): Promise<ApiResponse<StaffTenderDetail>> {
  return apiClient<StaffTenderDetail>(`/tenders/staff/${id}/`);
}

export async function createTender(
  data: TenderCreateRequest
): Promise<ApiResponse<StaffTenderDetail>> {
  return apiClient<StaffTenderDetail>("/tenders/staff/", {
    method: "POST",
    body: data,
  });
}

export async function updateTender(
  id: string,
  data: TenderUpdateRequest
): Promise<ApiResponse<StaffTenderDetail>> {
  return apiClient<StaffTenderDetail>(`/tenders/staff/${id}/edit/`, {
    method: "PATCH",
    body: data,
  });
}

export async function publishTender(
  id: string
): Promise<ApiResponse<StaffTenderDetail>> {
  return apiClient<StaffTenderDetail>(`/tenders/staff/${id}/publish/`, {
    method: "PATCH",
  });
}

export async function closeTender(
  id: string
): Promise<ApiResponse<StaffTenderDetail>> {
  return apiClient<StaffTenderDetail>(`/tenders/staff/${id}/close/`, {
    method: "PATCH",
  });
}

export async function awardTender(
  id: string,
  data: TenderAwardCreateRequest
): Promise<ApiResponse<TenderAward>> {
  return apiClient<TenderAward>(`/tenders/staff/${id}/award/`, {
    method: "POST",
    body: data,
  });
}

export async function uploadTenderDocument(
  id: string,
  data: TenderDocumentUploadRequest
): Promise<ApiResponse<TenderDocument>> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("file", data.file);
  return apiClient<TenderDocument>(`/tenders/staff/${id}/documents/`, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function addTenderAddendum(
  id: string,
  data: TenderAddendumCreateRequest
): Promise<ApiResponse<TenderAddendum>> {
  return apiClient<TenderAddendum>(`/tenders/staff/${id}/addenda/`, {
    method: "POST",
    body: data,
  });
}

export async function deleteTender(
  id: string
): Promise<ApiResponse<null>> {
  return apiClient<null>(`/tenders/staff/${id}/delete/`, {
    method: "DELETE",
  });
}
