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

export type QoEReportSubmission = {
  operator: string;
  service_type: "DATA" | "VOICE" | "SMS" | "FIXED";
  connection_type: "2G" | "3G" | "4G" | "5G";
  rating: number;
  download_speed?: number | null;
  upload_speed?: number | null;
  latency_ms?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  district?: string | null;
  description?: string;
};

export const qoeClient = {
  submit: (data: QoEReportSubmission) =>
    apiClient("/qoe/reports/", { method: "POST", body: data }),

  ping: () => apiClient<{ pong: boolean; ts: number }>("/qoe/ping/"),

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
