// ── Coverage Level ──
export type CoverageLevel = "FULL" | "PARTIAL" | "MINIMAL" | "NONE";

// ── District ──
export type District = {
  id: string;
  name: string;
  code: string;
  region: string;
  population: number;
  area_sq_km: string;
  center_lat: string;
  center_lng: string;
  is_active: boolean;
};

// ── Coverage Operator ──
export type CoverageOperator = {
  id: string;
  name: string;
  code: string;
  logo: string | null;
  districts_covered: number;
  technologies: string[];
};

// ── Coverage Area ──
export type CoverageArea = {
  id: string;
  operator: string;
  operator_name: string;
  operator_code: string;
  district: string;
  district_name: string;
  district_code: string;
  technology: string;
  coverage_level: CoverageLevel;
  coverage_level_display: string;
  coverage_percentage: string;
  population_covered: number;
  signal_strength_avg: string;
  period: string;
  source: string;
  notes: string;
};

// ── Coverage Summary ──
export type OperatorSummary = {
  operator: string;
  operator_name: string;
  avg_coverage_percentage: number;
  districts_covered: number;
  total_districts: number;
  population_covered: number;
};

export type WhiteSpot = {
  district: string;
  district_code: string;
  district_id: string;
};

export type CoverageSummary = {
  period: string;
  technology: string;
  national_avg_coverage: number;
  total_districts: number;
  by_operator: OperatorSummary[];
  white_spots: WhiteSpot[];
  white_spot_count: number;
};

// ── Coverage Comparison ──
export type ComparisonRow = {
  district: string;
  district_code: string;
  district_id: string;
  operators: Record<
    string,
    { coverage_level: CoverageLevel; coverage_percentage: number }
  >;
};

export type CoverageComparison = {
  period: string;
  technology: string;
  operators: { code: string; name: string }[];
  comparison: ComparisonRow[];
};

// ── District Coverage Summary ──
export type DistrictOperatorCoverage = {
  operator: string;
  operator_name: string;
  technologies: Record<
    string,
    {
      coverage_level: CoverageLevel;
      coverage_percentage: number;
      population_covered: number;
      signal_strength_avg: number;
    }
  >;
};

export type DistrictCoverageSummary = {
  district: {
    id: string;
    name: string;
    code: string;
    population: number;
  };
  period: string;
  operators: DistrictOperatorCoverage[];
};

// ── Query Params ──
export type CoverageFilterParams = {
  technology?: string;
};
