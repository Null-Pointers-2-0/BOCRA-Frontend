import { apiClient } from "../client";
import type {
  CoverageComparison,
  CoverageOperator,
  CoverageStats,
  CoverageSummary,
  CoverageGeoJSONParams,
  District,
  DistrictCoverageSummary,
} from "../types/coverages";

export const coveragesClient = {
  districts: () =>
    apiClient<District[]>("/coverages/districts/"),

  districtsGeoJSON: () =>
    apiClient<GeoJSON.FeatureCollection>("/coverages/districts/geojson/"),

  operators: () =>
    apiClient<CoverageOperator[]>("/coverages/operators/"),

  areasGeoJSON: (params?: CoverageGeoJSONParams) =>
    apiClient<GeoJSON.FeatureCollection>("/coverages/areas/geojson/", { params }),

  summary: (params?: { technology?: string }) =>
    apiClient<CoverageSummary>("/coverages/summary/", { params }),

  districtSummary: (districtId: string) =>
    apiClient<DistrictCoverageSummary>(`/coverages/summary/${districtId}/`),

  compare: (params?: { technology?: string }) =>
    apiClient<CoverageComparison>("/coverages/compare/", { params }),

  stats: (params?: { technology?: string }) =>
    apiClient<CoverageStats>("/coverages/stats/", { params }),
};
