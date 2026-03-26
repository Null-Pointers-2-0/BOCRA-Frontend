import { apiClient } from "../client";
import type {
  QoEAnalytics,
  QoECompareData,
  QoEHeatmapData,
  QoEHeatmapParams,
  QoESpeedData,
  QoESummary,
  QoETrendsData,
} from "../types/qoe";

export const qoeClient = {
  heatmap: (params?: QoEHeatmapParams) =>
    apiClient<QoEHeatmapData>("/qoe/heatmap/", { params }),

  summary: (params?: { operator?: string; days?: number }) =>
    apiClient<QoESummary>("/qoe/summary/", { params }),

  trends: (params?: { months?: number }) =>
    apiClient<QoETrendsData>("/qoe/trends/", { params }),

  speeds: (params?: { connection_type?: string; days?: number }) =>
    apiClient<QoESpeedData>("/qoe/speeds/", { params }),

  analytics: (params?: { days?: number }) =>
    apiClient<QoEAnalytics>("/qoe/analytics/", { params }),

  compare: () =>
    apiClient<QoECompareData>("/qoe/compare/"),
};
