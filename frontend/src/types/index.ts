export interface VariableMetadata {
  identifier: string;
  name: string;
  description: string;
  units: string;
  original_source: string;
  dataset_lineage: string;
  spatial_resolution: string;
  temporal_resolution: string;
  available_range: string;
  geographic_coverage: string;
  documentation_url: string;
}

export interface LocationPreset {
  id: string;
  name: string;
  state_or_country: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface TimeSeriesPoint {
  date: string;
  year: number;
  month?: number | null;
  value?: number | null;
  baseline_anomaly?: number | null;
  rolling_mean_5yr?: number | null;
  ols_trend_value?: number | null;
  sens_trend_value?: number | null;
}

export interface StatisticalDiagnostics {
  n_observations: number;
  missing_count: number;
  missing_percentage: number;
  baseline_mean: number;
  baseline_std: number;
  min_value: number;
  max_value: number;
  lag1_autocorrelation: number;
  autocorrelation_significant: boolean;
}

export interface TrendStatistics {
  ols_slope_per_year: number;
  ols_slope_per_decade: number;
  ols_intercept: number;
  ols_r_squared: number;
  ols_p_value: number;
  ols_std_err: number;
  sens_slope_per_year: number;
  sens_slope_per_decade: number;
  sens_slope_ci_lower_per_decade: number;
  sens_slope_ci_upper_per_decade: number;
  mk_score: number;
  mk_variance: number;
  mk_tau: number;
  mk_z: number;
  mk_p_value: number;
  mk_trend: "increasing" | "decreasing" | "no trend";
  is_statistically_significant: boolean;
  significance_label: string;
  modified_mk_p_value?: number | null;
  total_change_over_period: number;
  percentage_change_over_period?: number | null;
  diagnostics: StatisticalDiagnostics;
}

export interface ScientificExplanation {
  question_what: string;
  question_where: string;
  question_how_much: string;
  question_are_changes_significant: string;
  scientific_synthesis: string;
  confidence_tier: "High Confidence" | "Moderate Confidence" | "Inconclusive / Low Signal";
  scientific_limitations: string[];
  citation: string;
}

export interface PointTrendResponse {
  status: string;
  variable_metadata: VariableMetadata;
  location: {
    name: string;
    state_or_country: string;
    latitude: number;
    longitude: number;
  };
  period: {
    start_year: number;
    end_year: number;
  };
  timeseries: TimeSeriesPoint[];
  statistics: TrendStatistics;
  scientific_explanation: ScientificExplanation;
  retrieval_timestamp: string;
  cache_hit: boolean;
}

export interface RegionalGridPoint {
  latitude: number;
  longitude: number;
  elevation_m?: number | null;
  mean_value: number;
  sens_slope_per_decade: number;
  ols_slope_per_decade: number;
  mk_p_value: number;
  is_significant: boolean;
  trend_direction: string;
  total_change: number;
}

export interface RegionalSummaryStatistics {
  total_grid_cells: number;
  significant_cells_count: number;
  significant_cells_percentage: number;
  regional_mean_slope_per_decade: number;
  min_slope_per_decade: number;
  max_slope_per_decade: number;
  fdr_significant_count?: number | null;
}

export interface RegionalTrendResponse {
  status: string;
  variable_metadata: VariableMetadata;
  bounding_box: {
    lat_min: number;
    lat_max: number;
    lon_min: number;
    lon_max: number;
  };
  period: {
    start_year: number;
    end_year: number;
  };
  grid_points: RegionalGridPoint[];
  summary_statistics: RegionalSummaryStatistics;
  scientific_explanation: ScientificExplanation;
  retrieval_timestamp: string;
  cache_hit: boolean;
}
