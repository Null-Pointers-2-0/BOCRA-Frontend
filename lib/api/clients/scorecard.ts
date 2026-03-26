import { apiClient } from "../client";
import type { ApiResponse } from "../types/common";
import type {
  RankingsData,
  CurrentScoresData,
  ScoreHistoryData,
  OperatorScoreDetailData,
  ScorecardWeight,
} from "../types/scorecard";

export async function getScorecardRankings(): Promise<
  ApiResponse<RankingsData>
> {
  return apiClient<RankingsData>("/scorecard/rankings/");
}

export async function getCurrentScores(): Promise<
  ApiResponse<CurrentScoresData>
> {
  return apiClient<CurrentScoresData>("/scorecard/scores/");
}

export async function getScoreHistory(
  params?: { operator?: string; months?: number }
): Promise<ApiResponse<ScoreHistoryData>> {
  return apiClient<ScoreHistoryData>("/scorecard/scores/history/", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getOperatorScoreDetail(
  code: string,
  params?: { months?: number }
): Promise<ApiResponse<OperatorScoreDetailData>> {
  return apiClient<OperatorScoreDetailData>(`/scorecard/scores/${code}/`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getScorecardWeights(): Promise<
  ApiResponse<ScorecardWeight[]>
> {
  return apiClient<ScorecardWeight[]>("/scorecard/weights/");
}
