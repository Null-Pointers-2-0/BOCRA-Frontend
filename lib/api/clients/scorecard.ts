import { apiClient } from "../client";
import type {
  OperatorScoreDetailData,
  RankingsData,
  ScoreHistoryData,
  ScorecardWeight,
} from "../types/scorecard";

export const scorecardClient = {
  weights: () =>
    apiClient<ScorecardWeight[]>("/scorecard/weights/"),

  history: (params?: { operator?: string; months?: number }) =>
    apiClient<ScoreHistoryData>("/scorecard/scores/history/", { params }),

  operatorDetail: (operatorCode: string, params?: { months?: number }) =>
    apiClient<OperatorScoreDetailData>(`/scorecard/scores/${operatorCode}/`, { params }),

  rankings: () =>
    apiClient<RankingsData>("/scorecard/rankings/"),
};
