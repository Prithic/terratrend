"""
Tests for TerraTrend Variable and Location Catalog Integrity.
Verifies units, data lineages, resolutions, and geographic presets.
"""
from app.models.catalog import VARIABLES_CATALOG, PRESET_LOCATIONS, REGIONAL_PRESETS

def test_all_seven_variables_exist():
    expected_vars = [
        "T2M",
        "T2M_MAX",
        "T2M_MIN",
        "PRECTOTCORR",
        "WS10M",
        "ALLSKY_SFC_SW_DWN",
        "RH2M"
    ]
    for var in expected_vars:
        assert var in VARIABLES_CATALOG, f"Missing expected variable: {var}"
        meta = VARIABLES_CATALOG[var]
        assert meta.identifier == var
        assert len(meta.name) > 3
        assert len(meta.units) > 0
        assert "NASA" in meta.original_source or "CERES" in meta.original_source or "MERRA-2" in meta.original_source
        assert "http" in meta.documentation_url

def test_preset_locations_integrity():
    assert len(PRESET_LOCATIONS) >= 7
    ids = [p.id for p in PRESET_LOCATIONS]
    assert "madurai" in ids
    assert "coimbatore" in ids
    assert "chennai" in ids
    
    for preset in PRESET_LOCATIONS:
        assert -90.0 <= preset.latitude <= 90.0
        assert -180.0 <= preset.longitude <= 180.0
        assert len(preset.name) > 0
        assert "Tamil Nadu" in preset.state_or_country

def test_regional_presets_span():
    for region in REGIONAL_PRESETS:
        lat_span = region["lat_max"] - region["lat_min"]
        lon_span = region["lon_max"] - region["lon_min"]
        assert lat_span >= 2.0, f"Region {region['id']} latitude span < 2.0 degrees"
        assert lon_span >= 2.0, f"Region {region['id']} longitude span < 2.0 degrees"
