import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type {
  StaffDashboard,
  UserSummary,
  ComplaintSummary,
  LicensingSummary,
  ContentOverview,
  ContentSummary,
  TrendItem,
  QoSByOperator,
  AnalyticsDateParams,
} from "../types/analytics";

// ── Dashboard ──
export async function getStaffDashboard(): Promise<ApiResponse<StaffDashboard>> {
  return apiClient<StaffDashboard>("/analytics/dashboard/staff/");
}

// ── Users ──
export async function getUsersSummary(): Promise<ApiResponse<UserSummary>> {
  return apiClient<UserSummary>("/analytics/users/summary/");
}

// ── Complaints ──
export async function getComplaintsSummary(
  params?: AnalyticsDateParams
): Promise<ApiResponse<ComplaintSummary>> {
  return apiClient<ComplaintSummary>("/analytics/complaints/summary/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getComplaintsTrend(
  params?: AnalyticsDateParams
): Promise<ApiResponse<TrendItem[]>> {
  return apiClient<TrendItem[]>("/analytics/complaints/trend/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

// ── Licensing ──
export async function getLicensingSummary(): Promise<ApiResponse<LicensingSummary>> {
  return apiClient<LicensingSummary>("/analytics/licensing/summary/");
}

export async function getApplicationsTrend(
  params?: AnalyticsDateParams
): Promise<ApiResponse<TrendItem[]>> {
  return apiClient<TrendItem[]>("/analytics/applications/trend/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

// ── Content ──
export async function getPublicationsSummary(): Promise<ApiResponse<ContentSummary>> {
  return apiClient<ContentSummary>("/analytics/publications/summary/");
}

export async function getTendersSummary(): Promise<ApiResponse<ContentSummary>> {
  return apiClient<ContentSummary>("/analytics/tenders/summary/");
}

export async function getNewsSummary(): Promise<ApiResponse<ContentSummary>> {
  return apiClient<ContentSummary>("/analytics/news/summary/");
}

export async function getContentOverview(): Promise<ApiResponse<ContentOverview>> {
  return apiClient<ContentOverview>("/analytics/content/overview/");
}

// ── QoS ──
export async function getQoSByOperator(
  params?: AnalyticsDateParams
): Promise<ApiResponse<QoSByOperator[]>> {
  return apiClient<QoSByOperator[]>("/analytics/qos/by-operator/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
