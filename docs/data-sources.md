> **Independent audit warning:** This document contains historical, unverified claims and may describe superseded calculations. Do not cite its numerical findings or provenance assertions until revalidated. See [independent review](codex-independent-review.md).

# TerraTrend — NASA Data Lineage & Environmental Variables

**Challenge:** 2026 NASA Space Apps Challenge — *Be an Earth System Trend Detective*  
**Primary Gateway:** NASA Prediction of Worldwide Energy Resources (POWER) Project  
**Operating Facility:** NASA Langley Research Center (LaRC), Hampton, Virginia  

---

## 1. Overview of NASA POWER Integration

The **NASA POWER Project** synthesizes NASA satellite observation systems and global data assimilation models to provide continuous solar and meteorological data tailored for renewable energy, agricultural modeling, and climate resilience.

- **API Base URL:** `https://power.larc.nasa.gov/api/temporal/monthly`
- **NASA Communities:** Renewable Energy (`RE`), Sustainable Buildings (`SB`), Agroclimatology (`AG`)
- **Temporal Resolution:** Monthly averages and native annual aggregations (index `YYYY13`)
- **Temporal Span:** 1981-01 to 2024-12 (44 continuous years)
- **Global Coverage:** $-90^\circ\text{S}$ to $+90^\circ\text{N}$, $-180^\circ\text{W}$ to $+180^\circ\text{E}$

---

## 2. Supported Environmental Variables & Dataset Lineage

### 1. `T2M` — Temperature at 2 Meters
- **Physical Meaning:** Dry-bulb air temperature at 2 meters above ground level.
- **Units:** Degrees Celsius ($^\circ\text{C}$).
- **Original Source:** NASA GMAO MERRA-2.
- **Model Lineage:** `tavgM_2d_slv_Nx` 2D atmospheric single-level meteorological assimilation.
- **Spatial Resolution:** $0.5^\circ \text{ latitude} \times 0.625^\circ \text{ longitude}$ ($\approx 50\text{ km}$).
- **Documentation:** [NASA MERRA-2 Meteorology](https://power.larc.nasa.gov/docs/methodology/meteorology/merra2/)

### 2. `T2M_MAX` — Maximum Daily Temperature at 2 Meters
- **Physical Meaning:** Monthly mean of the maximum daily dry-bulb temperature at 2 meters.
- **Units:** Degrees Celsius ($^\circ\text{C}$).
- **Original Source:** NASA GMAO MERRA-2.
- **Model Lineage:** `statM_2d_slv_Nx` daily maximum aggregation.
- **Spatial Resolution:** $0.5^\circ \times 0.625^\circ$.

### 3. `T2M_MIN` — Minimum Daily Temperature at 2 Meters
- **Physical Meaning:** Monthly mean of the minimum daily dry-bulb temperature at 2 meters.
- **Units:** Degrees Celsius ($^\circ\text{C}$).
- **Original Source:** NASA GMAO MERRA-2.
- **Model Lineage:** `statM_2d_slv_Nx` daily minimum aggregation.
- **Spatial Resolution:** $0.5^\circ \times 0.625^\circ$.

### 4. `PRECTOTCORR` — Precipitation Rate Corrected
- **Physical Meaning:** Total bias-corrected precipitation rate (rain and liquid equivalent of snow).
- **Units:** Millimeters per day ($\text{mm/day}$).
- **Original Source:** NASA GMAO MERRA-2 + NOAA Climate Prediction Center (CPC).
- **Model Lineage:** MERRA-2 surface flux diagnostics corrected against CPC global gauge observations.
- **Spatial Resolution:** $0.5^\circ \times 0.625^\circ$.

### 5. `WS10M` — Wind Speed at 10 Meters
- **Physical Meaning:** Wind speed magnitude at 10 meters above the neutral boundary surface.
- **Units:** Meters per second ($\text{m/s}$).
- **Original Source:** NASA GMAO MERRA-2.
- **Model Lineage:** Horizontal wind vector magnitude: $\sqrt{u_{10m}^2 + v_{10m}^2}$.
- **Spatial Resolution:** $0.5^\circ \times 0.625^\circ$.

### 6. `ALLSKY_SFC_SW_DWN` — Surface Solar Downward Irradiance
- **Physical Meaning:** Total solar irradiance incident on a horizontal surface at the Earth's surface under all-sky conditions.
- **Units:** Kilowatt-hours per square meter per day ($\text{kW-hr/m}^2\text{/day}$).
- **Original Source:** NASA CERES / FLASHFlux.
- **Model Lineage:** NASA Clouds and the Earth's Radiant Energy System (CERES) SYN1deg assimilation product.
- **Spatial Resolution:** $1.0^\circ \times 1.0^\circ$ (CERES native, remapped to $0.5^\circ \times 0.625^\circ$).
- **Documentation:** [NASA POWER Solar Methodology](https://power.larc.nasa.gov/docs/methodology/solar/)

### 7. `RH2M` — Relative Humidity at 2 Meters
- **Physical Meaning:** Ratio of actual vapor pressure to saturation vapor pressure at 2 meters above ground level.
- **Units:** Percentage ($\%$).
- **Original Source:** NASA GMAO MERRA-2.
- **Model Lineage:** Computed from 2m specific humidity, dry-bulb temperature, and surface atmospheric pressure.
- **Spatial Resolution:** $0.5^\circ \times 0.625^\circ$.

---

## 3. Study Region: Tamil Nadu Domain Demonstration

The platform includes pre-configured coordinate stations across the diverse geographical zones of **Tamil Nadu, India**:
1. **Coimbatore** ($11.0168^\circ\text{N}, 76.9558^\circ\text{E}$): Western Ghats gap (Palghat corridor).
2. **Chennai** ($13.0827^\circ\text{N}, 80.2707^\circ\text{E}$): Coromandel maritime coastal plain.
3. **Madurai** ($9.9252^\circ\text{N}, 78.1198^\circ\text{E}$): Southern inland semi-arid plain (Vaigai river basin).
4. **Tiruchirappalli** ($10.7905^\circ\text{N}, 78.7047^\circ\text{E}$): Central Kaveri delta agricultural nexus.
5. **Salem** ($11.6643^\circ\text{N}, 78.1460^\circ\text{E}$): Shevaroy hill-ringed valley.
6. **Kanyakumari** ($8.0883^\circ\text{N}, 77.5385^\circ\text{E}$): Southern continental tri-sea convergence.
7. **Udhagamandalam (Ooty)** ($11.4102^\circ\text{N}, 76.6950^\circ\text{E}$): Montane Western Ghats high-altitude ecosystem ($2,240\text{ m}$).

### Regional Bounding Box
- **Latitude Extent:** $8.5^\circ\text{N}$ to $13.5^\circ\text{N}$ (11 latitude grid bands)
- **Longitude Extent:** $76.875^\circ\text{E}$ to $80.0^\circ\text{E}$ (6 longitude grid bands)
- **Total Continuous Cells:** 66 native MERRA-2 grid points
