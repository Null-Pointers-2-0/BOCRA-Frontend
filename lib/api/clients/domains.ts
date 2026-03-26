import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type {
  DomainApplicationCreateRequest,
  DomainApplicationListItem,
  DomainAvailability,
  DomainWhois,
  DomainZone,
} from "../types/domains";

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

export async function lookupDomainWhois(
  name: string
): Promise<ApiResponse<DomainWhois>> {
  return apiClient<DomainWhois>("/domains/whois/", {
    params: { name },
  });
}

export async function createDomainApplication(
  data: DomainApplicationCreateRequest
): Promise<ApiResponse<DomainApplicationListItem>> {
  return apiClient<DomainApplicationListItem>("/domains/apply/", {
    method: "POST",
    body: data,
  });
}
