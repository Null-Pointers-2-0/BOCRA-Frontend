import { apiClient } from "../client";
import type { ApiResponse, PaginatedData } from "../types/common";
import type {
  PublicDashboard,
  TelecomsOverview,
  NetworkOperator,
  TelecomsStat,
  QoSRecord,
  AnalyticsDateParams,
} from "../types/analytics";

export async function getPublicDashboard(): Promise<
  ApiResponse<PublicDashboard>
> {
  return apiClient<PublicDashboard>("/analytics/dashboard/public/");
}

export async function getTelecomsOverview(): Promise<
  ApiResponse<TelecomsOverview>
> {
  return apiClient<TelecomsOverview>("/analytics/telecoms/overview/");
}

export async function getOperators(): Promise<
  ApiResponse<NetworkOperator[]>
> {
  return apiClient<NetworkOperator[]>("/analytics/telecoms/operators/");
}

export async function getQoSRecords(
  params?: AnalyticsDateParams
): Promise<ApiResponse<PaginatedData<QoSRecord>>> {
  return apiClient<PaginatedData<QoSRecord>>("/analytics/qos/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
