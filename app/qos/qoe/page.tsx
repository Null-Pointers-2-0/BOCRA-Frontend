"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { qoeClient } from "@/lib/api/clients";
import type {
  QoECompareData,
  QoEHeatmapData,
  QoESpeedData,
  QoESummary,
  QoETrendsData,
} from "@/lib/api/types";
import {
  Loader2,
  BarChart3,
  Signal,
  TrendingUp,
  Gauge,
  Star,
  ArrowDown,
  Clock,
  Activity,
  MapPin,
  GitCompareArrows,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import HeaderSection from "@/components/HeaderSection";

const QoEHeatmap = dynamic(() => import("./qoe-heatmap"), { ssr: false });

type Tab = "dashboard" | "heatmap" | "trends" | "speeds" | "compare";

const OPERATOR_COLORS: Record<string, string> = {
  MASCOM: "#0073ae",
  ORANGE: "#f97316",
  BTCL: "#008265",
};

const CONNECTION_TYPES = ["2G", "3G", "4G", "5G"] as const;

function ratingColor(rating: number): string {
  if (rating >= 4) return "#16a34a";
  if (rating >= 3) return "#f59e0b";
  if (rating >= 2) return "#ef4444";
  return "#991b1b";
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={s <= Math.round(rating) ? "fill-current" : ""}
          style={{
            color: s <= Math.round(rating) ? "#f59e0b" : "#d1d5db",
            width: size,
            height: size,
          }}
        />
      ))}
    </div>
  );
}

export default function QoEPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<QoESummary | null>(null);

  useEffect(() => {
    qoeClient.summary({ days: 30 }).then((res) => {
      if (res.success) setSummary(res.data);
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

  const tabs: { key: Tab; label: string; icon: typeof BarChart3 }[] = [
    { key: "dashboard", label: "Dashboard", icon: BarChart3 },
    { key: "heatmap", label: "Heatmap", icon: MapPin },
    { key: "trends", label: "Trends", icon: TrendingUp },
    { key: "speeds", label: "Speed Tests", icon: Gauge },
    { key: "compare", label: "QoS vs QoE", icon: GitCompareArrows },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col px-6">
        <div className="mt-20 max-w-4xl mx-auto w-full space-y-5">
      {/* Header */}
      <HeaderSection title="Citizen QoE" pinkText="Reporter" textSize="text-2xl" description="Crowdsourced network experience reports from Botswana citizens"/>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Reports"
            value={summary.total_reports.toLocaleString()}
            sub={`Last ${summary.days} days`}
            icon={Activity}
            color="#0073ae"
          />
          <KpiCard
            label="Avg Rating"
            value={summary.avg_rating ? summary.avg_rating.toFixed(1) : "N/A"}
            sub={<StarRating rating={summary.avg_rating} size={12} />}
            icon={Star}
            color="#f59e0b"
          />
          <KpiCard
            label="Avg Download"
            value={`${summary.avg_download_mbps ? summary.avg_download_mbps.toFixed(1) : "N/A"} Mbps`}
            sub="Citizen speed tests"
            icon={ArrowDown}
            color="#008265"
          />
          <KpiCard
            label="Avg Latency"
            value={`${summary.avg_latency_ms ? summary.avg_latency_ms.toFixed(0) : "N/A"} ms`}
            sub="Network responsiveness"
            icon={Clock}
            color="#6366f1"
          />
        </div>
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

      {activeTab === "dashboard" && (
        <DashboardTab summary={summary} />
      )}
      {activeTab === "heatmap" && <HeatmapTab />}
      {activeTab === "trends" && <TrendsTab />}
      {activeTab === "speeds" && <SpeedsTab />}
      {activeTab === "compare" && <CompareTab />}
    </div>
      </main>
      <Footer />
    </>
  );
}

// -- KPI Card -----------------------------------------------------------------

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  icon: typeof BarChart3;
  color: string;
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="text-xs text-gray-400 mt-1">{sub}</div>
        </div>
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-3 w-3" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

// -- Dashboard Tab ------------------------------------------------------------

function DashboardTab({
  summary,
}: {
  summary: QoESummary | null;
}) {
  if (!summary) return null;

  const ratingData = Object.entries(summary.rating_distribution).map(
    ([rating, count]) => ({
      rating: `${rating} Star`,
      count,
      fill:
        Number(rating) >= 4
          ? "#16a34a"
          : Number(rating) === 3
            ? "#f59e0b"
            : "#ef4444",
    })
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operator Breakdown */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            By Operator
          </h3>
          <div className="space-y-4">
            {summary.by_operator.map((op) => (
              <div key={op.operator} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          OPERATOR_COLORS[op.operator] || "#6b7280",
                      }}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {op.operator_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{op.report_count} reports</span>
                    <span
                      className="font-semibold"
                      style={{ color: ratingColor(op.avg_rating) }}
                    >
                      {op.avg_rating ? op.avg_rating.toFixed(1) : "N/A"}
                    </span>
                    <StarRating rating={op.avg_rating} size={10} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-100 border border-gray-200 rounded-md p-2 text-center">
                    <p className="text-xs text-gray-900">Download</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {op.avg_download_mbps ? op.avg_download_mbps.toFixed(1) : "N/A"}
                      <span className="text-xs font-normal text-gray-900"> Mbps</span>
                    </p>
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-900">Upload</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {op.avg_upload_mbps ? op.avg_upload_mbps.toFixed(1) : "N/A"}
                      <span className="text-xs font-normal text-gray-900"> Mbps</span>
                    </p>
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-md p-2 text-center">
                    <p className="text-xs text-gray-900">Latency</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {op.avg_latency_ms ? op.avg_latency_ms.toFixed(0) : "N/A"}
                      <span className="text-xs font-normal text-gray-900"> ms</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="rounded-md border border-gray-200 bg-gray-50 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// -- Heatmap Tab --------------------------------------------------------------

function HeatmapTab() {
  const [heatmapData, setHeatmapData] = useState<QoEHeatmapData | null>(null);
  const [operatorFilter, setOperatorFilter] = useState("");
  const [connectionFilter, setConnectionFilter] = useState("");
  const [days, setDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const params: Record<string, string | number> = { days };
    if (operatorFilter) params.operator = operatorFilter;
    if (connectionFilter) params.connection_type = connectionFilter;
    qoeClient.heatmap(params).then((res) => {
      if (cancelled) return;
      if (res.success) setHeatmapData(res.data);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [operatorFilter, connectionFilter, days]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
          >
            <option value="">All Operators</option>
            <option value="MASCOM">Mascom</option>
            <option value="ORANGE">Orange</option>
            <option value="BTCL">BTCL</option>
          </select>
          <select
            value={connectionFilter}
            onChange={(e) => setConnectionFilter(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
          >
            <option value="">All Connections</option>
            {CONNECTION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            {[7, 30, 90, 180].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  days === d
                    ? "bg-[#0073ae] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Loader2 className="h-6 w-6 animate-spin text-[#0073ae]" />
            </div>
          ) : (
            <div className="h-[500px]">
              <QoEHeatmap districts={heatmapData?.districts || []} />
            </div>
          )}
        </div>

        {/* District List */}
        <div className="rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              District QoE Rankings
            </h3>
          </div>
          <div className="overflow-y-auto max-h-[452px]">
            {heatmapData?.districts
              .sort((a, b) => b.avg_rating - a.avg_rating)
              .map((d, i) => (
                <div
                  key={d.district_id}
                  className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <span className="text-xs font-bold text-gray-400 w-5 text-right">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {d.district_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {d.report_count} reports |{" "}
                      {d.avg_download_mbps ? d.avg_download_mbps.toFixed(1) : "N/A"} Mbps |{" "}
                      {d.avg_latency_ms ? d.avg_latency_ms.toFixed(0) : "N/A"} ms
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-sm font-bold"
                      style={{ color: ratingColor(d.avg_rating) }}
                    >
                      {d.avg_rating ? d.avg_rating.toFixed(1) : "N/A"}
                    </span>
                    <StarRating rating={d.avg_rating} size={8} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 text-xs text-gray-500">
        <span>Circle size = report count</span>
        <span>Circle color = avg rating</span>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span>1-2</span>
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span>3</span>
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span>4-5</span>
        </div>
      </div>
    </div>
  );
}

// -- Trends Tab ---------------------------------------------------------------

function TrendsTab() {
  const [trends, setTrends] = useState<QoETrendsData | null>(null);
  const [months, setMonths] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    qoeClient.trends({ months }).then((res) => {
      if (cancelled) return;
      if (res.success) setTrends(res.data);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [months]);

  if (isLoading || !trends) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#0073ae]" />
      </div>
    );
  }

  const operatorCodes = trends.trends.length
    ? Object.keys(trends.trends[0].operators)
    : [];

  const ratingChartData = trends.trends.map((t) => {
    const entry: Record<string, string | number> = { month: t.month };
    for (const code of operatorCodes) {
      entry[code] = t.operators[code]?.avg_rating ?? 0;
    }
    return entry;
  });

  const downloadChartData = trends.trends.map((t) => {
    const entry: Record<string, string | number> = { month: t.month };
    for (const code of operatorCodes) {
      entry[code] = t.operators[code]?.avg_download_mbps ?? 0;
    }
    return entry;
  });

  const volumeChartData = trends.trends.map((t) => {
    const entry: Record<string, string | number> = { month: t.month };
    for (const code of operatorCodes) {
      entry[code] = t.operators[code]?.report_count ?? 0;
    }
    return entry;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {[3, 6, 12].map((m) => (
          <button
            key={m}
            onClick={() => setMonths(m)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              months === m
                ? "bg-[#0073ae] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {m} months
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold mb-1">
            Average Rating Trend
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Monthly avg citizen rating per operator (1-5 stars)
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ratingChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {operatorCodes.map((code) => (
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

        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold mb-1">
            Download Speed Trend
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Monthly avg download speed per operator (Mbps)
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={downloadChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {operatorCodes.map((code) => (
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

        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-1">
            Report Volume
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Monthly QoE report submissions per operator
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {operatorCodes.map((code) => (
                <Bar
                  key={code}
                  dataKey={code}
                  name={code}
                  fill={OPERATOR_COLORS[code] || "#6b7280"}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// -- Speeds Tab ---------------------------------------------------------------

function SpeedsTab() {
  const [speedData, setSpeedData] = useState<QoESpeedData | null>(null);
  const [connectionFilter, setConnectionFilter] = useState("");
  const [days, setDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const params: Record<string, string | number> = { days };
    if (connectionFilter) params.connection_type = connectionFilter;
    qoeClient.speeds(params).then((res) => {
      if (cancelled) return;
      if (res.success) setSpeedData(res.data);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [connectionFilter, days]);

  if (isLoading || !speedData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#0073ae]" />
      </div>
    );
  }

  const radarChartData = [
    {
      metric: "Download",
      ...Object.fromEntries(
        speedData.operators.map((op) => [op.operator, op.download.avg_mbps])
      ),
    },
    {
      metric: "Upload",
      ...Object.fromEntries(
        speedData.operators.map((op) => [op.operator, op.upload.avg_mbps])
      ),
    },
    {
      metric: "Low Latency",
      ...Object.fromEntries(
        speedData.operators.map((op) => [
          op.operator,
          Math.max(0, 100 - op.latency.avg_ms),
        ])
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <select
          value={connectionFilter}
          onChange={(e) => setConnectionFilter(e.target.value)}
          className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
        >
          <option value="">All Connections</option>
          {CONNECTION_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                days === d
                  ? "bg-[#0073ae] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Operator Speed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {speedData.operators.map((op) => (
          <div
            key={op.operator}
            className="rounded-md border bg-gray-50 border-gray-200 p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: OPERATOR_COLORS[op.operator] || "#6b7280",
                }}
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {op.operator_name}
              </h3>
              <span className="ml-auto text-xs text-gray-400">
                {op.sample_count.toLocaleString()} tests
              </span>
            </div>

            <div className="space-y-4">
              <SpeedGauge
                label="Download"
                avg={op.download.avg_mbps}
                min={op.download.min_mbps}
                max={op.download.max_mbps}
                unit="Mbps"
                color="#0073ae"
                maxScale={50}
              />
              <SpeedGauge
                label="Upload"
                avg={op.upload.avg_mbps}
                min={op.upload.min_mbps}
                max={op.upload.max_mbps}
                unit="Mbps"
                color="#008265"
                maxScale={15}
              />
              <SpeedGauge
                label="Latency"
                avg={op.latency.avg_ms}
                min={op.latency.min_ms}
                max={op.latency.max_ms}
                unit="ms"
                color="#f59e0b"
                maxScale={400}
              />
            </div>

            {op.by_connection_type.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  By Connection Type
                </p>
                <div className="space-y-1.5">
                  {op.by_connection_type.map((ct) => (
                    <div
                      key={ct.connection_type}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-gray-700">
                        {ct.connection_type}
                      </span>
                      <div className="flex items-center gap-3 text-gray-500">
                        <span>{ct.sample_count} tests</span>
                        <span>
                          {ct.avg_download_mbps.toFixed(1)} /{" "}
                          {ct.avg_upload_mbps.toFixed(1)} Mbps
                        </span>
                        <span>{ct.avg_latency_ms.toFixed(0)} ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Radar Comparison */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-xl font-semibold mb-1">
          Operator Comparison Radar
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Higher = better (latency inverted: 100 - avg_ms)
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarChartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} />
            {speedData.operators.map((op) => (
              <Radar
                key={op.operator}
                name={op.operator_name}
                dataKey={op.operator}
                stroke={OPERATOR_COLORS[op.operator] || "#6b7280"}
                fill={OPERATOR_COLORS[op.operator] || "#6b7280"}
                fillOpacity={0.15}
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

function SpeedGauge({
  label,
  avg,
  min,
  max,
  unit,
  color,
  maxScale,
}: {
  label: string;
  avg: number;
  min: number;
  max: number;
  unit: string;
  color: string;
  maxScale: number;
}) {
  const pct = Math.min(100, (avg / maxScale) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-sm font-bold text-gray-900">
          {avg.toFixed(1)} <span className="text-xs font-normal text-gray-400">{unit}</span>
        </span>
      </div>
      <div className="relative w-full h-2 bg-gray-100 rounded-full">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between mt-0.5 text-[10px] text-gray-400">
        <span>min {min.toFixed(1)}</span>
        <span>max {max.toFixed(1)}</span>
      </div>
    </div>
  );
}

// -- Compare Tab (QoS vs QoE) -------------------------------------------------

function CompareTab() {
  const [compareData, setCompareData] = useState<QoECompareData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    qoeClient.compare().then((res) => {
      if (res.success) setCompareData(res.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#0073ae]" />
      </div>
    );
  }

  if (!compareData) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        QoS vs QoE comparison data is not currently available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          QoS vs QoE Comparison
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Operator-reported QoS metrics vs citizen-reported QoE experience.
          QoE window: {compareData.qoe_window_days} days | QoS period: {compareData.qos_period}
        </p>
      </div>

      {compareData.comparison.map((op) => (
        <div
          key={op.operator}
          className="rounded-xl border border-gray-200 bg-white overflow-hidden"
        >
          <div
            className="px-5 py-4 border-b border-gray-200 flex items-center gap-3"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: OPERATOR_COLORS[op.operator] || "#6b7280",
            }}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: OPERATOR_COLORS[op.operator] || "#6b7280",
              }}
            />
            <h4 className="text-lg font-semibold text-gray-900">
              {op.operator_name}
            </h4>
            <span className="text-xs text-gray-400 ml-2">
              {op.citizen_qoe.report_count} citizen reports
            </span>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Citizen QoE */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#f59e0b]" />
                  Citizen-Reported (QoE)
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    label="Avg Rating"
                    value={op.citizen_qoe.avg_rating.toFixed(1)}
                    sub="/5 stars"
                  />
                  <MetricCard
                    label="Download"
                    value={op.citizen_qoe.avg_download_mbps.toFixed(1)}
                    sub="Mbps"
                  />
                  <MetricCard
                    label="Upload"
                    value={op.citizen_qoe.avg_upload_mbps.toFixed(1)}
                    sub="Mbps"
                  />
                  <MetricCard
                    label="Latency"
                    value={op.citizen_qoe.avg_latency_ms.toFixed(0)}
                    sub="ms"
                  />
                </div>
              </div>

              {/* Operator QoS */}
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Signal className="h-4 w-4 text-[#0073ae]" />
                  Operator-Reported (QoS)
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(op.operator_qos.metrics).map(
                    ([key, metric]) => {
                      const meetsTarget =
                        key === "DROP_RATE" || key === "LATENCY"
                          ? metric.value <= metric.benchmark
                          : metric.value >= metric.benchmark;
                      return (
                        <div
                          key={key}
                          className={`rounded-lg p-3 border ${meetsTarget ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                        >
                          <p className="text-xs text-gray-500">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {metric.value}
                            <span className="text-xs font-normal text-gray-400 ml-0.5">
                              {metric.unit}
                            </span>
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Benchmark: {metric.benchmark} {metric.unit}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Discrepancy highlight */}
            {op.operator_qos.metrics.DATA_SPEED && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <GitCompareArrows className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Speed discrepancy:</span>
                  <span className="font-semibold text-gray-900">
                    Operator reports{" "}
                    {op.operator_qos.metrics.DATA_SPEED.value.toFixed(1)} Mbps
                  </span>
                  <span className="text-gray-400">vs</span>
                  <span className="font-semibold text-gray-900">
                    Citizens experience{" "}
                    {op.citizen_qoe.avg_download_mbps.toFixed(1)} Mbps
                  </span>
                  {op.operator_qos.metrics.DATA_SPEED.value >
                    op.citizen_qoe.avg_download_mbps * 1.3 && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-medium">
                      Significant gap
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-bold text-gray-900">
        {value}
        <span className="text-xs font-normal text-gray-400 ml-0.5">{sub}</span>
      </p>
    </div>
  );
}
