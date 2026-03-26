import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type {
  PublicationListItem,
  PublicationDetail,
  PublicPublicationListParams,
} from "../types/publications";

export async function getPublications(
  params?: PublicPublicationListParams
): Promise<ApiResponse<PublicationListItem[]>> {
  return apiClient<PublicationListItem[]>("/publications/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getPublication(
  id: string
): Promise<ApiResponse<PublicationDetail>> {
  return apiClient<PublicationDetail>(`/publications/${id}/`);
}

export async function downloadPublication(id: string): Promise<Blob> {
  const { accessToken } = await import("../client").then((m) => m.getTokens());
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(
    `${(await import("@/lib/config")).config.apiUrl}/publications/${id}/download/`,
    { headers }
  );
  return res.blob();
}

export async function getPublicationCategories(): Promise<
  ApiResponse<{ value: string; label: string }[]>
> {
  return apiClient<{ value: string; label: string }[]>(
    "/publications/categories/"
  );
}
