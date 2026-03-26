"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  getScorecardRankings,
  getScoreHistory,
  getOperatorScoreDetail,
  getScorecardWeights,
} from "@/lib/api/clients/scorecard";
import type {
  RankingsData,
  RankingItem,
  ScoreHistoryData,
  OperatorScoreDetailData,
  ScorecardWeight,
  ScoringDimension,
} from "@/lib/api/types/scorecard";
import {
  Spinner as SpinnerIcon,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
  CaretUp as CaretUpIcon,
  CaretDown as CaretDownIcon,
  Minus as MinusIcon,
  Info as InfoIcon,
  ShieldCheck as ShieldCheckIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
} from "@phosphor-icons/react";

const OPERATOR_COLORS: Record<string, string> = {
  MASCOM: "#0073ae",
  ORANGE: "#f97316",
  BTCL: "#008265",
};

const DIMENSION_KEYS: ScoringDimension[] = ["COVERAGE", "QOE", "COMPLAINTS", "QOS"];

const DIMENSION_COLORS: Record<string, string> = {
  COVERAGE: "#0073ae",
  QOE: "#f59e0b",
  COMPLAINTS: "#c60751",
  QOS: "#008265",
};

const DIMENSION_LABELS: Record<string, string> = {
  COVERAGE: "Coverage",
  QOE: "Quality of Experience",
  COMPLAINTS: "Complaints",
  QOS: "Quality of Service",
};

function parseFl(val: string | number): number {
  return typeof val === "number" ? val : parseFloat(val) || 0;
}

function getDimensionScores(op: RankingItem): { dim: ScoringDimension; score: number }[] {
  return [
    { dim: "COVERAGE", score: parseFl(op.coverage_score) },
    { dim: "QOE", score: parseFl(op.qoe_score) },
    { dim: "COMPLAINTS", score: parseFl(op.complaints_score) },
    { dim: "QOS", score: parseFl(op.qos_score) },
  ];
}

/* ── SVG ScoreGauge ── */
function ScoreGauge({
  score,
  size = 100,
  strokeWidth = 8,
  color,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const gaugeColor = color || (score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444");
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-lg font-bold text-gray-900">{score.toFixed(0)}</span>
    </div>
  );
}

function TrendBadge({ trend }: { trend: { score_change: number; rank_change: number } | null }) {
  if (!trend) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
        <MinusIcon size={12} /> New
      </span>
    );
  }
  if (trend.score_change > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
        <CaretUpIcon size={12} weight="fill" /> +{trend.score_change.toFixed(1)}
      </span>
    );
  }
  if (trend.score_change < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
        <CaretDownIcon size={12} weight="fill" /> {trend.score_change.toFixed(1)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
      <MinusIcon size={12} /> Stable
    </span>
  );
}

type Tab = "leaderboard" | "history" | "detail" | "weights";

export default function ScorecardPage() {
  const [tab, setTab] = useState<Tab>("leaderboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<RankingsData | null>(null);

  const [historyData, setHistoryData] = useState<ScoreHistoryData | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPeriod, setHistoryPeriod] = useState(6);

  const [selectedOperator, setSelectedOperator] = useState("");
  const [detail, setDetail] = useState<OperatorScoreDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [weights, setWeights] = useState<ScorecardWeight[]>([]);
  const [weightsLoading, setWeightsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getScorecardRankings()
      .then((res) => {
        if (res.success) {
          setRankings(res.data);
          if (res.data.rankings.length > 0 && !selectedOperator) {
            setSelectedOperator(res.data.rankings[0].operator);
          }
        } else {
          setError(res.message || "Failed to load");
        }
      })
      .catch(() => setError("Failed to load scorecard data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== "history") return;
    setHistoryLoading(true);
    getScoreHistory({ months: historyPeriod })
      .then((res) => {
        if (res.success) setHistoryData(res.data);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [tab, historyPeriod]);

  useEffect(() => {
    if (tab !== "detail" || !selectedOperator) return;
    setDetailLoading(true);
    getOperatorScoreDetail(selectedOperator)
      .then((res) => {
        if (res.success) setDetail(res.data);
      })
      .catch(() => {})
      .finally(() => setDetailLoading(false));
  }, [tab, selectedOperator]);

  useEffect(() => {
    if (tab !== "weights") return;
    setWeightsLoading(true);
    getScorecardWeights()
      .then((res) => {
        if (res.success) setWeights(res.data);
      })
      .catch(() => {})
      .finally(() => setWeightsLoading(false));
  }, [tab]);

  const tabList: { key: Tab; label: string }[] = [
    { key: "leaderboard", label: "Leaderboard" },
    { key: "history", label: "Score History" },
    { key: "detail", label: "Operator Detail" },
    { key: "weights", label: "Scoring Weights" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-6xl mt-30 space-y-8 pb-16">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Provider Scorecard</h1>
            <p className="text-gray-600 max-w-3xl">
              Comprehensive performance scoring of telecommunications operators in Botswana,
              based on coverage, quality metrics, and consumer satisfaction.
            </p>
          </div>

          <div className="flex items-center gap-1 border-b border-gray-200">
            {tabList.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  "px-5 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer " +
                  (tab === t.key
                    ? "border-[#0073ae] text-[#0073ae]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300")
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <SpinnerIcon className="animate-spin text-[#0073ae]" size={40} />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>
          )}

          {!loading && !error && tab === "leaderboard" && rankings && (
            <LeaderboardTab
              rankings={rankings}
              onOperatorClick={(code) => {
                setSelectedOperator(code);
                setTab("detail");
              }}
            />
          )}

          {!loading && !error && tab === "history" && (
            <HistoryTab
              historyData={historyData}
              isLoading={historyLoading}
              period={historyPeriod}
              onPeriodChange={setHistoryPeriod}
            />
          )}

          {!loading && !error && tab === "detail" && (
            <DetailTab
              rankings={rankings}
              selectedOperator={selectedOperator}
              detail={detail}
              isLoading={detailLoading}
              onOperatorChange={setSelectedOperator}
            />
          )}

          {!loading && !error && tab === "weights" && (
            <WeightsTab weights={weights} isLoading={weightsLoading} />
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}

/* ── Leaderboard Tab ── */
function LeaderboardTab({
  rankings,
  onOperatorClick,
}: {
  rankings: RankingsData;
  onOperatorClick: (code: string) => void;
}) {
  const sorted = [...rankings.rankings].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="space-y-8">
      <p className="text-xs text-gray-400">Period: {rankings.period}</p>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-4 md:gap-8">
          {podiumOrder.map((op) => {
            const color = OPERATOR_COLORS[op.operator] || "#6b7280";
            const isFirst = op.rank === 1;
            const compScore = parseFl(op.composite_score);
            return (
              <div
                key={op.operator}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onOperatorClick(op.operator)}
              >
                <ScoreGauge score={compScore} size={isFirst ? 120 : 100} color={color} />
                <div className="mt-3 text-center">
                  <div className="flex items-center gap-1.5 justify-center">
                    {op.rank === 1 && <TrophyIcon size={20} weight="fill" className="text-amber-500" />}
                    {op.rank === 2 && <MedalIcon size={18} weight="fill" className="text-gray-400" />}
                    {op.rank === 3 && <MedalIcon size={18} weight="fill" className="text-amber-700" />}
                    <span className="font-semibold text-gray-900 group-hover:text-[#0073ae] transition-colors">
                      {op.operator_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">#{op.rank}</p>
                  <TrendBadge trend={op.trend} />
                </div>
                <div
                  className="mt-3 rounded-t-lg w-20 md:w-28"
                  style={{
                    height: isFirst ? 120 : op.rank === 2 ? 90 : 60,
                    backgroundColor: color + "20",
                    borderTop: "3px solid " + color,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((op) => {
          const color = OPERATOR_COLORS[op.operator] || "#6b7280";
          const compScore = parseFl(op.composite_score);
          const dimScores = getDimensionScores(op);
          return (
            <div
              key={op.operator}
              className="rounded-xl border border-gray-200 bg-white p-5 cursor-pointer hover:shadow-md transition-shadow"
              style={{ borderTopWidth: 3, borderTopColor: color }}
              onClick={() => onOperatorClick(op.operator)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">#{op.rank}</span>
                    <span className="font-semibold text-gray-900">{op.operator_name}</span>
                  </div>
                  <TrendBadge trend={op.trend} />
                </div>
                <ScoreGauge score={compScore} size={64} strokeWidth={5} color={color} />
              </div>

              {/* Dimension scores */}
              <div className="space-y-2.5">
                {dimScores.map(({ dim, score }) => {
                  const dimColor = DIMENSION_COLORS[dim] || "#6b7280";
                  return (
                    <div key={dim} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">
                          {DIMENSION_LABELS[dim] || dim}
                        </span>
                        <span className="font-semibold" style={{ color: dimColor }}>
                          {score.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: Math.min(score, 100).toString() + "%", backgroundColor: dimColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── History Tab ── */
function HistoryTab({
  historyData,
  isLoading,
  period,
  onPeriodChange,
}: {
  historyData: ScoreHistoryData | null;
  isLoading: boolean;
  period: number;
  onPeriodChange: (p: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <SpinnerIcon className="animate-spin text-[#0073ae]" size={32} />
      </div>
    );
  }
  if (!historyData || historyData.periods.length === 0) {
    return <p className="text-gray-500 text-center py-12">No history data available.</p>;
  }

  // Extract unique operators from first period
  const operatorList = historyData.periods[0]?.scores.map((s) => ({
    code: s.operator_code,
    name: s.operator_name,
    operator: s.operator,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Score History</h3>
        <div className="flex gap-2">
          {[
            { value: 3, label: "3M" },
            { value: 6, label: "6M" },
            { value: 12, label: "1Y" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPeriodChange(opt.value)}
              className={
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer " +
                (period === opt.value
                  ? "bg-[#0073ae] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200")
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Composite score history */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Composite Score</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-5 font-medium text-gray-500">Period</th>
                {operatorList.map((op) => {
                  const color = OPERATOR_COLORS[op.operator] || "#6b7280";
                  return (
                    <th key={op.code} className="text-center py-3 px-4 font-medium" style={{ color }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        {op.name}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {historyData.periods.map((p) => (
                <tr key={p.period} className="border-b border-gray-100">
                  <td className="py-2.5 px-5 font-medium text-gray-700">{p.period}</td>
                  {operatorList.map((opRef) => {
                    const score = p.scores.find((s) => s.operator === opRef.operator);
                    const val = score ? parseFl(score.composite_score) : null;
                    return (
                      <td key={opRef.code} className="text-center py-2.5 px-4">
                        {val != null ? (
                          <span
                            className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: val >= 80 ? "#dcfce7" : val >= 60 ? "#fef9c3" : "#fee2e2",
                              color: val >= 80 ? "#166534" : val >= 60 ? "#854d0e" : "#991b1b",
                            }}
                          >
                            {val.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-300">{"\u2014"}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-dimension histories */}
      {DIMENSION_KEYS.map((dim) => {
        const dimColor = DIMENSION_COLORS[dim] || "#6b7280";
        const scoreKey = (dim.toLowerCase() + "_score") as keyof typeof historyData.periods[0]["scores"][0];
        return (
          <div key={dim} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center gap-2">
              <span className="h-3 w-3 rounded" style={{ backgroundColor: dimColor }} />
              <h4 className="font-semibold text-gray-900">{DIMENSION_LABELS[dim] || dim}</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-5 font-medium text-gray-500">Period</th>
                    {operatorList.map((op) => (
                      <th
                        key={op.code}
                        className="text-center py-3 px-4 font-medium"
                        style={{ color: OPERATOR_COLORS[op.operator] || "#6b7280" }}
                      >
                        {op.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyData.periods.map((p) => (
                    <tr key={p.period} className="border-b border-gray-100">
                      <td className="py-2.5 px-5 font-medium text-gray-700">{p.period}</td>
                      {operatorList.map((opRef) => {
                        const score = p.scores.find((s) => s.operator === opRef.operator);
                        const val = score ? parseFl(score[scoreKey] as string) : null;
                        return (
                          <td key={opRef.code} className="text-center py-2.5 px-4 text-gray-700">
                            {val != null ? val.toFixed(1) : "\u2014"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Detail Tab ── */
function DetailTab({
  rankings,
  selectedOperator,
  detail,
  isLoading,
  onOperatorChange,
}: {
  rankings: RankingsData | null;
  selectedOperator: string;
  detail: OperatorScoreDetailData | null;
  isLoading: boolean;
  onOperatorChange: (code: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Operator selector */}
      {rankings && (
        <div className="flex gap-2 flex-wrap">
          {rankings.rankings
            .sort((a, b) => a.rank - b.rank)
            .map((op) => {
              const color = OPERATOR_COLORS[op.operator] || "#6b7280";
              const isActive = selectedOperator === op.operator;
              return (
                <button
                  key={op.operator}
                  onClick={() => onOperatorChange(op.operator)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
                  style={{
                    backgroundColor: isActive ? color : "#f3f4f6",
                    color: isActive ? "white" : "#374151",
                  }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: isActive ? "white" : color }}
                  />
                  {op.operator_name}
                </button>
              );
            })}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <SpinnerIcon className="animate-spin text-[#0073ae]" size={32} />
        </div>
      )}

      {!isLoading && detail && detail.latest && <OperatorDetailContent detail={detail} />}

      {!isLoading && (!detail || !detail.latest) && selectedOperator && (
        <p className="text-gray-500 text-center py-12">No detail data available.</p>
      )}
    </div>
  );
}

function OperatorDetailContent({ detail }: { detail: OperatorScoreDetailData }) {
  const latest = detail.latest!;
  const meta = latest.metadata;
  const color = OPERATOR_COLORS[detail.operator] || "#6b7280";
  const compScore = parseFl(latest.composite_score);

  const dimData: { dim: ScoringDimension; score: number; weight: number; info: React.ReactNode }[] = [
    {
      dim: "COVERAGE",
      score: parseFl(latest.coverage_score),
      weight: meta.weights.coverage,
      info: (
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between"><span>Areas Covered</span><span className="font-semibold text-gray-800">{meta.coverage.area_count}</span></div>
          <div className="flex justify-between"><span>Avg Coverage</span><span className="font-semibold text-gray-800">{meta.coverage.avg_coverage_pct.toFixed(1)}%</span></div>
        </div>
      ),
    },
    {
      dim: "QOE",
      score: parseFl(latest.qoe_score),
      weight: meta.weights.qoe,
      info: (
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between"><span>Reports</span><span className="font-semibold text-gray-800">{meta.qoe.report_count.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Avg Rating</span><span className="font-semibold text-gray-800">{meta.qoe.avg_rating.toFixed(1)} / 5</span></div>
        </div>
      ),
    },
    {
      dim: "COMPLAINTS",
      score: parseFl(latest.complaints_score),
      weight: meta.weights.complaints,
      info: (
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between"><span>Total Complaints</span><span className="font-semibold text-gray-800">{meta.complaints.complaint_count}</span></div>
          <div className="flex justify-between"><span>Resolved</span><span className="font-semibold text-gray-800">{meta.complaints.resolved_count}</span></div>
          <div className="flex justify-between"><span>Resolution Rate</span><span className="font-semibold text-gray-800">{meta.complaints.resolution_rate_pct.toFixed(1)}%</span></div>
        </div>
      ),
    },
    {
      dim: "QOS",
      score: parseFl(latest.qos_score),
      weight: meta.weights.qos,
      info: (
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between"><span>Metrics Evaluated</span><span className="font-semibold text-gray-800">{meta.qos.metric_count}</span></div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div
        className="rounded-xl border border-gray-200 bg-white p-6"
        style={{ borderTopWidth: 3, borderTopColor: color }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{detail.operator_name}</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-gray-500">Rank #{latest.rank}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Period: {latest.period}</p>
          </div>
          <ScoreGauge score={compScore} size={100} color={color} />
        </div>
      </div>

      {/* Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimData.map(({ dim, score, weight, info }) => {
          const dimColor = DIMENSION_COLORS[dim] || "#6b7280";
          return (
            <div
              key={dim}
              className="rounded-xl border border-gray-200 bg-white p-5"
              style={{ borderLeftWidth: 4, borderLeftColor: dimColor }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {DIMENSION_LABELS[dim] || dim}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Weight: {weight}% | Score: {score.toFixed(1)}
                  </p>
                </div>
                <ScoreGauge score={score} size={56} strokeWidth={4} color={dimColor} />
              </div>
              {info}
            </div>
          );
        })}
      </div>

      {/* QoS Metrics Table */}
      {meta.qos.metrics.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center gap-2">
            <ShieldCheckIcon size={20} className="text-[#008265]" weight="fill" />
            <h3 className="text-lg font-semibold text-gray-900">QoS Metrics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-5 font-medium text-gray-500">Metric</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Benchmark</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Score</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {meta.qos.metrics.map((m) => {
                  const met = m.value >= m.benchmark;
                  return (
                    <tr key={m.metric} className="border-b border-gray-100">
                      <td className="py-3 px-5 font-medium text-gray-900">{m.metric}</td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {m.benchmark} {m.unit}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {m.value} {m.unit}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {m.score.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {met ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircleIcon size={12} weight="fill" /> Met
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded">
                            <XCircleIcon size={12} weight="fill" /> Below
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Weights Tab ── */
function WeightsTab({
  weights,
  isLoading,
}: {
  weights: ScorecardWeight[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <SpinnerIcon className="animate-spin text-[#0073ae]" size={32} />
      </div>
    );
  }
  if (weights.length === 0) {
    return <p className="text-gray-500 text-center py-12">No weight data available.</p>;
  }

  const totalWeight = weights.reduce((sum, w) => sum + parseFl(w.weight), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <InfoIcon size={18} className="text-[#0073ae]" weight="fill" />
        <p className="text-sm text-gray-600">
          Scoring weights determine how each dimension contributes to an operator&apos;s
          composite score. Total weight: <strong>{totalWeight}%</strong>
        </p>
      </div>

      {/* Weight bars */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        {weights.map((w) => {
          const dimColor = DIMENSION_COLORS[w.dimension] || "#6b7280";
          const wVal = parseFl(w.weight);
          return (
            <div key={w.dimension} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded" style={{ backgroundColor: dimColor }} />
                  <span className="font-medium text-gray-900">
                    {w.dimension_display}
                  </span>
                </div>
                <span className="text-sm font-bold" style={{ color: dimColor }}>
                  {wVal}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: wVal.toString() + "%", backgroundColor: dimColor }}
                />
              </div>
              {w.description && (
                <p className="text-xs text-gray-500 ml-5">{w.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
