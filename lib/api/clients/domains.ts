import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  DomainZone,
  DomainAvailability,
  DomainWhois,
  DomainApplicationCreateRequest,
  DomainApplicationUpdateRequest,
  DomainApplicationListItem,
  DomainApplicationDetail,
  DomainApplicationDocument,
  DomainListItem,
  DomainDetail,
} from "../types/domains";

// ── Public ──
export async function getDomainZones(): Promise<ApiResponse<DomainZone[]>> {
  return apiClient<DomainZone[]>("/domains/zones/");
}

export async function checkDomainAvailability(
  name: string
): Promise<ApiResponse<DomainAvailability>> {
  return apiClient<DomainAvailability>("/domains/check/", {
    params: { name },
  });
}

export async function whoisLookup(
  name: string
): Promise<ApiResponse<DomainWhois>> {
  return apiClient<DomainWhois>("/domains/whois/", {
    params: { name },
  });
}

// Alias for backward compatibility
export const lookupDomainWhois = whoisLookup;

// ── Applicant: Create ──
export async function createDomainApplication(
  data: DomainApplicationCreateRequest
): Promise<ApiResponse<DomainApplicationDetail>> {
  return apiClient<DomainApplicationDetail>("/domains/apply/", {
    method: "POST",
    body: data,
  });
}

// ── Applicant: My Applications ──
export async function getMyDomainApplications(
  params?: { page?: number }
): Promise<ApiResponse<PaginatedData<DomainApplicationListItem>>> {
  return apiClient<PaginatedData<DomainApplicationListItem>>(
    "/domains/my-applications/",
    { params: params as Record<string, string | number | boolean | undefined> }
  );
}

export async function getMyDomainApplication(
  id: string
): Promise<ApiResponse<DomainApplicationDetail>> {
  return apiClient<DomainApplicationDetail>(`/domains/my-applications/${id}/`);
}

export async function updateDomainApplication(
  id: string,
  data: DomainApplicationUpdateRequest
): Promise<ApiResponse<DomainApplicationDetail>> {
  return apiClient<DomainApplicationDetail>(
    `/domains/my-applications/${id}/update/`,
    { method: "PATCH", body: data }
  );
}

export async function submitDomainApplication(
  id: string
): Promise<ApiResponse<DomainApplicationDetail>> {
  return apiClient<DomainApplicationDetail>(
    `/domains/my-applications/${id}/submit/`,
    { method: "POST" }
  );
}

export async function cancelDomainApplication(
  id: string
): Promise<ApiResponse<DomainApplicationDetail>> {
  return apiClient<DomainApplicationDetail>(
    `/domains/my-applications/${id}/cancel/`,
    { method: "POST" }
  );
}

export async function respondToInfoRequest(
  id: string,
  data: { response_message: string }
): Promise<ApiResponse<DomainApplicationDetail>> {
  return apiClient<DomainApplicationDetail>(
    `/domains/my-applications/${id}/respond/`,
    { method: "POST", body: data }
  );
}

// ── Applicant: My Domains ──
export async function getMyDomains(
  params?: { page?: number }
): Promise<ApiResponse<PaginatedData<DomainListItem>>> {
  return apiClient<PaginatedData<DomainListItem>>("/domains/my-domains/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getMyDomain(
  id: string
): Promise<ApiResponse<DomainDetail>> {
  return apiClient<DomainDetail>(`/domains/my-domains/${id}/`);
}
