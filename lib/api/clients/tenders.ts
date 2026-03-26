import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type {
  TenderListItem,
  TenderDetail,
  PublicTenderListParams,
} from "../types/tenders";

export async function getTenders(
  params?: PublicTenderListParams
): Promise<ApiResponse<TenderListItem[]>> {
  return apiClient<TenderListItem[]>("/tenders/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getTender(
  id: string
): Promise<ApiResponse<TenderDetail>> {
  return apiClient<TenderDetail>(`/tenders/${id}/`);
}

export async function downloadTenderDocument(
  tenderId: string,
  documentId: string
): Promise<Blob> {
  const { accessToken } = await import("../client").then((m) => m.getTokens());
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(
    `${(await import("@/lib/config")).config.apiUrl}/tenders/${tenderId}/documents/${documentId}/download/`,
    { headers }
  );
  return res.blob();
}

export async function getTenderCategories(): Promise<
  ApiResponse<{ value: string; label: string }[]>
> {
  return apiClient<{ value: string; label: string }[]>(
    "/tenders/categories/"
  );
}
