"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  getCoverageSummary,
  getCoverageOperators,
  getCoverageComparison,
  getDistricts,
  getDistrictCoverageSummary,
  getDistrictsGeoJSON,
  getCoverageAreasGeoJSON,
} from "@/lib/api/clients/coverages";
import type {
  CoverageSummary,
  CoverageOperator,
  CoverageComparison,
  District,
  DistrictCoverageSummary,
  CoverageLevel,
} from "@/lib/api/types/coverages";
import {
  Spinner as SpinnerIcon,
  CellSignalFull as CellSignalFullIcon,
  ChartBar as ChartBarIcon,
  Warning as WarningCircleIcon,
  MapTrifold as MapIcon,
  Eye as EyeIcon,
  EyeSlash as EyeSlashIcon,
  ThermometerSimple as HeatIcon,
} from "@phosphor-icons/react";

const CoverageMap = dynamic(() => import("@/components/CoverageMap"), { ssr: false });

const TECHNOLOGIES = ["2G", "3G", "4G", "5G"] as const;

const OPERATOR_COLORS: Record<string, string> = {
  MASCOM: "#0073ae",
  ORANGE: "#f97316",
  BTCL: "#008265",
};

function getCoverageLevelColor(level: string) {
  switch (level) {
    case "FULL":
      return "#16a34a";
    case "PARTIAL":
      return "#f59e0b";
    case "MINIMAL":
      return "#ef4444";
    case "NONE":
      return "#6b7280";
    default:
      return "#d1d5db";
  }
}

type Tab = "map" | "summary" | "comparison" | "district";

export default function CoveragePage() {
  const [technology, setTechnology] = useState("4G");
  const [tab, setTab] = useState<Tab>("map");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map state
  const [districtGeoJSON, setDistrictGeoJSON] = useState<GeoJSON.FeatureCollection | null>(null);
  const [coverageGeoJSON, setCoverageGeoJSON] = useState<GeoJSON.FeatureCollection | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showCoverage, setShowCoverage] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [mapOperator, setMapOperator] = useState("");

  const [summary, setSummary] = useState<CoverageSummary | null>(null);
  const [operators, setOperators] = useState<CoverageOperator[]>([]);
  const [comparison, setComparison] = useState<CoverageComparison | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtSummary, setDistrictSummary] =
    useState<DistrictCoverageSummary | null>(null);
  const [districtLoading, setDistrictLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [sumRes, opRes, distRes, geoRes] = await Promise.all([
          getCoverageSummary({ technology }),
          getCoverageOperators(),
          getDistricts(),
          getDistrictsGeoJSON(),
        ]);
        if (sumRes.success) setSummary(sumRes.data);
        if (opRes.success) setOperators(opRes.data);
        if (distRes.success) setDistricts(distRes.data);
        if (geoRes.success) setDistrictGeoJSON(geoRes.data);
      } catch {
        setError("Failed to load coverage data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [technology]);

  // Load coverage overlay GeoJSON when map filters change
  const loadCoverageOverlay = useCallback(async () => {
    setMapLoading(true);
    const params: { operator?: string; technology?: string } = { technology };
    if (mapOperator) params.operator = mapOperator;
    const res = await getCoverageAreasGeoJSON(params);
    if (res.success) setCoverageGeoJSON(res.data);
    setMapLoading(false);
  }, [technology, mapOperator]);

  useEffect(() => {
    loadCoverageOverlay();
  }, [loadCoverageOverlay]);

  useEffect(() => {
    if (tab !== "comparison") return;
    setComparisonLoading(true);
    getCoverageComparison({ technology })
      .then((res) => {
        if (res.success) setComparison(res.data);
      })
      .catch(() => {})
      .finally(() => setComparisonLoading(false));
  }, [tab, technology]);

  useEffect(() => {
    if (!selectedDistrict) {
      setDistrictSummary(null);
      return;
    }
    setDistrictLoading(true);
    getDistrictCoverageSummary(selectedDistrict)
      .then((res) => {
        if (res.success) setDistrictSummary(res.data);
      })
      .catch(() => {})
      .finally(() => setDistrictLoading(false));
  }, [selectedDistrict]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "map", label: "Coverage Map" },
    { key: "summary", label: "National Summary" },
    { key: "comparison", label: "Operator Comparison" },
    { key: "district", label: "District Lookup" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6">
        <div className="w-full max-w-6xl mt-30 space-y-8 pb-16">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">Network Coverage</h1>
            <p className="text-gray-600 max-w-3xl">
              Interactive coverage visualization across Botswana&apos;s districts.
              Coverage data is collected and verified by BOCRA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Technology:</span>
            <div className="flex gap-2">
              {TECHNOLOGIES.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setTechnology(tech)}
                  className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                    technology === tech
                      ? "bg-[#0073ae] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  tab === t.key
                    ? "border-[#0073ae] text-[#0073ae]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
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
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && tab === "map" && (
            <MapTab
              districtGeoJSON={districtGeoJSON}
              coverageGeoJSON={coverageGeoJSON}
              operators={operators}
              showDistricts={showDistricts}
              showCoverage={showCoverage}
              showHeatMap={showHeatMap}
              mapOperator={mapOperator}
              mapLoading={mapLoading}
              onToggleDistricts={() => setShowDistricts((v) => !v)}
              onToggleCoverage={() => setShowCoverage((v) => !v)}
              onToggleHeatMap={() => setShowHeatMap((v) => !v)}
              onOperatorChange={setMapOperator}
              onDistrictClick={(id) => {
                setSelectedDistrict(id);
                setTab("district");
              }}
            />
          )}

          {!loading && !error && tab === "summary" && summary && (
            <SummaryTab
              summary={summary}
              operators={operators}
              technology={technology}
              onWhiteSpotClick={(id) => {
                setSelectedDistrict(id);
                setTab("district");
              }}
            />
          )}

          {!loading && !error && tab === "comparison" && (
            <ComparisonTab
              comparison={comparison}
              isLoading={comparisonLoading}
              technology={technology}
              onDistrictClick={(id) => {
                setSelectedDistrict(id);
                setTab("district");
              }}
            />
          )}

          {!loading && !error && tab === "district" && (
            <DistrictTab
              districts={districts}
              selectedDistrict={selectedDistrict}
              districtSummary={districtSummary}
              districtLoading={districtLoading}
              onSelect={setSelectedDistrict}
            />
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}

/* ── Summary Tab ── */
function SummaryTab({
  summary,
  operators,
  technology,
  onWhiteSpotClick,
}: {
  summary: CoverageSummary;
  operators: CoverageOperator[];
  technology: string;
  onWhiteSpotClick: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">National Avg ({technology})</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {summary.national_avg_coverage.toFixed(1)}%
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0073ae]/10">
              <CellSignalFullIcon className="text-[#0073ae]" size={20} weight="fill" />
            </div>
          </div>
        </div>
        {summary.by_operator.map((op) => {
          const color = OPERATOR_COLORS[op.operator] || "#6b7280";
          return (
            <div key={op.operator} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{op.operator_name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {op.avg_coverage_percentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {op.districts_covered}/{op.total_districts} districts |{" "}
                    {op.population_covered.toLocaleString()} pop
                  </p>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: color + "15" }}
                >
                  <ChartBarIcon size={20} weight="fill" style={{ color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400">Reporting period: {summary.period}</p>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Coverage by Operator</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-5 font-medium text-gray-500">Operator</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Coverage</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Districts</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Population</th>
                <th className="py-3 px-4 font-medium text-gray-500 w-40">Coverage</th>
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
                    <td className="py-3 px-4 text-right text-gray-700">
                      {op.avg_coverage_percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {op.districts_covered} / {op.total_districts}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {op.population_covered.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: Math.min(op.avg_coverage_percentage, 100) + "%",
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {summary.white_spots.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
            <WarningCircleIcon size={18} weight="fill" />
            White Spots ({summary.white_spot_count}) — No {technology} Coverage
          </h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {summary.white_spots.map((ws) => (
              <span
                key={ws.district_id}
                className="px-3 py-1 bg-white text-red-700 border border-red-200 rounded-lg text-sm cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => onWhiteSpotClick(ws.district_id)}
              >
                {ws.district}
              </span>
            ))}
          </div>
        </div>
      )}

      {operators.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Active Operators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {operators.map((op) => {
              const color = OPERATOR_COLORS[op.code] || "#6b7280";
              return (
                <div
                  key={op.id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                  style={{ borderLeftWidth: 4, borderLeftColor: color }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <p className="font-semibold text-gray-900">{op.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{op.districts_covered} districts covered</p>
                  <div className="flex gap-1.5 mt-2">
                    {op.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{ backgroundColor: color + "15", color }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Comparison Tab ── */
function ComparisonTab({
  comparison,
  isLoading,
  technology,
  onDistrictClick,
}: {
  comparison: CoverageComparison | null;
  isLoading: boolean;
  technology: string;
  onDistrictClick: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <SpinnerIcon className="animate-spin text-[#0073ae]" size={32} />
      </div>
    );
  }
  if (!comparison) {
    return <p className="text-gray-500 text-center py-12">No comparison data available.</p>;
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Operator Comparison — {technology}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Side-by-side coverage across all districts | Period: {comparison.period}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-5 font-medium text-gray-500">District</th>
              {comparison.operators.map((op) => {
                const color = OPERATOR_COLORS[op.code] || "#6b7280";
                return (
                  <th key={op.code} className="text-center py-3 px-4 font-medium" style={{ color }}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                      {op.name}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparison.comparison.map((row) => (
              <tr
                key={row.district_id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onDistrictClick(row.district_id)}
              >
                <td className="py-3 px-5 font-medium text-gray-900">
                  {row.district}
                  <span className="ml-1 text-xs text-gray-400">({row.district_code})</span>
                </td>
                {comparison.operators.map((op) => {
                  const data = row.operators[op.code];
                  if (!data) {
                    return (
                      <td key={op.code} className="text-center py-3 px-4 text-gray-400">--</td>
                    );
                  }
                  const color = getCoverageLevelColor(data.coverage_level);
                  return (
                    <td key={op.code} className="text-center py-3 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-full max-w-[120px] bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: data.coverage_percentage + "%",
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color }}>
                          {data.coverage_percentage.toFixed(0)}%
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
      <div className="px-5 py-3 border-t border-gray-200 flex items-center gap-6 text-xs text-gray-500">
        <span className="font-medium">Legend:</span>
        {[
          { level: "FULL", label: "Full (80-100%)", color: "#16a34a" },
          { level: "PARTIAL", label: "Partial (40-79%)", color: "#f59e0b" },
          { level: "MINIMAL", label: "Minimal (1-39%)", color: "#ef4444" },
          { level: "NONE", label: "No Coverage", color: "#6b7280" },
        ].map((item) => (
          <div key={item.level} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── District Tab ── */
function DistrictTab({
  districts,
  selectedDistrict,
  districtSummary,
  districtLoading,
  onSelect,
}: {
  districts: District[];
  selectedDistrict: string;
  districtSummary: DistrictCoverageSummary | null;
  districtLoading: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select District</label>
        <select
          value={selectedDistrict}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
        >
          <option value="">Choose a district...</option>
          {districts
            .filter((d) => d.is_active)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
        </select>
      </div>

      {districtLoading && (
        <div className="flex justify-center py-8">
          <SpinnerIcon className="animate-spin text-[#0073ae]" size={32} />
        </div>
      )}

      {!districtLoading && districtSummary && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {districtSummary.district.name}{" "}
              <span className="text-sm font-normal text-gray-400">
                ({districtSummary.district.code})
              </span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Population: {districtSummary.district.population.toLocaleString()} | Period:{" "}
              {districtSummary.period}
            </p>
          </div>

          {districtSummary.operators.length === 0 ? (
            <p className="text-gray-500 py-4">No coverage data for this district.</p>
          ) : (
            <div className="space-y-4">
              {districtSummary.operators.map((op) => {
                const color = OPERATOR_COLORS[op.operator] || "#6b7280";
                return (
                  <div
                    key={op.operator}
                    className="rounded-xl border border-gray-200 p-4"
                    style={{ borderLeftWidth: 4, borderLeftColor: color }}
                  >
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                      {op.operator_name}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(op.technologies).map(([tech, data]) => {
                        const lvlColor = getCoverageLevelColor(data.coverage_level);
                        return (
                          <div key={tech} className="rounded-lg bg-gray-50 p-3 text-center">
                            <p className="text-xs font-medium text-gray-500 mb-1">{tech}</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {data.coverage_percentage.toFixed(0)}%
                            </p>
                            <span
                              className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: lvlColor }}
                            >
                              {data.coverage_level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!districtLoading && !selectedDistrict && (
        <p className="text-gray-400 text-center py-8">
          Select a district to view coverage details.
        </p>
      )}
    </div>
  );
}

/* ── Map Tab ── */
function MapTab({
  districtGeoJSON,
  coverageGeoJSON,
  operators,
  showDistricts,
  showCoverage,
  showHeatMap,
  mapOperator,
  mapLoading,
  onToggleDistricts,
  onToggleCoverage,
  onToggleHeatMap,
  onOperatorChange,
  onDistrictClick,
}: {
  districtGeoJSON: GeoJSON.FeatureCollection | null;
  coverageGeoJSON: GeoJSON.FeatureCollection | null;
  operators: CoverageOperator[];
  showDistricts: boolean;
  showCoverage: boolean;
  showHeatMap: boolean;
  mapOperator: string;
  mapLoading: boolean;
  onToggleDistricts: () => void;
  onToggleCoverage: () => void;
  onToggleHeatMap: () => void;
  onOperatorChange: (code: string) => void;
  onDistrictClick: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Operator filter */}
        <select
          value={mapOperator}
          onChange={(e) => onOperatorChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0073ae] focus:ring-1 focus:ring-[#0073ae] outline-none"
        >
          <option value="">All Operators</option>
          {operators.map((op) => (
            <option key={op.code} value={op.code}>
              {op.name}
            </option>
          ))}
        </select>

        <div className="h-6 w-px bg-gray-200" />

        {/* Layer toggles */}
        <button
          onClick={onToggleDistricts}
          className={
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer " +
            (showDistricts
              ? "bg-[#0073ae] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200")
          }
        >
          {showDistricts ? <EyeIcon size={14} /> : <EyeSlashIcon size={14} />}
          Districts
        </button>

        <button
          onClick={onToggleCoverage}
          className={
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer " +
            (showCoverage
              ? "bg-[#0073ae] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200")
          }
        >
          {showCoverage ? <EyeIcon size={14} /> : <EyeSlashIcon size={14} />}
          Coverage
        </button>

        <button
          onClick={onToggleHeatMap}
          className={
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer " +
            (showHeatMap
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200")
          }
        >
          <HeatIcon size={14} />
          Heat Map
        </button>

        {mapLoading && (
          <SpinnerIcon className="animate-spin text-[#0073ae]" size={18} />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
        {showHeatMap ? (
          <div className="flex items-center gap-2">
            <span className="font-medium">Heat Map:</span>
            <div className="flex items-center gap-1">
              <span className="h-3 w-6 rounded" style={{ backgroundColor: "rgb(239, 68, 68)" }} />
              <span>0%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-6 rounded" style={{ backgroundColor: "rgb(239, 163, 0)" }} />
              <span>50%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-6 rounded" style={{ backgroundColor: "rgb(22, 163, 106)" }} />
              <span>100%</span>
            </div>
          </div>
        ) : mapOperator ? (
          <div className="flex items-center gap-3">
            <span className="font-medium">Coverage Level:</span>
            {["FULL", "PARTIAL", "MINIMAL", "NONE"].map((lvl) => (
              <div key={lvl} className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: getCoverageLevelColor(lvl) }}
                />
                <span className="capitalize">{lvl.toLowerCase()}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-medium">Operators:</span>
            {operators.map((op) => (
              <div key={op.code} className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: OPERATOR_COLORS[op.code] || "#6b7280" }}
                />
                <span>{op.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="rounded-xl border border-gray-200 overflow-hidden" style={{ height: 550 }}>
        <CoverageMap
          districtGeoJSON={districtGeoJSON}
          coverageGeoJSON={coverageGeoJSON}
          showDistricts={showDistricts}
          showCoverage={showCoverage}
          showHeatMap={showHeatMap}
          selectedOperator={mapOperator}
          operatorColors={OPERATOR_COLORS}
          onDistrictClick={onDistrictClick}
        />
      </div>

      <p className="text-xs text-gray-400">
        Click on a district to view detailed coverage information. Toggle layers
        using the controls above.
      </p>
    </div>
  );
}
