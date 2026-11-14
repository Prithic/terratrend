"""
Integration tests for TerraTrend API endpoints with NASA data retrieval and caching.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.mark.unit
def test_get_variables():
    response = client.get("/api/variables")
    assert response.status_code == 200
    data = response.json()
    assert "T2M" in data
    assert "PRECTOTCORR" in data
    assert "MERRA-2" in data["T2M"]["original_source"]

@pytest.mark.unit
def test_get_locations():
    response = client.get("/api/locations")
    assert response.status_code == 200
    data = response.json()
    presets = data["presets"]
    names = [p["name"] for p in presets]
    assert "Coimbatore" in names
    assert "Chennai" in names
    assert "Madurai" in names

@pytest.mark.integration
def test_point_trend_real_nasa_query_madurai_significant():
    """
    Test end-to-end point trend calculation for Madurai (1981-2023).
    Verifies calculation of Sen's slope, Mann-Kendall p-value, and 4 questions insight engine.
    """
    req_body = {
        "variable": "T2M",
        "latitude": 9.9252,
        "longitude": 78.1198,
        "start_year": 1981,
        "end_year": 2023,
        "temporal_aggregation": "annual"
    }
    response = client.post("/api/trend/point", json=req_body)
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "success"
    assert data["location"]["name"] == "Madurai"
    assert len(data["timeseries"]) == 43
    
    stats = data["statistics"]
    assert stats["is_statistically_significant"] is True
    assert stats["mk_p_value"] < 0.05
    assert stats["sens_slope_per_decade"] > 0.10
    
    expl = data["scientific_explanation"]
    assert "Temperature at 2 Meters" in expl["question_what"]
    assert "Madurai" in expl["question_where"]
    assert "decade" in expl["question_how_much"]
    assert "YES, the observed trend is statistically significant" in expl["question_are_changes_significant"]

@pytest.mark.integration
def test_point_trend_real_nasa_query_coimbatore():
    """
    Test Coimbatore (1981-2023) where trend is positive but does not reach 95% significance (p > 0.05).
    Verifies that the scientific explanation correctly reports non-significance without false positives.
    """
    req_body = {
        "variable": "T2M",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "start_year": 1981,
        "end_year": 2023,
        "temporal_aggregation": "annual"
    }
    response = client.post("/api/trend/point", json=req_body)
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "success"
    assert data["location"]["name"] == "Coimbatore"
    
    stats = data["statistics"]
    assert stats["is_statistically_significant"] is False
    assert stats["mk_p_value"] > 0.05
    
    expl = data["scientific_explanation"]
    assert "does NOT reach statistical significance" in expl["question_are_changes_significant"]
