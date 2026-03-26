import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  LicenceSector,
  LicenceSectorDetail,
  LicenceType,
  LicenceTypeDetail,
  ApplicationListItem,
  ApplicationDetail,
  ApplicationCreateRequest,
  DocumentUploadRequest,
  ApplicationDocument,
  LicenceListItem,
  LicenceDetail,
  LicenceVerify,
} from "../types/licensing";

// ── Public: Sectors ──
export async function getLicenceSectors(): Promise<
  ApiResponse<LicenceSector[]>
> {
  return apiClient<LicenceSector[]>("/licensing/sectors/");
}

export async function getLicenceSector(
  id: string
): Promise<ApiResponse<LicenceSectorDetail>> {
  return apiClient<LicenceSectorDetail>(`/licensing/sectors/${id}/`);
}

// ── Public: Licence Types ──
export async function getLicenceTypes(): Promise<
  ApiResponse<LicenceType[]>
> {
  return apiClient<LicenceType[]>("/licensing/types/");
}

export async function getLicenceType(
  id: string
): Promise<ApiResponse<LicenceTypeDetail>> {
  return apiClient<LicenceTypeDetail>(`/licensing/types/${id}/`);
}

export async function verifyLicence(
  licenceNumber: string
): Promise<ApiResponse<LicenceVerify>> {
  return apiClient<LicenceVerify>("/licensing/verify/", {
    params: { licence_number: licenceNumber },
  });
}

// ── Applicant: Applications ──
export async function getMyApplications(
  params?: { page?: number }
): Promise<ApiResponse<PaginatedData<ApplicationListItem>>> {
  return apiClient<PaginatedData<ApplicationListItem>>(
    "/licensing/applications/",
    { params: params as Record<string, string | number | boolean | undefined> }
  );
}

export async function getMyApplication(
  id: string
): Promise<ApiResponse<ApplicationDetail>> {
  return apiClient<ApplicationDetail>(`/licensing/applications/${id}/`);
}

export async function createApplication(
  data: ApplicationCreateRequest
): Promise<ApiResponse<ApplicationDetail>> {
  return apiClient<ApplicationDetail>("/licensing/applications/", {
    method: "POST",
    body: data,
  });
}

export async function uploadApplicationDocument(
  applicationId: string,
  data: DocumentUploadRequest
): Promise<ApiResponse<ApplicationDocument>> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("file", data.file);
  return apiClient<ApplicationDocument>(
    `/licensing/applications/${applicationId}/documents/`,
    { method: "POST", body: formData, isFormData: true }
  );
}

export async function cancelApplication(
  id: string
): Promise<ApiResponse<ApplicationDetail>> {
  return apiClient<ApplicationDetail>(
    `/licensing/applications/${id}/cancel/`,
    { method: "POST" }
  );
}

// ── Applicant: Licences ──
export async function getMyLicences(
  params?: { page?: number }
): Promise<ApiResponse<PaginatedData<LicenceListItem>>> {
  return apiClient<PaginatedData<LicenceListItem>>("/licensing/licences/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getMyLicence(
  id: string
): Promise<ApiResponse<LicenceDetail>> {
  return apiClient<LicenceDetail>(`/licensing/licences/${id}/`);
}

export async function renewLicence(
  id: string
): Promise<ApiResponse<ApplicationDetail>> {
  return apiClient<ApplicationDetail>(`/licensing/licences/${id}/renew/`, {
    method: "POST",
  });
}

export async function downloadCertificate(id: string): Promise<Blob> {
  const { accessToken } = await import("../client").then((m) => m.getTokens());
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(
    `${(await import("@/lib/config")).config.apiUrl}/licensing/licences/${id}/certificate/`,
    { headers }
  );
  return res.blob();
}
