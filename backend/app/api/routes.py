"""
FastAPI Routes for TerraTrend Earth System Intelligence Platform.
"""
from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Query
import numpy as np
import pymannkendall as pmk

from app.models.catalog import VARIABLES_CATALOG, PRESET_LOCATIONS, REGIONAL_PRESETS
from app.models.schemas import (
    VariableMetadata,
    LocationPreset,
    PointTrendRequest,
    PointTrendResponse,
    RegionalTrendRequest,
    RegionalTrendResponse,
    RegionalGridPoint,
    RegionalSummaryStatistics
)
from app.services.nasa_power import nasa_service
from app.services.statistics import trend_engine
from app.services.insight_engine import insight_engine

router = APIRouter()

@router.get("/health")
def api_health():
    """Health check endpoint for API routes."""
    return {"status": "healthy", "service": "TerraTrend API"}

@router.get("/variables", response_model=Dict[str, VariableMetadata])
def get_variables():
    """Retrieve all supported NASA variables with complete scientific lineage metadata."""
    return VARIABLES_CATALOG

@router.get("/locations")
def get_locations():
    """Retrieve preset demonstration locations and regional bounding boxes."""
    return {
        "presets": PRESET_LOCATIONS,
        "regions": REGIONAL_PRESETS
    }

@router.post("/trend/point", response_model=PointTrendResponse)
def analyze_point_trend(req: PointTrendRequest):
    """
    Analyzes historical trends for a specific point location using official NASA POWER data.
    Computes OLS, Mann-Kendall test, Sen's slope with 95% CI, autocorrelation check,
    and returns evidence-grounded scientific explanations.
    """
    if req.variable not in VARIABLES_CATALOG:
        raise HTTPException(
            status_code=400,
            detail=f"Variable '{req.variable}' is not supported. Supported: {list(VARIABLES_CATALOG.keys())}"
        )
    if req.start_year > req.end_year:
        raise HTTPException(status_code=400, detail="start_year cannot be greater than end_year.")
    if (req.end_year - req.start_year) < 4:
        raise HTTPException(status_code=400, detail="Minimum observation window of 5 years required.")

    var_meta = VARIABLES_CATALOG[req.variable]

    try:
        raw_data, is_cache_hit = nasa_service.fetch_point_data(
            variable=req.variable,
            latitude=req.latitude,
            longitude=req.longitude,
            start_year=req.start_year,
            end_year=req.end_year
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"NASA POWER API retrieval error: {str(e)}")

    raw_records = nasa_service.parse_point_series(
        raw_data=raw_data,
        variable=req.variable,
        aggregation=req.temporal_aggregation
    )

    if not raw_records:
        raise HTTPException(
            status_code=404,
            detail=f"No valid data records returned by NASA POWER for {req.variable} at ({req.latitude}, {req.longitude})."
        )

    try:
        timeseries, stats = trend_engine.analyze_timeseries(raw_records, alpha=0.05)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Statistical computation error: {str(e)}")

    # Check if coords match a preset name
    loc_name = f"Latitude {req.latitude:.4f}, Longitude {req.longitude:.4f}"
    state_or_country = "Custom Geographic Point"
    for preset in PRESET_LOCATIONS:
        if abs(preset.latitude - req.latitude) < 0.05 and abs(preset.longitude - req.longitude) < 0.05:
            loc_name = preset.name
            state_or_country = preset.state_or_country
            break

    location_info = {
        "name": loc_name,
        "state_or_country": state_or_country,
        "latitude": req.latitude,
        "longitude": req.longitude
    }

    explanation = insight_engine.generate_point_explanation(
        var_meta=var_meta,
        location_info=location_info,
        start_year=req.start_year,
        end_year=req.end_year,
        stats=stats
    )

    return PointTrendResponse(
        status="success",
        variable_metadata=var_meta,
        location=location_info,
        period={"start_year": req.start_year, "end_year": req.end_year},
        timeseries=timeseries,
        statistics=stats,
        scientific_explanation=explanation,
        retrieval_timestamp=datetime.now(timezone.utc).isoformat(),
        cache_hit=is_cache_hit
    )

@router.post("/trend/regional", response_model=RegionalTrendResponse)
def analyze_regional_trend(req: RegionalTrendRequest):
    """
    Analyzes spatial multi-cell trends across a geographic bounding box using NASA POWER regional data.
    Computes Sen's slope and Mann-Kendall significance for each cell,
    and applies Benjamini-Hochberg False Discovery Rate correction across the spatial domain.
    """
    if req.variable not in VARIABLES_CATALOG:
        raise HTTPException(
            status_code=400,
            detail=f"Variable '{req.variable}' is not supported. Supported: {list(VARIABLES_CATALOG.keys())}"
        )
    if req.start_year > req.end_year:
        raise HTTPException(status_code=400, detail="start_year cannot be greater than end_year.")
    if (req.end_year - req.start_year) < 4:
        raise HTTPException(status_code=400, detail="Minimum observation window of 5 years required.")

    var_meta = VARIABLES_CATALOG[req.variable]

    try:
        raw_data, is_cache_hit = nasa_service.fetch_regional_data(
            variable=req.variable,
            lat_min=req.lat_min,
            lat_max=req.lat_max,
            lon_min=req.lon_min,
            lon_max=req.lon_max,
            start_year=req.start_year,
            end_year=req.end_year
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"NASA Regional API error: {str(e)}")

    features = raw_data.get("features", [])
    fill_value = float(raw_data.get("header", {}).get("fill_value", -999.0))

    if not features:
        raise HTTPException(
            status_code=404,
            detail="No spatial grid features returned by NASA POWER for the requested bounding box."
        )

    grid_points: List[RegionalGridPoint] = []
    p_values: List[float] = []
    slopes: List[float] = []

    span_years = req.end_year - req.start_year + 1

    for feat in features:
        geom = feat.get("geometry", {})
        coords = geom.get("coordinates", [])
        if len(coords) < 2:
            continue
        lon = float(coords[0])
        lat = float(coords[1])
        elevation = float(coords[2]) if len(coords) >= 3 else None

        param_dict = feat.get("properties", {}).get("parameter", {}).get(req.variable, {})
        
        # Extract annual values (YYYY13)
        annual_vals = []
        for yr in range(req.start_year, req.end_year + 1):
            key = f"{yr}13"
            v = param_dict.get(key)
            if v is not None and abs(v - fill_value) > 1e-4 and v > -900.0:
                annual_vals.append(float(v))
            else:
                annual_vals.append(np.nan)

        valid_arr = np.array(annual_vals, dtype=float)
        non_nan = valid_arr[~np.isnan(valid_arr)]
        if len(non_nan) < 5:
            continue

        mean_val = float(np.mean(non_nan))

        # Fast Mann-Kendall on valid points
        try:
            mk = pmk.original_test(non_nan, alpha=0.05)
            mk_p = float(mk.p)
            sens_dec = float(mk.slope) * 10.0
            mk_trend = str(mk.trend)
        except Exception:
            mk_p = 1.0
            sens_dec = 0.0
            mk_trend = "no trend"

        # OLS
        x = np.arange(len(non_nan))
        ols_slope_dec = float(np.polyfit(x, non_nan, 1)[0]) * 10.0

        p_values.append(mk_p)
        slopes.append(sens_dec)

        grid_points.append(RegionalGridPoint(
            latitude=round(lat, 4),
            longitude=round(lon, 4),
            elevation_m=round(elevation, 1) if elevation is not None else None,
            mean_value=round(mean_val, 3),
            sens_slope_per_decade=round(sens_dec, 3),
            ols_slope_per_decade=round(ols_slope_dec, 3),
            mk_p_value=round(mk_p, 5),
            is_significant=bool(mk_p < 0.05),
            trend_direction=mk_trend,
            total_change=round((sens_dec / 10.0) * span_years, 3)
        ))

    if not grid_points:
        raise HTTPException(
            status_code=404,
            detail="Insufficient valid observational data across the regional domain."
        )

    # Benjamini-Hochberg FDR correction
    fdr_significant = trend_engine.apply_benjamini_hochberg(p_values, q=0.05)
    fdr_count = sum(fdr_significant)

    sig_count = sum(1 for p in grid_points if p.is_significant)
    sig_pct = round((sig_count / len(grid_points)) * 100.0, 1)
    mean_slope = round(float(np.mean(slopes)), 3)
    min_slope = round(float(np.min(slopes)), 3)
    max_slope = round(float(np.max(slopes)), 3)

    summary = RegionalSummaryStatistics(
        total_grid_cells=len(grid_points),
        significant_cells_count=sig_count,
        significant_cells_percentage=sig_pct,
        regional_mean_slope_per_decade=mean_slope,
        min_slope_per_decade=min_slope,
        max_slope_per_decade=max_slope,
        fdr_significant_count=fdr_count
    )

    bbox_dict = {
        "lat_min": req.lat_min,
        "lat_max": req.lat_max,
        "lon_min": req.lon_min,
        "lon_max": req.lon_max
    }

    explanation = insight_engine.generate_regional_explanation(
        var_meta=var_meta,
        bounding_box=bbox_dict,
        start_year=req.start_year,
        end_year=req.end_year,
        summary=summary
    )

    return RegionalTrendResponse(
        status="success",
        variable_metadata=var_meta,
        bounding_box=bbox_dict,
        period={"start_year": req.start_year, "end_year": req.end_year},
        grid_points=grid_points,
        summary_statistics=summary,
        scientific_explanation=explanation,
        retrieval_timestamp=datetime.now(timezone.utc).isoformat(),
        cache_hit=is_cache_hit
    )
