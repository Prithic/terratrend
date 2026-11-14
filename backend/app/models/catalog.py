"""
Official scientific metadata catalog for variables and locations in TerraTrend.
Lineage from NASA MERRA-2, CERES, and GEOS assimilation systems.
"""
from typing import Dict, List
from app.models.schemas import VariableMetadata, LocationPreset

VARIABLES_CATALOG: Dict[str, VariableMetadata] = {
    "T2M": VariableMetadata(
        identifier="T2M",
        name="Temperature at 2 Meters",
        description="Monthly average dry-bulb temperature at 2 meters above surface ground level.",
        units="°C",
        original_source="NASA Global Modeling and Assimilation Office (GMAO) MERRA-2",
        dataset_lineage="MERRA-2 2D atmospheric single-level meteorological assimilation (tavgM_2d_slv_Nx)",
        spatial_resolution="0.5° latitude x 0.625° longitude (~50 km)",
        temporal_resolution="Monthly & Annual (1981 - 2024)",
        available_range="1981-01 to 2024-12",
        geographic_coverage="Global (-90° to +90° Lat, -180° to +180° Lon)",
        documentation_url="https://power.larc.nasa.gov/docs/methodology/meteorology/merra2/"
    ),
    "T2M_MAX": VariableMetadata(
        identifier="T2M_MAX",
        name="Maximum Temperature at 2 Meters",
        description="Monthly average maximum daily dry-bulb temperature at 2 meters above ground level.",
        units="°C",
        original_source="NASA GMAO MERRA-2",
        dataset_lineage="MERRA-2 daily maximum temperature aggregation (statM_2d_slv_Nx)",
        spatial_resolution="0.5° latitude x 0.625° longitude (~50 km)",
        temporal_resolution="Monthly & Annual (1981 - 2024)",
        available_range="1981-01 to 2024-12",
        geographic_coverage="Global",
        documentation_url="https://power.larc.nasa.gov/docs/methodology/meteorology/merra2/"
    ),
    "T2M_MIN": VariableMetadata(
        identifier="T2M_MIN",
        name="Minimum Temperature at 2 Meters",
        description="Monthly average minimum daily dry-bulb temperature at 2 meters above ground level.",
        units="°C",
        original_source="NASA GMAO MERRA-2",
        dataset_lineage="MERRA-2 daily minimum temperature aggregation (statM_2d_slv_Nx)",
        spatial_resolution="0.5° latitude x 0.625° longitude (~50 km)",
        temporal_resolution="Monthly & Annual (1981 - 2024)",
        available_range="1981-01 to 2024-12",
        geographic_coverage="Global",
        documentation_url="https://power.larc.nasa.gov/docs/methodology/meteorology/merra2/"
    ),
    "PRECTOTCORR": VariableMetadata(
        identifier="PRECTOTCORR",
        name="Precipitation Corrected",
        description="Monthly average daily bias-corrected precipitation rate (rain and snow water equivalent).",
        units="mm/day",
        original_source="NASA GMAO MERRA-2 (Precipitation gauge-calibrated)",
        dataset_lineage="MERRA-2 surface flux diagnostics corrected with CPC global precipitation observations",
        spatial_resolution="0.5° latitude x 0.625° longitude (~50 km)",
        temporal_resolution="Monthly & Annual (1981 - 2024)",
        available_range="1981-01 to 2024-12",
        geographic_coverage="Global",
        documentation_url="https://power.larc.nasa.gov/docs/methodology/meteorology/merra2/"
    ),
    "WS10M": VariableMetadata(
        identifier="WS10M",
        name="Wind Speed at 10 Meters",
        description="Monthly average wind speed calculated at 10 meters above the neutral surface layer.",
        units="m/s",
        original_source="NASA GMAO MERRA-2",
        dataset_lineage="MERRA-2 horizontal wind vector magnitude sqrt(u10m^2 + v10m^2)",
        spatial_resolution="0.5° latitude x 0.625° longitude (~50 km)",
        temporal_resolution="Monthly & Annual (1981 - 2024)",
        available_range="1981-01 to 2024-12",
        geographic_coverage="Global",
        documentation_url="https://power.larc.nasa.gov/docs/methodology/meteorology/merra2/"
    ),
    "ALLSKY_SFC_SW_DWN": VariableMetadata(
        identifier="ALLSKY_SFC_SW_DWN",
        name="All Sky Surface Solar Downward Irradiance",
        description="Total solar irradiance incident on a horizontal surface at Earth ground under all sky conditions.",
        units="kW-hr/m²/day",
        original_source="NASA CERES / FLASHFlux & MERRA-2",
        dataset_lineage="NASA Clouds and the Earth's Radiant Energy System (CERES) SYN1deg assimilation",
        spatial_resolution="1.0° x 1.0° (CERES) / 0.5° x 0.625° interpolated",
        temporal_resolution="Monthly & Annual (1984 - 2024)",
        available_range="1984-01 to 2024-12",
        geographic_coverage="Global",
        documentation_url="https://power.larc.nasa.gov/docs/methodology/solar/"
    ),
    "RH2M": VariableMetadata(
        identifier="RH2M",
        name="Relative Humidity at 2 Meters",
        description="Monthly average relative humidity at 2 meters above ground level, expressed as a percentage.",
        units="%",
        original_source="NASA GMAO MERRA-2",
        dataset_lineage="MERRA-2 computed from 2m specific humidity, dry bulb temperature, and surface pressure",
        spatial_resolution="0.5° latitude x 0.625° longitude (~50 km)",
        temporal_resolution="Monthly & Annual (1981 - 2024)",
        available_range="1981-01 to 2024-12",
        geographic_coverage="Global",
        documentation_url="https://power.larc.nasa.gov/docs/methodology/meteorology/merra2/"
    )
}

PRESET_LOCATIONS: List[LocationPreset] = [
    LocationPreset(
        id="coimbatore",
        name="Coimbatore",
        state_or_country="Tamil Nadu, India",
        latitude=11.0168,
        longitude=76.9558,
        description="Major industrial and textile hub situated near the Western Ghats (Palghat Gap)."
    ),
    LocationPreset(
        id="chennai",
        name="Chennai",
        state_or_country="Tamil Nadu, India",
        latitude=13.0827,
        longitude=80.2707,
        description="Coastal metropolis on the Coromandel Coast of the Bay of Bengal."
    ),
    LocationPreset(
        id="madurai",
        name="Madurai",
        state_or_country="Tamil Nadu, India",
        latitude=9.9252,
        longitude=78.1198,
        description="Historic cultural center located in the semi-arid southern plain along the Vaigai River."
    ),
    LocationPreset(
        id="tiruchirappalli",
        name="Tiruchirappalli (Trichy)",
        state_or_country="Tamil Nadu, India",
        latitude=10.7905,
        longitude=78.7047,
        description="Central inland agricultural and industrial nexus along the Kaveri River delta."
    ),
    LocationPreset(
        id="salem",
        name="Salem",
        state_or_country="Tamil Nadu, India",
        latitude=11.6643,
        longitude=78.1460,
        description="North-central region surrounded by the Shevaroy and Nagaramalai hills."
    ),
    LocationPreset(
        id="kanyakumari",
        name="Kanyakumari",
        state_or_country="Tamil Nadu, India",
        latitude=8.0883,
        longitude=77.5385,
        description="Southernmost tip of mainland India, convergence of Arabian Sea, Indian Ocean, and Bay of Bengal."
    ),
    LocationPreset(
        id="ooty_nilgiris",
        name="Udhagamandalam (Ooty)",
        state_or_country="Tamil Nadu, India",
        latitude=11.4102,
        longitude=76.6950,
        description="High-altitude Western Ghats montane ecosystem (2,240 m elevation)."
    )
]

REGIONAL_PRESETS = [
    {
        "id": "tamil_nadu",
        "name": "Tamil Nadu State",
        "lat_min": 8.2,
        "lat_max": 13.5,
        "lon_min": 76.5,
        "lon_max": 80.5,
        "description": "Comprehensive regional coverage spanning the Coromandel Coast to Western Ghats."
    },
    {
        "id": "southern_peninsula",
        "name": "South Peninsular India",
        "lat_min": 8.0,
        "lat_max": 15.0,
        "lon_min": 75.0,
        "lon_max": 81.0,
        "description": "Broader South Indian climate zone (Tamil Nadu, Kerala, Karnataka, Andhra Pradesh)."
    }
]
