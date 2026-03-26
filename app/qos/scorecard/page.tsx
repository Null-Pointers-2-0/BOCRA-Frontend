"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { scorecardClient } from "@/lib/api/clients";
import type {
  OperatorScore,
  OperatorScoreDetailData,
  RankingItem,
  RankingsData,
  ScoreHistoryData,
} from "@/lib/api/types";
import {
  Loader2,
  Trophy,
  TrendingUp,
  Minus,
  Eye,
  Crown,
  Medal,
  Award,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import HeaderSection from "@/components/HeaderSection";

type Tab = "leaderboard" | "history" | "detail";

const OPERATOR_COLORS: Record<string, string> = {
  MASCOM: "#0073ae",
  ORANGE: "#f97316",
  BTCL: "#008265",
};

const DIMENSION_COLORS: Record<string, string> = {
  COVERAGE: "#0073ae",
  QOE: "#f59e0b",
  COMPLAINTS: "#c60751",
  QOS: "#008265",
};

const RANK_ICONS = [Crown, Medal, Award];

function scoreColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#ef4444";
  return "#991b1b";
}

function ScoreGauge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = { sm: 40, md: 56, lg: 72 };
  const dim = sizeMap[size];
  const stroke = size === "sm" ? 3 : 4;
  const radius = (dim - stroke * 2) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const fontSize = size === "sm" ? 10 : size === "md" ? 14 : 18;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span
        className="absolute font-bold"
        style={{ fontSize, color: scoreColor(score) }}
      >
        {score.toFixed(0)}
      </span>
    </div>
  );
}

export default function ScorecardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("leaderboard");
  const [rankings, setRankings] = useState<RankingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

  useEffect(() => {
    scorecardClient.rankings().then((res) => {
      if (res.success) setRankings(res.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col px-6">
          <div className="mt-20 md:mt-30 flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-[#0073ae]" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof Trophy }[] = [
    { key: "leaderboard", label: "Leaderboard", icon: Trophy },
    { key: "history", label: "Score History", icon: TrendingUp },
    { key: "detail", label: "Operator Detail", icon: Eye },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col px-6">
        <div className="mt-20 md:mt-30 max-w-5xl mx-auto w-full space-y-5">
      {/* Header */}
      <div>
        <HeaderSection title="Live Operator" pinkText="scoreboard" textSize="text-5xl"/>
        <p className="text-sm text-gray-500 mt-1">
          Composite performance scores across coverage, QoE, complaints and QoS
          {rankings && (
            <span className="ml-2 text-gray-400">
              | Period: {rankings.period}
            </span>
          )}
        </p>
      </div>

      {/* Top 3 Podium */}
      {rankings && activeTab === "leaderboard" && (
        <Podium rankings={rankings.rankings} />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-[#0073ae] text-[#0073ae]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "leaderboard" && (
        <LeaderboardTab
          rankings={rankings}
          onViewDetail={(code) => {
            setSelectedOperator(code);
            setActiveTab("detail");
          }}
        />
      )}
      {activeTab === "history" && <HistoryTab />}
      {activeTab === "detail" && (
        <DetailTab
          initialOperator={selectedOperator}
          onOperatorChange={setSelectedOperator}
        />
      )}
    </div>
      </main>
      <Footer />
    </>
  );
}

// -- Podium -------------------------------------------------------------------

function Podium({ rankings }: { rankings: RankingItem[] }) {
  const top3 = rankings.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const heights = ["h-28", "h-36", "h-24"];
  const podiumHeights =
    top3.length >= 3 ? [heights[1], heights[0], heights[2]] : heights;

  return (
    <div className="flex items-end justify-center gap-4">
      {podiumOrder.map((r, i) => {
        const actualRank = r.rank;
        const RankIcon = RANK_ICONS[actualRank - 1] || Award;
        const color = OPERATOR_COLORS[r.operator_code] || "#6b7280";
        const score = Number(r.composite_score);

        return (
          <div key={r.id} className="flex flex-col items-center">
            <ScoreGauge score={score} size="lg" />
            <p className="text-sm font-bold text-gray-900 mt-2">
              {r.operator_name}
            </p>
            {r.trend && (
              <TrendBadge
                scoreChange={r.trend.score_change}
                rankChange={r.trend.rank_change}
              />
            )}
            <div
              className={`${podiumHeights[i]} w-28 mt-2 flex items-start justify-center pt-3`}
              style={{
                backgroundColor: `${color}50`,
                borderTop: `3px solid ${color}`,
              }}
            >
              <RankIcon className="h-6 w-6" style={{ color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrendBadge({
  scoreChange,
  rankChange,
}: {
  scoreChange: number;
  rankChange: number;
}) {
  const isUp = scoreChange > 0;
  const isDown = scoreChange < 0;
  return (
    <div className="flex items-center gap-1 mt-1">
      {isUp && (
        <span className="flex items-center gap-0.5 text-xs text-green-600">
          <ArrowUp className="h-3 w-3" />+{scoreChange.toFixed(1)}
        </span>
      )}
      {isDown && (
        <span className="flex items-center gap-0.5 text-xs text-red-600">
          <ArrowDown className="h-3 w-3" />
          {scoreChange.toFixed(1)}
        </span>
      )}
      {!isUp && !isDown && (
        <span className="flex items-center gap-0.5 text-xs text-gray-400">
          <Minus className="h-3 w-3" />0.0
        </span>
      )}
      {rankChange !== 0 && (
        <span
          className={`text-[10px] px-1 py-0.5 rounded ${rankChange < 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {rankChange < 0
            ? `+${Math.abs(rankChange)} rank`
            : `-${rankChange} rank`}
        </span>
      )}
    </div>
  );
}

// -- Leaderboard Tab ----------------------------------------------------------

function LeaderboardTab({
  rankings,
  onViewDetail,
}: {
  rankings: RankingsData | null;
  onViewDetail: (code: string) => void;
}) {
  if (!rankings) return null;

  const radarData = [
    {
      dimension: "Coverage",
      ...Object.fromEntries(
        rankings.rankings.map((r) => [
          r.operator_code,
          Number(r.coverage_score),
        ])
      ),
    },
    {
      dimension: "QoE",
      ...Object.fromEntries(
        rankings.rankings.map((r) => [r.operator_code, Number(r.qoe_score)])
      ),
    },
    {
      dimension: "Complaints",
      ...Object.fromEntries(
        rankings.rankings.map((r) => [
          r.operator_code,
          Number(r.complaints_score),
        ])
      ),
    },
    {
      dimension: "QoS",
      ...Object.fromEntries(
        rankings.rankings.map((r) => [r.operator_code, Number(r.qos_score)])
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {rankings.rankings.map((r) => {
          const color = OPERATOR_COLORS[r.operator_code] || "#6b7280";
          return (
            <div
              key={r.id}
              className="border border-gray-200 bg-gray-50 p-4 hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() => onViewDetail(r.operator_code)}
              style={{ borderLeftWidth: 4, borderLeftColor: color }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      #{r.rank}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {r.operator_name}
                    </span>
                  </div>
                  {r.trend && (
                    <TrendBadge
                      scoreChange={r.trend.score_change}
                      rankChange={r.trend.rank_change}
                    />
                  )}
                </div>
                <ScoreGauge score={Number(r.composite_score)} size="md" />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    ["Coverage", r.coverage_score],
                    ["QoE", r.qoe_score],
                    ["Complaints", r.complaints_score],
                    ["QoS", r.qos_score],
                  ] as [string, string][]
                ).map(([label, val]) => {
                  const v = Number(val);
                  return (
                    <div key={label} className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {label}
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: scoreColor(v) }}
                      >
                        {v.toFixed(1)}
                      </p>
                      <div className="mt-1 h-1 bg-gray-100 rounded-full">
                        <div
                          className="h-1 rounded-full transition-all"
                          style={{
                            width: `${v}%`,
                            backgroundColor: scoreColor(v),
                          }}
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

      {/* Radar Comparison */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-2xl font-semibold text-gray-900 mb-1">
          Dimension Comparison
        </h3>
        <p className="text-md text-gray-500 mb-4">
          All scores on a 0-100 scale
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            {rankings.rankings.map((r) => (
              <Radar
                key={r.operator_code}
                name={r.operator_name}
                dataKey={r.operator_code}
                stroke={OPERATOR_COLORS[r.operator_code] || "#6b7280"}
                fill={OPERATOR_COLORS[r.operator_code] || "#6b7280"}
                fillOpacity={0.12}
                strokeWidth={2}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// -- History Tab ---------------------------------------------------------------

function HistoryTab() {
  const [history, setHistory] = useState<ScoreHistoryData | null>(null);
  const [months, setMonths] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    scorecardClient.history({ months }).then((res) => {
      if (cancelled) return;
      if (res.success) setHistory(res.data);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [months]);

  if (isLoading || !history) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#0073ae]" />
      </div>
    );
  }

  const operatorCodes = new Set<string>();
  history.periods.forEach((p) =>
    p.scores.forEach((s) => operatorCodes.add(s.operator_code))
  );
  const codes = Array.from(operatorCodes);

  const compositeData = history.periods.map((p) => {
    const entry: Record<string, string | number> = { period: p.period };
    for (const s of p.scores) {
      entry[s.operator_code] = Number(s.composite_score);
    }
    return entry;
  });

  const dimensionKeys = [
    { key: "coverage_score", label: "Coverage Score" },
    { key: "qoe_score", label: "QoE Score" },
    { key: "complaints_score", label: "Complaints Score" },
    { key: "qos_score", label: "QoS Score" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {[3, 6, 12].map((m) => (
          <button
            key={m}
            onClick={() => setMonths(m)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              months === m
                ? "bg-[#0073ae] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {m} months
          </button>
        ))}
      </div>

      {/* Composite Score Trend */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Composite Score Trend
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Monthly weighted composite score per operator
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={compositeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            {codes.map((code) => (
              <Line
                key={code}
                type="monotone"
                dataKey={code}
                name={code}
                stroke={OPERATOR_COLORS[code] || "#6b7280"}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-dimension breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dimensionKeys.map((dim) => {
          const chartData = history.periods.map((p) => {
            const entry: Record<string, string | number> = {
              period: p.period,
            };
            for (const s of p.scores) {
              entry[s.operator_code] = Number(
                s[dim.key as keyof OperatorScore] as string
              );
            }
            return entry;
          });

          return (
            <div
              key={dim.key}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {dim.label}
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  {codes.map((code) => (
                    <Line
                      key={code}
                      type="monotone"
                      dataKey={code}
                      name={code}
                      stroke={OPERATOR_COLORS[code] || "#6b7280"}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -- Detail Tab ---------------------------------------------------------------

function DetailTab({
  initialOperator,
  onOperatorChange,
}: {
  initialOperator: string | null;
  onOperatorChange: (code: string) => void;
}) {
  const [operator, setOperator] = useState(initialOperator || "MASCOM");
  const [detail, setDetail] = useState<OperatorScoreDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    scorecardClient.operatorDetail(operator, { months: 6 }).then((res) => {
      if (cancelled) return;
      if (res.success) setDetail(res.data);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [operator]);

  const handleChange = (code: string) => {
    setOperator(code);
    onOperatorChange(code);
  };

  if (isLoading || !detail) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#0073ae]" />
      </div>
    );
  }

  const latest = detail.latest;
  const color = OPERATOR_COLORS[detail.operator_code] || "#6b7280";

  const historyChart = detail.history.map((h) => ({
    period: h.period,
    composite: Number(h.composite_score),
    coverage: Number(h.coverage_score),
    qoe: Number(h.qoe_score),
    complaints: Number(h.complaints_score),
    qos: Number(h.qos_score),
  }));

  return (
    <div className="space-y-6">
      {/* Operator selector */}
      <div className="flex items-center gap-3">
        {["MASCOM", "ORANGE", "BTCL"].map((code) => (
          <button
            key={code}
            onClick={() => handleChange(code)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              operator === code
                ? "text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={
              operator === code
                ? { backgroundColor: OPERATOR_COLORS[code] || "#6b7280" }
                : undefined
            }
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  operator === code
                    ? "#fff"
                    : OPERATOR_COLORS[code] || "#6b7280",
              }}
            />
            {code}
          </button>
        ))}
      </div>

      {latest ? (
        <>
          {/* Summary Card */}
          <div
            className="rounded-xl border border-gray-200 bg-white p-6"
            style={{ borderLeftWidth: 4, borderLeftColor: color }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {detail.operator_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Period: {latest.period} | Rank #{latest.rank}
                </p>
              </div>
              <ScoreGauge score={Number(latest.composite_score)} size="lg" />
            </div>

            {/* Dimension scores with metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <DimensionCard
                label="Coverage"
                score={Number(latest.coverage_score)}
                weight={latest.metadata.weights.coverage}
                color={DIMENSION_COLORS.COVERAGE}
              >
                <p className="text-xs text-gray-500">
                  {latest.metadata.coverage?.area_count ? latest.metadata.coverage.area_count : "N/A"} coverage areas
                </p>
                <p className="text-xs text-gray-500">
                  Avg: {latest.metadata.coverage?.avg_coverage_pct ? latest.metadata.coverage.avg_coverage_pct.toFixed(1) : "N/A"}%
                </p>
              </DimensionCard>

              <DimensionCard
                label="QoE"
                score={Number(latest.qoe_score)}
                weight={latest.metadata.weights.qoe}
                color={DIMENSION_COLORS.QOE}
              >
                <p className="text-xs text-gray-500">
                  {latest.metadata.qoe?.report_count ? latest.metadata.qoe.report_count : "N/A"} citizen reports
                </p>
                <p className="text-xs text-gray-500">
                  Avg rating: {latest.metadata.qoe?.avg_rating ? latest.metadata.qoe.avg_rating.toFixed(2) : "N/A"} / 5
                </p>
              </DimensionCard>

              <DimensionCard
                label="Complaints"
                score={Number(latest.complaints_score)}
                weight={latest.metadata.weights.complaints}
                color={DIMENSION_COLORS.COMPLAINTS}
              >
                <p className="text-xs text-gray-500">
                  {latest.metadata.complaints?.complaint_count} complaints
                </p>
                <p className="text-xs text-gray-500">
                  {latest.metadata.complaints?.resolved_count} resolved (
                  {latest.metadata.complaints?.resolution_rate_pct ? latest.metadata.complaints.resolution_rate_pct.toFixed(0) : "N/A"}%)
                </p>
              </DimensionCard>

              <DimensionCard
                label="QoS"
                score={Number(latest.qos_score)}
                weight={latest.metadata.weights.qos}
                color={DIMENSION_COLORS.QOS}
              >
                <p className="text-xs text-gray-500">
                  {latest.metadata.qos?.metric_count ? latest.metadata.qos.metric_count : "N/A"} QoS metrics
                </p>
              </DimensionCard>
            </div>

            {/* QoS Metric Detail table */}
            {latest.metadata.qos?.metrics.length && latest.metadata.qos.metrics.length > 0 ? (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  QoS Metric Compliance
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="py-2 pr-4 font-medium">Metric</th>
                        <th className="py-2 px-3 font-medium text-right">Value</th>
                        <th className="py-2 px-3 font-medium text-right">Benchmark</th>
                        <th className="py-2 px-3 font-medium text-right">Score</th>
                        <th className="py-2 pl-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latest.metadata.qos.metrics.map((m) => {
                        const meets =
                          m.metric === "DROP_RATE" || m.metric === "LATENCY"
                            ? m.value <= m.benchmark
                            : m.value >= m.benchmark;
                        return (
                          <tr
                            key={m.metric}
                            className="border-t border-gray-100"
                          >
                            <td className="py-2 pr-4 font-medium text-gray-900">
                              {m.metric.replace(/_/g, " ")}
                            </td>
                            <td className="py-2 px-3 text-right text-gray-700">
                              {m.value} {m.unit}
                            </td>
                            <td className="py-2 px-3 text-right text-gray-500">
                              {m.benchmark} {m.unit}
                            </td>
                            <td className="py-2 px-3 text-right font-semibold">
                              <span style={{ color: scoreColor(m.score) }}>
                                {m.score.toFixed(0)}
                              </span>
                            </td>
                            <td className="py-2 pl-3">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${meets ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                              >
                                {meets ? "MEETS" : "BELOW"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ): (<div>NULL</div>)}
          </div>

          {/* History Chart */}
          {historyChart.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Score History
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {detail.operator_name} — monthly dimension & composite scores
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historyChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="composite"
                    name="Composite"
                    stroke="#111827"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="coverage"
                    name="Coverage"
                    stroke={DIMENSION_COLORS.COVERAGE}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qoe"
                    name="QoE"
                    stroke={DIMENSION_COLORS.QOE}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="complaints"
                    name="Complaints"
                    stroke={DIMENSION_COLORS.COMPLAINTS}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qos"
                    name="QoS"
                    stroke={DIMENSION_COLORS.QOS}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-500 text-sm">
          No score data available for {detail.operator_name}.
        </div>
      )}
    </div>
  );
}

function DimensionCard({
  label,
  score,
  weight,
  children,
}: {
  label: string;
  score: number;
  weight: number;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-[10px] text-gray-400">
          w: {(weight * 100).toFixed(0)}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <ScoreGauge score={score} size="sm" />
        <div className="space-y-0.5">{children}</div>
      </div>
    </div>
  );
}
