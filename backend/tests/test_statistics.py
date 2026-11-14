"""
Unit and Validation Tests for TerraTrend Statistical Analysis Engine.
Tests Mann-Kendall, Sen's slope, OLS, autocorrelation, and FDR against known benchmarks.
"""
import pytest
import numpy as np
from app.services.statistics import TrendAnalysisEngine
from app.services.nasa_power import NasaPowerService

def test_ols_and_mann_kendall_positive_trend():
    """
    Test a known strictly increasing sequence with noise.
    Expected: mk_trend == 'increasing', is_statistically_significant == True, p < 0.01.
    """
    engine = TrendAnalysisEngine()
    years = list(range(1990, 2020))  # 30 years
    # Ground truth: y = 20.0 + 0.1 * (t - 1990) + small alternating noise
    values = [20.0 + 0.1 * i + (0.05 if i % 2 == 0 else -0.05) for i in range(len(years))]
    
    records = [{"date": str(y), "year": y, "month": None, "value": v} for y, v in zip(years, values)]
    
    points, stats = engine.analyze_timeseries(records, alpha=0.05)
    
    assert len(points) == 30
    assert stats.mk_trend == "increasing"
    assert stats.is_statistically_significant is True
    assert stats.mk_p_value < 0.001
    assert stats.sens_slope_per_decade > 0.8  # ~1.0 °C/decade
    assert stats.ols_slope_per_decade > 0.8
    assert stats.total_change_over_period > 2.5

def test_mann_kendall_no_trend():
    """
    Test a flat series without trend.
    Expected: mk_trend == 'no trend', is_statistically_significant == False, p > 0.05.
    """
    engine = TrendAnalysisEngine()
    years = list(range(2000, 2025))  # 25 years
    # Periodic oscillating series with zero net slope
    values = [25.0 + (1.0 if i % 2 == 0 else -1.0) for i in range(len(years))]
    
    records = [{"date": str(y), "year": y, "month": None, "value": v} for y, v in zip(years, values)]
    
    points, stats = engine.analyze_timeseries(records, alpha=0.05)
    
    assert stats.mk_trend == "no trend"
    assert stats.is_statistically_significant is False
    assert stats.mk_p_value > 0.05
    assert abs(stats.sens_slope_per_decade) < 0.2

def test_missing_data_diagnostics_and_fill_value():
    """
    Test parsing with NASA POWER -999.0 fill values and missing data calculation.
    """
    mock_payload = {
        "header": {"fill_value": -999.0},
        "properties": {
            "parameter": {
                "T2M": {
                    "200013": 28.5,
                    "200113": -999.0,  # Missing
                    "200213": 28.9,
                    "200313": 29.1,
                    "200413": 29.3,
                    "200513": 29.4
                }
            }
        }
    }
    records = NasaPowerService.parse_point_series(mock_payload, "T2M", aggregation="annual")
    assert len(records) == 6
    assert records[1]["value"] is None
    assert records[0]["value"] == 28.5

    engine = TrendAnalysisEngine()
    points, stats = engine.analyze_timeseries(records, alpha=0.05)
    
    assert stats.diagnostics.n_observations == 6
    assert stats.diagnostics.missing_count == 1
    assert stats.diagnostics.missing_percentage == pytest.approx(16.67, 0.01)

def test_benjamini_hochberg_fdr():
    """
    Test Benjamini-Hochberg False Discovery Rate procedure.
    Known test vector: small p-values should be accepted, large p-values rejected.
    """
    engine = TrendAnalysisEngine()
    # 5 tests with sorted p-values: [0.001, 0.008, 0.030, 0.200, 0.850]
    p_values = [0.008, 0.200, 0.001, 0.850, 0.030]
    
    # Ranks k=1..5 with alpha=0.05:
    # k=1: 0.001 <= 1/5 * 0.05 = 0.010 -> True
    # k=2: 0.008 <= 2/5 * 0.05 = 0.020 -> True
    # k=3: 0.030 <= 3/5 * 0.05 = 0.030 -> True
    # k=4: 0.200 <= 4/5 * 0.05 = 0.040 -> False
    # k=5: 0.850 <= 5/5 * 0.05 = 0.050 -> False
    # Max k is 3. So tests with p <= 0.030 are significant.
    sig = engine.apply_benjamini_hochberg(p_values, q=0.05)
    
    # Corresponding indices:
    # p=0.008 (idx 0) -> True
    # p=0.200 (idx 1) -> False
    # p=0.001 (idx 2) -> True
    # p=0.850 (idx 3) -> False
    # p=0.030 (idx 4) -> True
    assert sig == [True, False, True, False, True]

def test_lag1_autocorrelation():
    """
    Test lag-1 autocorrelation computation.
    """
    engine = TrendAnalysisEngine()
    # Strongly autocorrelated smooth series
    smooth_series = np.array([1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0])
    r1, is_sig = engine.calculate_lag1_autocorrelation(smooth_series)
    assert r1 > 0.8
    assert is_sig is True

    # Oscillating series with negative autocorrelation
    oscillating = np.array([1.0, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0, -1.0])
    r1_neg, is_sig_neg = engine.calculate_lag1_autocorrelation(oscillating)
    assert r1_neg < -0.8
