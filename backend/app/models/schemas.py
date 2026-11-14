"""
Data schemas and metadata models for TerraTrend.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class VariableMetadata(BaseModel):
    identifier: str
    name: str
    description: str
    units: str
    original_source: str
    dataset_lineage: str
    spatial_resolution: str
    temporal_resolution: str
    available_range: str
    geographic_coverage: str
    documentation_url: str

class LocationPreset(BaseModel):
    id: str
    name: str
    state_or_country: str
    latitude: float
    longitude: float
    description: str

class TimeSeriesPoint(BaseModel):
    date: str
    year: int
    month: Optional[int] = None
    value: Optional[float] = None
    baseline_anomaly: Optional[float] = None
    rolling_mean_5yr: Optional[float] = None
    ols_trend_value: Optional[float] = None
    sens_trend_value: Optional[float] = None

class StatisticalDiagnostics(BaseModel):
    n_observations: int
    missing_count: int
    missing_percentage: float
    baseline_mean: float
    baseline_std: float
    min_value: float
    max_value: float
    lag1_autocorrelation: float
    autocorrelation_significant: bool

class TrendStatistics(BaseModel):
    # OLS Regression
    ols_slope_per_year: float
    ols_slope_per_decade: float
    ols_intercept: float
    ols_r_squared: float
    ols_p_value: float
    ols_std_err: float
    
    # Non-Parametric Mann-Kendall & Sen's Slope
    sens_slope_per_year: float
    sens_slope_per_decade: float
    sens_slope_ci_lower_per_decade: float
    sens_slope_ci_upper_per_decade: float
    mk_score: float
    mk_variance: float
    mk_tau: float
    mk_z: float
    mk_p_value: float
    mk_trend: str  # "increasing", "decreasing", "no trend"
    is_statistically_significant: bool
    significance_label: str  # "p < 0.001", "p < 0.01", "p < 0.05", "Not Significant (p >= 0.05)"
    
    # Autocorrelation-adjusted (Hamed & Rao / Yue & Wang)
    modified_mk_p_value: Optional[float] = None
    
    # Physical Change
    total_change_over_period: float
    percentage_change_over_period: Optional[float] = None
    
    # Diagnostics
    diagnostics: StatisticalDiagnostics

class ScientificExplanation(BaseModel):
    question_what: str
    question_where: str
    question_how_much: str
    question_are_changes_significant: str
    scientific_synthesis: str
    confidence_tier: str  # "High Confidence", "Moderate Confidence", "Inconclusive / Low Signal"
    scientific_limitations: List[str]
    citation: str

class PointTrendRequest(BaseModel):
    variable: str = Field(default="T2M", description="Variable identifier, e.g., T2M")
    latitude: float = Field(default=13.0827, ge=-90.0, le=90.0)
    longitude: float = Field(default=80.2707, ge=-180.0, le=180.0)
    start_year: int = Field(default=1981, ge=1981, le=2025)
    end_year: int = Field(default=2024, ge=1981, le=2025)
    temporal_aggregation: str = Field(default="annual", description="'annual', 'monthly', or 'seasonal'")

class PointTrendResponse(BaseModel):
    status: str
    variable_metadata: VariableMetadata
    location: Dict[str, Any]
    period: Dict[str, int]
    timeseries: List[TimeSeriesPoint]
    statistics: TrendStatistics
    scientific_explanation: ScientificExplanation
    retrieval_timestamp: str
    cache_hit: bool

class RegionalGridPoint(BaseModel):
    latitude: float
    longitude: float
    elevation_m: Optional[float] = None
    mean_value: float
    sens_slope_per_decade: float
    ols_slope_per_decade: float
    mk_p_value: float
    is_significant: bool
    is_fdr_significant: bool = False
    trend_direction: str
    total_change: float

class RegionalTrendRequest(BaseModel):
    variable: str = Field(default="T2M")
    lat_min: float = Field(default=8.5, ge=-90.0, le=90.0)
    lat_max: float = Field(default=13.5, ge=-90.0, le=90.0)
    lon_min: float = Field(default=76.5, ge=-180.0, le=180.0)
    lon_max: float = Field(default=80.5, ge=-180.0, le=180.0)
    start_year: int = Field(default=1990, ge=1981, le=2025)
    end_year: int = Field(default=2024, ge=1981, le=2025)

class RegionalSummaryStatistics(BaseModel):
    total_grid_cells: int
    significant_cells_count: int
    significant_cells_percentage: float
    regional_mean_slope_per_decade: float
    min_slope_per_decade: float
    max_slope_per_decade: float
    fdr_significant_count: Optional[int] = None  # Benjamini-Hochberg FDR corrected count
    positive_cells_count: int = 0
    negative_cells_count: int = 0
    has_opposing_trends: bool = False
    sig_positive_cells_count: int = 0
    sig_negative_cells_count: int = 0
    fdr_positive_cells_count: int = 0
    fdr_negative_cells_count: int = 0

class RegionalTrendResponse(BaseModel):
    status: str
    variable_metadata: VariableMetadata
    bounding_box: Dict[str, float]
    period: Dict[str, int]
    grid_points: List[RegionalGridPoint]
    summary_statistics: RegionalSummaryStatistics
    scientific_explanation: ScientificExplanation
    retrieval_timestamp: str
    cache_hit: bool
