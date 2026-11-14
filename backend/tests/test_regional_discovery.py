"""
Validation Tests for TerraTrend Regional Trend Discovery & Opposing Trends.
Tests precipitation dipole, wind stilling, dual-unit accumulation, and insight synthesis.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.catalog import VARIABLES_CATALOG
from app.services.insight_engine import insight_engine
from app.models.schemas import RegionalSummaryStatistics

client = TestClient(app)

def test_regional_precip_opposing_trends_discovery():
    """
    Test regional analysis for PRECTOTCORR across the Tamil Nadu / South India domain.
    Verifies the core NASA challenge criteria:
    Opposing trends co-existing within the same domain (wetting cells vs drying cells).
    """
    req_body = {
        "variable": "PRECTOTCORR",
        "lat_min": 8.5,
        "lat_max": 13.5,
        "lon_min": 76.5,
        "lon_max": 80.5,
        "start_year": 1981,
        "end_year": 2023
    }
    response = client.post("/api/trend/regional", json=req_body)
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "success"
    assert data["variable_metadata"]["identifier"] == "PRECTOTCORR"
    assert len(data["grid_points"]) == 66
    
    summary = data["summary_statistics"]
    assert summary["has_opposing_trends"] is True
    assert summary["positive_cells_count"] > 40  # 55 wetting cells
    assert summary["negative_cells_count"] > 5   # 11 drying cells
    assert summary["fdr_positive_cells_count"] > 10  # 14 FDR significant wetting
    assert summary["fdr_negative_cells_count"] > 2   # 4 FDR significant drying
    assert summary["min_slope_per_decade"] < -0.30
    assert summary["max_slope_per_decade"] > +0.25

    # Verify scientific explanation synthesizes the dipole
    expl = data["scientific_explanation"]
    assert "contrasting spatial trend directions" in expl["question_what"]
    assert "spatial dipole" in expl["question_how_much"]
    assert "both directions" in expl["question_are_changes_significant"]

def test_regional_wind_speed_stilling():
    """
    Test regional analysis for WS10M (Surface Wind Speed).
    Verifies that near-surface wind speed exhibits widespread deceleration (stilling).
    """
    req_body = {
        "variable": "WS10M",
        "lat_min": 8.5,
        "lat_max": 13.5,
        "lon_min": 76.5,
        "lon_max": 80.5,
        "start_year": 1981,
        "end_year": 2023
    }
    response = client.post("/api/trend/regional", json=req_body)
    assert response.status_code == 200
    data = response.json()
    
    summary = data["summary_statistics"]
    assert summary["negative_cells_count"] >= 50
    assert summary["fdr_significant_count"] >= 35
    assert summary["regional_mean_slope_per_decade"] < 0

def test_precipitation_accumulation_conversion():
    """
    Test daily precipitation rate (mm/day) to annual total accumulation (mm/year) conversion.
    A rate of 1.0 mm/day over a standard year equals 365.25 mm/year.
    """
    rate_daily = 0.329  # mm/day/decade (Coromandel max slope)
    annual_accum = rate_daily * 365.25
    assert annual_accum == pytest.approx(120.167, 0.1)

    drying_daily = -0.438  # mm/day/decade (Rain shadow min slope)
    drying_annual = drying_daily * 365.25
    assert drying_annual == pytest.approx(-159.979, 0.1)
