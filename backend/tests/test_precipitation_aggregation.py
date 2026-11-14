"""Synthetic tests for calendar-aware precipitation accumulation."""
import sys
from pathlib import Path
import pytest
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from analyze_cached_precipitation import annual_precipitation

@pytest.mark.unit
@pytest.mark.parametrize('year,expected', [(2019, 365), (2020, 366)])
def test_synthetic_calendar_year(year, expected):
    values = {f'{year}{month:02d}': 1.0 for month in range(1, 13)}
    assert annual_precipitation(values, year) == expected

@pytest.mark.unit
@pytest.mark.parametrize('invalid', [None, -999, float('nan'), -0.1, '1.0'])
def test_synthetic_invalid_month_rejects_year(invalid):
    values = {f'2020{month:02d}': 1.0 for month in range(1, 13)}
    values['202002'] = invalid
    assert annual_precipitation(values, 2020) is None

@pytest.mark.unit
def test_synthetic_missing_month_rejects_year():
    values = {f'2020{month:02d}': 1.0 for month in range(1, 12)}
    assert annual_precipitation(values, 2020) is None
