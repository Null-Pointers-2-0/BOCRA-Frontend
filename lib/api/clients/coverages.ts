import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type {
  CoverageOperator,
  CoverageSummary,
  CoverageComparison,
  DistrictCoverageSummary,
  District,
  CoverageFilterParams,
} from "../types/coverages";

export async function getCoverageOperators(): Promise<
  ApiResponse<CoverageOperator[]>
> {
  return apiClient<CoverageOperator[]>("/coverages/operators/");
}

export async function getDistricts(): Promise<ApiResponse<District[]>> {
  return apiClient<District[]>("/coverages/districts/");
}

export async function getCoverageSummary(
  params?: CoverageFilterParams
): Promise<ApiResponse<CoverageSummary>> {
  return apiClient<CoverageSummary>("/coverages/summary/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getDistrictCoverageSummary(
  districtId: string
): Promise<ApiResponse<DistrictCoverageSummary>> {
  return apiClient<DistrictCoverageSummary>(
    `/coverages/summary/${districtId}/`
  );
}

export async function getCoverageComparison(
  params?: CoverageFilterParams
): Promise<ApiResponse<CoverageComparison>> {
  return apiClient<CoverageComparison>("/coverages/compare/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getDistrictsGeoJSON(): Promise<
  ApiResponse<GeoJSON.FeatureCollection>
> {
  return apiClient<GeoJSON.FeatureCollection>("/coverages/districts/geojson/");
}

export async function getCoverageAreasGeoJSON(
  params?: { operator?: string; technology?: string }
): Promise<ApiResponse<GeoJSON.FeatureCollection>> {
  return apiClient<GeoJSON.FeatureCollection>("/coverages/areas/geojson/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
