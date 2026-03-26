"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { coveragesClient } from "@/lib/api/clients";
import type {
  CoverageComparison,
  CoverageOperator,
  CoverageStats,
  CoverageSummary,
  DistrictCoverageSummary,
} from "@/lib/api/types";
import {
  Loader2,
  Signal,
  TrendingUp,
  Layers,
  MapPin,
  Eye,
  EyeOff,
  Flame,
  AlertTriangle,
  BarChart3,
  Map,
} from "lucide-react";
import HeaderSection from "@/components/HeaderSection";

const CoverageMap = dynamic(() => import("./coverage-map"), { ssr: false });

const OPERATOR_COLORS: Record<string, string> = {
  MASCOM: "#0073ae",
  ORANGE: "#f97316",
  BTCL: "#008265",
};

const TECHNOLOGIES = ["2G", "3G", "4G", "5G"];

type Tab = "map" | "comparison" | "stats";

function getCoverageLevelColor(level: string): string {
  switch (level) {
    case "FULL":
      return "#16a34a";
    case "PARTIAL":
      return "#f59e0b";
    case "MINIMAL":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

export default function CoveragePage() {
  const [operators, setOperators] = useState<CoverageOperator[]>([]);
  const [summary, setSummary] = useState<CoverageSummary | null>(null);
  const [comparison, setComparison] = useState<CoverageComparison | null>(null);
  const [stats, setStats] = useState<CoverageStats | null>(null);
  const [districtDetail, setDistrictDetail] =
    useState<DistrictCoverageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("map");

  // Filters
  const [selectedTech, setSelectedTech] = useState("4G");
  const [selectedOperator, setSelectedOperator] = useState("");

  // Map state
  const [districtGeoJSON, setDistrictGeoJSON] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [coverageGeoJSON, setCoverageGeoJSON] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showCoverage, setShowCoverage] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(false);

  // Initial data load
  useEffect(() => {
    async function load() {
      const [opRes, sumRes, distGeo, compRes, statsRes] = await Promise.all([
        coveragesClient.operators(),
        coveragesClient.summary({ technology: selectedTech }),
        coveragesClient.districtsGeoJSON(),
        coveragesClient.compare({ technology: selectedTech }),
        coveragesClient.stats({ technology: selectedTech }),
      ]);
      if (opRes.success) setOperators(opRes.data);
      if (sumRes.success) setSummary(sumRes.data);
      if (distGeo.success) setDistrictGeoJSON(distGeo.data);
      if (compRes.success) setComparison(compRes.data);
      if (statsRes.success) setStats(statsRes.data);
      setIsLoading(false);
    }
    load();
  }, [selectedTech]);

  // Load coverage overlay
  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;
    const params: Record<string, string> = { technology: selectedTech };
    if (selectedOperator) params.operator = selectedOperator;
    coveragesClient.areasGeoJSON(params).then((res) => {
      if (cancelled) return;
      if (res.success) setCoverageGeoJSON(res.data);
    });
    return () => { cancelled = true; };
  }, [selectedTech, selectedOperator, isLoading]);

  const handleDistrictClick = useCallback(async (districtId: string) => {
    const res = await coveragesClient.districtSummary(districtId);
    if (res.success) setDistrictDetail(res.data);
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

  const tabs: { key: Tab; label: string; icon: typeof Map }[] = [
    { key: "map", label: "Coverage Map", icon: Map },
    { key: "comparison", label: "Operator Comparison", icon: BarChart3 },
    { key: "stats", label: "Statistics", icon: TrendingUp },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col px-6">
        <div className="mt-20 md:mt-30 max-w-5xl mx-auto w-full space-y-5">
      {/* Header */}
      <div>
        <HeaderSection title="Network" textSize="text-5xl" pinkText="Coverage" description="Interactive coverage map for Botswana telecommunications operators"/>
        {summary && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Signal className="h-4 w-4" />
            Period: {summary.period}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  National Avg ({selectedTech})
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {summary.national_avg_coverage.toFixed(1)}%
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0073ae]/10">
                <Signal className="h-5 w-5 text-[#0073ae]" />
              </div>
            </div>
          </div>
          {summary.by_operator.map((op) => (
            <div
              key={op.operator}
              className="rounded-md border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {op.operator_name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {op.avg_coverage_percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {op.districts_covered}/{op.total_districts} districts |{" "}
                    {op.population_covered.toLocaleString()} pop covered
                  </p>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${OPERATOR_COLORS[op.operator] || "#6b7280"}15`,
                  }}
                >
                  <TrendingUp
                    className="h-5 w-5"
                    style={{
                      color: OPERATOR_COLORS[op.operator] || "#6b7280",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
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

      {/* Map Tab */}
      {activeTab === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Technology */}
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Technology
              </h3>
              <div className="flex flex-wrap gap-2">
                {TECHNOLOGIES.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    className={`px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium transition-colors ${
                      selectedTech === tech
                        ? "bg-[#0073ae] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Operator */}
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Signal className="h-4 w-4" />
                Operator
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedOperator("")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedOperator
                      ? "bg-[#0073ae]/10 text-[#0073ae] font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All Operators
                </button>
                {operators.map((op) => (
                  <button
                    key={op.code}
                    onClick={() => setSelectedOperator(op.code)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedOperator === op.code
                        ? "bg-[#0073ae]/10 text-[#0073ae] font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          OPERATOR_COLORS[op.code] || "#6b7280",
                      }}
                    />
                    {op.name}
                    <span className="ml-auto text-xs text-gray-400">
                      {op.districts_covered}d
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Map Layers */}
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Map Layers
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    onClick={() => setShowDistricts(!showDistricts)}
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                      showDistricts
                        ? "bg-[#0073ae] border-[#0073ae] text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {showDistricts && (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">District Boundaries</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    onClick={() => setShowCoverage(!showCoverage)}
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                      showCoverage
                        ? "bg-[#008265] border-[#008265] text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {showCoverage && (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  {showCoverage ? (
                    <Eye className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700">Coverage Overlay</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    onClick={() => setShowHeatMap(!showHeatMap)}
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                      showHeatMap
                        ? "bg-[#c60751] border-[#c60751] text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {showHeatMap && (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <Flame className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Heat Map Mode</span>
                </label>
              </div>
            </div>

            {/* Legend */}
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Coverage Legend</h3>
              <div className="space-y-2">
                {[
                  { level: "FULL", label: "Full (80-100%)", color: "#16a34a" },
                  { level: "PARTIAL", label: "Partial (40-79%)", color: "#f59e0b" },
                  { level: "MINIMAL", label: "Minimal (1-39%)", color: "#ef4444" },
                  { level: "NONE", label: "No Coverage", color: "#6b7280" },
                ].map((item) => (
                  <div key={item.level} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
              {showHeatMap && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Heat Map Gradient</p>
                  <div className="h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>

            {/* White Spots */}
            {summary && summary.white_spot_count > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  White Spots ({summary.white_spot_count})
                </h3>
                <p className="text-xs text-red-600 mb-2">
                  Districts with no meaningful {selectedTech} coverage:
                </p>
                <div className="space-y-1">
                  {summary.white_spots.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => handleDistrictClick(spot.id)}
                      className="block text-xs text-red-700 hover:text-red-900 hover:underline"
                    >
                      {spot.name} ({spot.code})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map + District Detail */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="h-[600px]">
                <CoverageMap
                  districtGeoJSON={districtGeoJSON}
                  coverageGeoJSON={coverageGeoJSON}
                  showDistricts={showDistricts}
                  showCoverage={showCoverage}
                  showHeatMap={showHeatMap}
                  selectedOperator={selectedOperator}
                  operatorColors={OPERATOR_COLORS}
                  getCoverageLevelColor={getCoverageLevelColor}
                  onDistrictClick={handleDistrictClick}
                />
              </div>
            </div>

            {/* District Detail Panel */}
            {districtDetail && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {districtDetail.district.name} ({districtDetail.district.code})
                  </h3>
                  <button
                    onClick={() => setDistrictDetail(null)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Close
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Population: {districtDetail.district.population.toLocaleString()} |
                  Period: {districtDetail.period}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 pr-4 font-medium text-gray-500">
                          Operator
                        </th>
                        {TECHNOLOGIES.map((t) => (
                          <th
                            key={t}
                            className="text-center py-2 px-3 font-medium text-gray-500"
                          >
                            {t}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {districtDetail.operators.map((op) => (
                        <tr
                          key={op.operator}
                          className="border-b border-gray-100"
                        >
                          <td className="py-2.5 pr-4 font-medium text-gray-900 flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  OPERATOR_COLORS[op.operator] || "#6b7280",
                              }}
                            />
                            {op.operator_name}
                          </td>
                          {TECHNOLOGIES.map((tech) => {
                            const data = op.technologies[tech];
                            if (!data) {
                              return (
                                <td
                                  key={tech}
                                  className="text-center py-2.5 px-3 text-gray-400"
                                >
                                  --
                                </td>
                              );
                            }
                            return (
                              <td key={tech} className="text-center py-2.5 px-3">
                                <span
                                  className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: `${getCoverageLevelColor(data.coverage_level)}15`,
                                    color: getCoverageLevelColor(data.coverage_level),
                                  }}
                                >
                                  {data.coverage_percentage}%
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === "comparison" && (
        <ComparisonTab
          comparison={comparison}
          operatorColors={OPERATOR_COLORS}
          selectedTech={selectedTech}
          getCoverageLevelColor={getCoverageLevelColor}
          onDistrictClick={handleDistrictClick}
        />
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <StatsTab stats={stats} operatorColors={OPERATOR_COLORS} />
      )}
    </div>
      </main>
      <Footer />
    </>
  );
}

// -- Comparison Tab -----------------------------------------------------------

function ComparisonTab({
  comparison,
  operatorColors,
  selectedTech,
  getCoverageLevelColor,
  onDistrictClick,
}: {
  comparison: CoverageComparison | null;
  operatorColors: Record<string, string>;
  selectedTech: string;
  getCoverageLevelColor: (level: string) => string;
  onDistrictClick: (id: string) => void;
}) {
  if (!comparison) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#0073ae]" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Operator Comparison - {selectedTech}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Side-by-side coverage comparison across all districts | Period:{" "}
          {comparison.period}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-5 font-medium text-gray-500">
                District
              </th>
              {comparison.operators.map((op) => (
                <th
                  key={op.code}
                  className="text-center py-3 px-4 font-medium"
                  style={{ color: operatorColors[op.code] || "#6b7280" }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: operatorColors[op.code] || "#6b7280",
                      }}
                    />
                    {op.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.comparison.map((row) => (
              <tr
                key={row.district_code}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onDistrictClick(row.district_id)}
              >
                <td className="py-3 px-5 font-medium text-gray-900">
                  {row.district}
                  <span className="ml-1 text-xs text-gray-400">
                    ({row.district_code})
                  </span>
                </td>
                {comparison.operators.map((op) => {
                  const data = row.operators[op.code];
                  if (!data) {
                    return (
                      <td
                        key={op.code}
                        className="text-center py-3 px-4 text-gray-400"
                      >
                        --
                      </td>
                    );
                  }
                  return (
                    <td key={op.code} className="text-center py-3 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-full max-w-[120px] bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${data.coverage_percentage}%`,
                              backgroundColor: getCoverageLevelColor(
                                data.coverage_level
                              ),
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{
                            color: getCoverageLevelColor(data.coverage_level),
                          }}
                        >
                          {data.coverage_percentage}%
                        </span>
                      </div>
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
}

// -- Stats Tab ----------------------------------------------------------------

function StatsTab({
  stats,
  operatorColors,
}: {
  stats: CoverageStats | null;
  operatorColors: Record<string, string>;
}) {
  if (!stats) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        Coverage statistics are not currently available.
      </div>
    );
  }

  const operatorCodes = stats.trends.length
    ? Object.keys(stats.trends[0].operators)
    : [];

  return (
    <div className="space-y-6">
      {/* Coverage Trends */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Coverage Growth Trend
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Average {stats.technology} coverage per operator over time
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-500">
                  Period
                </th>
                {operatorCodes.map((code) => (
                  <th
                    key={code}
                    className="text-center py-2 px-3 font-medium"
                    style={{ color: operatorColors[code] || "#6b7280" }}
                  >
                    {code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.trends.map((t) => (
                <tr key={t.period} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-700 font-mono text-xs">
                    {t.period}
                  </td>
                  {operatorCodes.map((code) => (
                    <td key={code} className="text-center py-2 px-3">
                      <span className="text-xs font-medium">
                        {t.operators[code]?.toFixed(1) ?? "--"}%
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* District Ranking */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          District Ranking
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Districts ranked by average {stats.technology} coverage
        </p>
        <div className="space-y-2">
          {stats.district_ranking.map((d, i) => (
            <div key={d.code} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 w-6 text-right">
                #{i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {d.district}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    {d.avg_coverage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${d.avg_coverage}%`,
                      backgroundColor:
                        d.avg_coverage >= 80
                          ? "#16a34a"
                          : d.avg_coverage >= 40
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>Total records: {stats.total_records.toLocaleString()}</span>
        <span>
          Periods: {stats.periods_available.length} quarters available
        </span>
      </div>
    </div>
  );
}
