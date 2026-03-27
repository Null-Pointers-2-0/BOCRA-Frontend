import { apiClient } from "../client";
import type {
  AuditRequest,
  AuditRequestListItem,
  AuditRequestSubmitData,
} from "../types/cybersecurity";

/**
 * Submit a cybersecurity audit request.
 * Works with or without authentication (anonymous).
 */
export async function requestAudit(data: AuditRequestSubmitData) {
  return apiClient<AuditRequest>("/cybersecurity/request-audit/", {
    method: "POST",
    body: data,
  });
}

/**
 * Get current user's audit requests.
 */
export async function getMyAuditRequests() {
  return apiClient<AuditRequestListItem[]>("/cybersecurity/my-requests/");
}

/**
 * Get detail of a specific audit request.
 */
export async function getMyAuditRequest(id: string) {
  return apiClient<AuditRequest>(`/cybersecurity/my-requests/${id}/`);
}
