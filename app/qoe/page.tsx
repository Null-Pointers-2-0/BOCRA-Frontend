"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  getQoESummary,
  getQoETrends,
  getQoESpeeds,
  getQoEDistricts,
} from "@/lib/api/clients/qoe";
import type {
  QoESummary,
  QoETrendsData,
  QoESpeedData,
  QoEDistrictItem,
} from "@/lib/api/types/qoe";
import {
  Spinner as SpinnerIcon,
  Star as StarIcon,
  WifiHigh as WifiHighIcon,
  ChartLineUp as ChartLineUpIcon,
  ArrowDown as ArrowDownIcon,
  Timer as TimerIcon,
  MapPin as MapPinIcon,
} from "@phosphor-icons/react";

const OPERATOR_COLORS: Record<string, string> = {
  MASCOM: "#0073ae",
  ORANGE: "#f97316",
  BTCL: "#008265",
};

function StarRating({ rating, maxStars = 5 }: { rating: number; maxStars?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => (
        <StarIcon
          key={i}
          size={16}
          weight={i < Math.round(rating) ? "fill" : "regular"}
          className={i < Math.round(rating) ? "text-amber-400" : "text-gray-300"}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

function SpeedGauge({
  value,
  maxValue,
  label,
  unit,
  color,
}: {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  color: string;
}) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: pct.toString() + "%", backgroundColor: color }}
        />
      </div>
    </div>
  );
}

type Tab = "dashboard" | "trends" | "speeds" | "districts";

export default function QoEPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<QoESummary | null>(null);

  const [trends, setTrends] = useState<QoETrendsData | null>(null);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsPeriod, setTrendsPeriod] = useState(6);

  const [speeds, setSpeeds] = useState<QoESpeedData | null>(null);
  const [speedsLoading, setSpeedsLoading] = useState(false);

  const [districts, setDistricts] = useState<QoEDistrictItem[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getQoESummary()
      .then((res) => {
        if (res.success) setSummary(res.data);
        else setError(res.message || "Failed to load");
      })
      .catch(() => setError("Failed to load QoE data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== "trends") return;
    setTrendsLoading(true);
    getQoETrends({ months: trendsPeriod })
      .then((res) => {
        if (res.success) setTrends(res.data);
      })
      .catch(() => {})
      .finally(() => setTrendsLoading(false));
  }, [tab, trendsPeriod]);

  useEffect(() => {
    if (tab !== "speeds") return;
    setSpeedsLoading(true);
    getQoESpeeds()
      .then((res) => {
        if (res.success) setSpeeds(res.data);
      })
      .catch(() => {})
      .finally(() => setSpeedsLoading(false));
  }, [tab]);

  useEffect(() => {
    if (tab !== "districts") return;
    setDistrictsLoading(true);
    getQoEDistricts()
      .then((res) => {
        if (res.success) setDistricts(res.data);
      })
      .catch(() => {})
      .finally(() => setDistrictsLoading(false));
  }, [tab]);

  const tabList: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "trends", label: "Trends" },
    { key: "speeds", label: "Speed Tests" },
    { key: "districts", label: "By District" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-6xl mt-30 space-y-8 pb-16">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Quality of Experience</h1>
            <p className="text-gray-600 max-w-3xl">
              Consumer-reported quality metrics across Botswana&apos;s telecommunications
              operators. Data sourced from crowdsourced speed tests and user reports.
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

          {!loading && !error && tab === "dashboard" && summary && (
            <DashboardTab summary={summary} />
          )}

          {!loading && !error && tab === "trends" && (
            <TrendsTab
              trends={trends}
              isLoading={trendsLoading}
              period={trendsPeriod}
              onPeriodChange={setTrendsPeriod}
            />
          )}

          {!loading && !error && tab === "speeds" && (
            <SpeedsTab speeds={speeds} isLoading={speedsLoading} />
          )}

          {!loading && !error && tab === "districts" && (
            <DistrictsTab districts={districts} isLoading={districtsLoading} />
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}

/* Dashboard Tab */
function DashboardTab({ summary }: { summary: QoESummary }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Reports",
            value: summary.total_reports.toLocaleString(),
            icon: <ChartLineUpIcon className="text-[#0073ae]" size={20} weight="fill" />,
            iconBg: "bg-[#0073ae]/10",
          },
          {
            label: "Avg Rating",
            value: summary.avg_rating.toFixed(1) + " / 5",
            icon: <StarIcon className="text-amber-500" size={20} weight="fill" />,
            iconBg: "bg-amber-50",
          },
          {
            label: "Avg Download",
            value: summary.avg_download_mbps.toFixed(1) + " Mbps",
            icon: <ArrowDownIcon className="text-emerald-600" size={20} weight="bold" />,
            iconBg: "bg-emerald-50",
          },
          {
            label: "Avg Latency",
            value: summary.avg_latency_ms.toFixed(0) + " ms",
            icon: <TimerIcon className="text-violet-600" size={20} weight="fill" />,
            iconBg: "bg-violet-50",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
              </div>
              <div className={"flex h-10 w-10 items-center justify-center rounded-lg " + kpi.iconBg}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">Period: Last {summary.days} days</p>

      {/* Operator Breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Operator Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-5 font-medium text-gray-500">Operator</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Rating</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Download</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Upload</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Latency</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Reports</th>
              </tr>
            </thead>
            <tbody>
              {summary.by_operator.map((op) => {
                const color = OPERATOR_COLORS[op.operator] || "#6b7280";
                return (
                  <tr key={op.operator} className="border-b border-gray-100">
                    <td className="py-3 px-5 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                        {op.operator_name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <StarRating rating={op.avg_rating} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {op.avg_download_mbps.toFixed(1)} Mbps
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {op.avg_upload_mbps.toFixed(1)} Mbps
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {op.avg_latency_ms.toFixed(0)} ms
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {op.report_count.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rating Distribution */}
      {summary.rating_distribution && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.rating_distribution[star.toString()] || 0;
              const total = Object.values(summary.rating_distribution).reduce(
                (a: number, b: number) => a + b,
                0
              );
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-700">{star}</span>
                    <StarIcon size={14} weight="fill" className="text-amber-400" />
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: pct.toString() + "%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right">
                    {count.toLocaleString()} ({pct.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* Trends Tab */
function TrendsTab({
  trends,
  isLoading,
  period,
  onPeriodChange,
}: {
  trends: QoETrendsData | null;
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
  if (!trends || trends.trends.length === 0) {
    return <p className="text-gray-500 text-center py-12">No trends data available.</p>;
  }

  // Extract unique operator codes from first month
  const operatorCodes = Object.keys(trends.trends[0]?.operators || {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">QoE Trends</h3>
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

      {/* Rating trend */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Rating Over Time</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-5 font-medium text-gray-500">Month</th>
                {operatorCodes.map((code) => {
                  const color = OPERATOR_COLORS[code] || "#6b7280";
                  const name = trends.trends[0]?.operators[code]?.operator_name || code;
                  return (
                    <th key={code} className="text-center py-3 px-4 font-medium" style={{ color }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        {name}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {trends.trends.map((entry) => (
                <tr key={entry.month} className="border-b border-gray-100">
                  <td className="py-2.5 px-5 font-medium text-gray-700">{entry.month}</td>
                  {operatorCodes.map((code) => {
                    const val = entry.operators[code]?.avg_rating;
                    return (
                      <td key={code} className="text-center py-2.5 px-4">
                        {val != null ? (
                          <div className="flex items-center justify-center gap-1">
                            <StarIcon size={12} weight="fill" className="text-amber-400" />
                            <span className="text-gray-700">{val.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
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

      {/* Download speed trend */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Download Speed Over Time</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-5 font-medium text-gray-500">Month</th>
                {operatorCodes.map((code) => (
                  <th
                    key={code}
                    className="text-center py-3 px-4 font-medium"
                    style={{ color: OPERATOR_COLORS[code] || "#6b7280" }}
                  >
                    {trends.trends[0]?.operators[code]?.operator_name || code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trends.trends.map((entry) => (
                <tr key={entry.month} className="border-b border-gray-100">
                  <td className="py-2.5 px-5 font-medium text-gray-700">{entry.month}</td>
                  {operatorCodes.map((code) => {
                    const val = entry.operators[code]?.avg_download_mbps;
                    return (
                      <td key={code} className="text-center py-2.5 px-4 text-gray-700">
                        {val != null ? val.toFixed(1) + " Mbps" : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Speeds Tab */
function SpeedsTab({
  speeds,
  isLoading,
}: {
  speeds: QoESpeedData | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <SpinnerIcon className="animate-spin text-[#0073ae]" size={32} />
      </div>
    );
  }
  if (!speeds || speeds.operators.length === 0) {
    return <p className="text-gray-500 text-center py-12">No speed data available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Speed Test Results</h3>
        <span className="text-xs text-gray-400">Last {speeds.days} days</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {speeds.operators.map((op) => {
          const color = OPERATOR_COLORS[op.operator] || "#6b7280";
          return (
            <div
              key={op.operator}
              className="rounded-xl border border-gray-200 bg-white p-5"
              style={{ borderTopWidth: 3, borderTopColor: color }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  <h4 className="font-semibold text-gray-900">{op.operator_name}</h4>
                </div>
                <span className="text-xs text-gray-400">
                  {op.sample_count.toLocaleString()} tests
                </span>
              </div>

              <div className="space-y-3">
                <SpeedGauge
                  label="Download"
                  value={op.download.avg_mbps}
                  maxValue={100}
                  unit="Mbps"
                  color="#16a34a"
                />
                <SpeedGauge
                  label="Upload"
                  value={op.upload.avg_mbps}
                  maxValue={50}
                  unit="Mbps"
                  color="#0073ae"
                />
                <SpeedGauge
                  label="Latency"
                  value={op.latency.avg_ms}
                  maxValue={200}
                  unit="ms"
                  color="#f59e0b"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Peak DL</span>
                  <p className="font-semibold text-gray-900">{op.download.max_mbps.toFixed(1)} Mbps</p>
                </div>
                <div>
                  <span className="text-gray-500">Peak UL</span>
                  <p className="font-semibold text-gray-900">{op.upload.max_mbps.toFixed(1)} Mbps</p>
                </div>
              </div>

              {/* Connection type breakdown */}
              {op.by_connection_type.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 font-medium">By Connection</p>
                  <div className="space-y-1.5">
                    {op.by_connection_type.map((ct) => (
                      <div key={ct.connection_type} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{ct.connection_type}</span>
                        <span className="font-medium text-gray-800">
                          {ct.avg_download_mbps.toFixed(1)} / {ct.avg_upload_mbps.toFixed(1)} Mbps
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Districts Tab */
function DistrictsTab({
  districts,
  isLoading,
}: {
  districts: QoEDistrictItem[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <SpinnerIcon className="animate-spin text-[#0073ae]" size={32} />
      </div>
    );
  }
  if (districts.length === 0) {
    return <p className="text-gray-500 text-center py-12">No district data available.</p>;
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">QoE by District</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-5 font-medium text-gray-500">District</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500">Rating</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Reports</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((d) => (
              <tr key={d.district_id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-5 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={16} className="text-gray-400" />
                    {d.district_name}
                    <span className="text-xs text-gray-400">({d.district_code})</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <StarRating rating={d.avg_rating} />
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {d.report_count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
