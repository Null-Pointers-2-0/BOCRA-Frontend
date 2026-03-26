import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type {
  DomainZone,
  DomainAvailability,
  DomainWhois,
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

export async function getDomainWhois(
  name: string
): Promise<ApiResponse<DomainWhois>> {
  return apiClient<DomainWhois>("/domains/whois/", {
    params: { name },
  });
}
