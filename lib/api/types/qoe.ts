// ── Service & Connection Types ──
export type ServiceType = "DATA" | "VOICE" | "SMS" | "FIXED";
export type ConnectionType = "2G" | "3G" | "4G" | "5G";

// ── QoE Summary ──
export type QoEOperatorSummary = {
  operator: string;
  operator_name: string;
  report_count: number;
  avg_rating: number;
  avg_download_mbps: number;
  avg_upload_mbps: number;
  avg_latency_ms: number;
};

export type QoESummary = {
  days: number;
  total_reports: number;
  avg_rating: number;
  avg_download_mbps: number;
  avg_upload_mbps: number;
  avg_latency_ms: number;
  rating_distribution: Record<string, number>;
  by_operator: QoEOperatorSummary[];
};

// ── QoE Heatmap ──
export type QoEHeatmapDistrict = {
  district_id: string;
  district_name: string;
  district_code: string;
  center_lat: number;
  center_lng: number;
  report_count: number;
  avg_rating: number;
  avg_download_mbps: number;
  avg_upload_mbps: number;
  avg_latency_ms: number;
};

export type QoEHeatmapData = {
  days: number;
  districts: QoEHeatmapDistrict[];
};

// ── QoE Trends ──
export type QoETrendMonth = {
  month: string;
  operators: Record<
    string,
    {
      operator_name: string;
      avg_rating: number;
      avg_download_mbps: number;
      report_count: number;
    }
  >;
};

export type QoETrendsData = {
  months: number;
  trends: QoETrendMonth[];
};

// ── QoE Speeds ──
export type QoEOperatorSpeed = {
  operator: string;
  operator_name: string;
  sample_count: number;
  download: { avg_mbps: number; min_mbps: number; max_mbps: number };
  upload: { avg_mbps: number; min_mbps: number; max_mbps: number };
  latency: { avg_ms: number; min_ms: number; max_ms: number };
  by_connection_type: {
    connection_type: string;
    sample_count: number;
    avg_download_mbps: number;
    avg_upload_mbps: number;
    avg_latency_ms: number;
  }[];
};

export type QoESpeedData = {
  days: number;
  operators: QoEOperatorSpeed[];
};

// ── QoE Districts ──
export type QoEDistrictItem = {
  district_id: string;
  district_name: string;
  district_code: string;
  center_lat: number;
  center_lng: number;
  report_count: number;
  avg_rating: number;
};

// ── Query Params ──
export type QoEHeatmapParams = {
  operator?: string;
  connection_type?: string;
  days?: number;
};
