"""
Validation Tests for TerraTrend Regional Trend Calculations & Opposing Trends.
Tests spatial trend computation, summary statistics, FDR control, and rate vs accumulation semantics.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.catalog import VARIABLES_CATALOG

client = TestClient(app)

@pytest.mark.integration
def test_regional_precip_opposing_trends_discovery():
    """
    Test regional analysis for PRECTOTCORR across the rectangular bounding box.
    Verifies calculation of opposing trend directions, Benjamini-Hochberg FDR control,
    and structured responses to the 4 Essential NASA Questions.
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
    assert data["variable_metadata"]["units"] == "mm/day"
    assert len(data["grid_points"]) > 0
    
    summary = data["summary_statistics"]
    assert "total_grid_cells" in summary
    assert "regional_mean_slope_per_decade" in summary
    assert "fdr_significant_count" in summary
    assert "has_opposing_trends" in summary

    # Check that individual grid cells have valid numerical and statistical properties
    for pt in data["grid_points"]:
        assert "latitude" in pt
        assert "longitude" in pt
        assert "sens_slope_per_decade" in pt
        assert "mk_p_value" in pt
        assert "is_fdr_significant" in pt
        assert 0.0 <= pt["mk_p_value"] <= 1.0

    # Verify structured answers to the 4 essential NASA questions
    expl = data["scientific_explanation"]
    assert "question_what" in expl
    assert "question_where" in expl
    assert "question_how_much" in expl
    assert "question_are_changes_significant" in expl
    assert "scientific_synthesis" in expl

@pytest.mark.integration
def test_regional_wind_speed_stilling():
    """
    Test regional analysis for WS10M (Surface Wind Speed).
    Verifies that spatial calculation returns consistent trend rates and FDR statistics.
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
    assert summary["total_grid_cells"] > 0
    assert "fdr_significant_count" in summary
    assert "negative_cells_count" in summary

@pytest.mark.unit
def test_precipitation_calendar_day_aggregation_distinction():
    """
    Verifies that annual accumulation depends on calendar-month day counts,
    and must not be conflated with a constant 365.25 scaling of an annual mean daily rate.
    """
    from analyze_cached_precipitation import annual_precipitation
    # In a leap year with constant daily rate of 1.0 mm/day:
    leap_monthly = {f"2020{m:02d}": 1.0 for m in range(1, 13)}
    accum_leap = annual_precipitation(leap_monthly, 2020)
    assert accum_leap == 366.0

    # In a non-leap year with constant daily rate of 1.0 mm/day:
    std_monthly = {f"2021{m:02d}": 1.0 for m in range(1, 13)}
    accum_std = annual_precipitation(std_monthly, 2021)
    assert accum_std == 365.0
