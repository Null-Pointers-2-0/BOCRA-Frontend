import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type {
  QoESummary,
  QoEHeatmapData,
  QoETrendsData,
  QoESpeedData,
  QoEDistrictItem,
  QoEHeatmapParams,
} from "../types/qoe";

export async function getQoESummary(
  params?: { operator?: string; days?: number }
): Promise<ApiResponse<QoESummary>> {
  return apiClient<QoESummary>("/qoe/summary/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getQoEHeatmap(
  params?: QoEHeatmapParams
): Promise<ApiResponse<QoEHeatmapData>> {
  return apiClient<QoEHeatmapData>("/qoe/heatmap/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getQoETrends(
  params?: { months?: number }
): Promise<ApiResponse<QoETrendsData>> {
  return apiClient<QoETrendsData>("/qoe/trends/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getQoESpeeds(
  params?: { connection_type?: string; days?: number }
): Promise<ApiResponse<QoESpeedData>> {
  return apiClient<QoESpeedData>("/qoe/speeds/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getQoEDistricts(): Promise<
  ApiResponse<QoEDistrictItem[]>
> {
  return apiClient<QoEDistrictItem[]>("/qoe/districts/");
}
