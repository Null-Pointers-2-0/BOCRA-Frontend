"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Layer, PathOptions } from "leaflet";

type CoverageMapProps = {
  districtGeoJSON: GeoJSON.FeatureCollection | null;
  coverageGeoJSON: GeoJSON.FeatureCollection | null;
  showDistricts: boolean;
  showCoverage: boolean;
  showHeatMap: boolean;
  selectedOperator: string;
  operatorColors: Record<string, string>;
  getCoverageLevelColor: (level: string) => string;
  onDistrictClick: (districtId: string) => void;
};

const BOTSWANA_CENTER: [number, number] = [-22.3285, 24.6849];
const BOTSWANA_ZOOM = 6;

function heatMapColor(percentage: number): string {
  const p = Math.max(0, Math.min(100, percentage));
  if (p < 50) {
    const ratio = p / 50;
    const r = 239;
    const g = Math.round(68 + ratio * (158 - 68));
    const b = Math.round(68 + ratio * (11 - 68));
    return `rgb(${r},${g},${b})`;
  }
  const ratio = (p - 50) / 50;
  const r = Math.round(245 - ratio * (245 - 22));
  const g = Math.round(158 + ratio * (163 - 158));
  const b = Math.round(11 + ratio * (74 - 11));
  return `rgb(${r},${g},${b})`;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function CoverageMap({
  districtGeoJSON,
  coverageGeoJSON,
  showDistricts,
  showCoverage,
  showHeatMap,
  selectedOperator,
  operatorColors,
  getCoverageLevelColor,
  onDistrictClick,
}: CoverageMapProps) {
  const districtStyle = (feature: GeoJSON.Feature | undefined): PathOptions => {
    if (!feature) return {};
    const props = feature.properties || {};
    if (showHeatMap && props.avg_coverage !== undefined) {
      return {
        fillColor: heatMapColor(props.avg_coverage),
        fillOpacity: 0.6,
        color: "#374151",
        weight: 1,
      };
    }
    return {
      fillColor: "#e5e7eb",
      fillOpacity: 0.15,
      color: "#374151",
      weight: 1,
    };
  };

  const coverageStyle = (feature: GeoJSON.Feature | undefined): PathOptions => {
    if (!feature) return {};
    const props = feature.properties || {};
    const opCode = props.operator_code;
    if (selectedOperator && opCode !== selectedOperator) {
      return { fillOpacity: 0, opacity: 0 };
    }
    return {
      fillColor: operatorColors[opCode] || getCoverageLevelColor(props.coverage_level),
      fillOpacity: 0.35,
      color: operatorColors[opCode] || "#6b7280",
      weight: 1,
    };
  };

  const onEachDistrict = (feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties || {};
    const tooltip = `<div class="text-xs"><strong>${props.name}</strong><br/>Population: ${(props.population ?? 0).toLocaleString()}${props.avg_coverage !== undefined ? `<br/>Avg Coverage: ${props.avg_coverage.toFixed(1)}%` : ""}</div>`;
    layer.bindTooltip(tooltip);
    layer.on("click", () => {
      if (props.district_id || props.id) {
        onDistrictClick(props.district_id || props.id);
      }
    });
  };

  const onEachCoverage = (feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties || {};
    const tooltip = `<div class="text-xs"><strong>${props.operator_name || props.operator_code}</strong><br/>${props.technology} — ${props.coverage_percentage}%<br/>${props.district_name}</div>`;
    layer.bindTooltip(tooltip);
  };

  return (
    <MapContainer
      center={BOTSWANA_CENTER}
      zoom={BOTSWANA_ZOOM}
      className="h-full w-full"
      scrollWheelZoom
      zoomControl
    >
      <MapResizer />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {showDistricts && districtGeoJSON && (
        <GeoJSON
          key={`districts-${showHeatMap}`}
          data={districtGeoJSON}
          style={districtStyle}
          onEachFeature={onEachDistrict}
        />
      )}
      {showCoverage && coverageGeoJSON && (
        <GeoJSON
          key={`coverage-${selectedOperator}`}
          data={coverageGeoJSON}
          style={coverageStyle}
          onEachFeature={onEachCoverage}
        />
      )}
    </MapContainer>
  );
}
