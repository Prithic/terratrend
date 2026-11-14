# TerraTrend Scientific Discoveries & Earth System Spatial Heterogeneity

**Challenge:** 2026 NASA Space Apps Challenge — *Be an Earth System Trend Detective*  
**Team:** CODEVERSE  
**Data Sources:** NASA GMAO MERRA-2 Reanalysis (`tavgM_2d_slv_Nx`, `statM_2d_slv_Nx`) & NASA CERES SYN1deg  
**Observational Baseline:** 1981–2023 (43 Annual Climatological Cycles)  
**Study Domain:** South Peninsular India / Tamil Nadu Regional Bounding Domain ($8.5^\circ\text{N} - 13.5^\circ\text{N}$, $76.5^\circ\text{E} - 80.5^\circ\text{E}$, 66 Native MERRA-2 Grid Cells)

---

## Executive Overview: The Essential NASA Question

The core prompt of the NASA Space Apps Challenge emphasizes that:
> *"The same environmental process may produce a rising trend in one geographical region and a falling trend in another. The project must help users discover these spatial differences rather than simply display historical charts."*

Using verified, unmanipulated assimilation data from the **NASA POWER Monthly API**, TerraTrend conducted a multi-parameter spatial trend audit across 66 native assimilation cells ($0.5^\circ \times 0.625^\circ$) in Southern India. 

Rather than presenting isolated time series, this investigation uncovered **three distinct spatial archetypes**:
1. **The Precipitation Dipole (Opposing Trends):** Co-occurring statistically significant drying and wetting trends across topographically divided sub-regions.
2. **Regional Atmospheric Stilling:** Widespread, FDR-significant decadal deceleration of surface wind speeds.
3. **Orographic Elevation Thermal Buffering:** Uniform regional warming modulated by topography, ranging from $+0.014^\circ\text{C/decade}$ in the Western Ghats to $+0.344^\circ\text{C/decade}$ along the coastal and interior plains.

---

## 1. Discovery A — The South Indian Precipitation Dipole (Opposing Regional Trends)

### Empirical Evidence
When evaluating **Corrected Total Precipitation (`PRECTOTCORR`)** over 1981–2023 across the 66-cell domain, the empirical data reveals a striking spatial bifurcation:
- **Positive Trend Cells (Wetting):** 55 cells (27 reach local $p < 0.05$; **14 cells remain significant under Benjamini–Hochberg False Discovery Rate control at $q = 0.05$**).
- **Negative Trend Cells (Drying):** 11 cells (7 reach local $p < 0.05$; **4 cells remain significant under Benjamini–Hochberg False Discovery Rate control at $q = 0.05$**).

```
                      PRECIPITATION TREND SPATIAL DISTRIBUTION (1981–2023)
+---------------------------------------------------------------------------------------+
| Sub-Region                | Typical Coordinates | Sen's Slope Rate     | Annual Delta | MK p-value | FDR Sig? |
|---------------------------|---------------------|----------------------|--------------|------------|----------|
| Significant Drying Zone   | 8.5°N, 77.5°E       | -0.438 mm/day/decade | -159.8 mm/yr | p = 0.0059 | TRUE     |
| (Southern Rain Shadow)    | 9.0°N, 77.5°E       | -0.425 mm/day/decade | -155.2 mm/yr | p = 0.0061 | TRUE     |
|                           | 8.5°N, 78.125°E     | -0.411 mm/day/decade | -149.9 mm/yr | p = 0.0043 | TRUE     |
|                           | 9.0°N, 78.125°E     | -0.400 mm/day/decade | -146.1 mm/yr | p = 0.0063 | TRUE     |
|---------------------------|---------------------|----------------------|--------------|------------|----------|
| Significant Wetting Zone  | 10.0°N, 80.0°E      | +0.329 mm/day/decade | +120.3 mm/yr | p = 0.0001 | TRUE     |
| (Coromandel Coast &       | 9.5°N, 80.0°E       | +0.300 mm/day/decade | +109.6 mm/yr | p = 0.0015 | TRUE     |
| Kaveri Marine Littoral)   | 10.5°N, 80.0°E      | +0.300 mm/day/decade | +109.6 mm/yr | p = 0.0001 | TRUE     |
|                           | 11.0°N, 80.0°E      | +0.252 mm/day/decade | +92.2 mm/yr  | p = 0.0006 | TRUE     |
+---------------------------------------------------------------------------------------+
```

### Physical & Meteorological Mechanism
1. **The Drying Sector (Tirunelveli, Thoothukudi, Southern Foothills):**  
   These grid cells lie in the deep leeward rain-shadow of the southern Agasthyamalai and Cardamom Hills. During the Southwest Monsoon (June–September), orographic moisture is stripped on the windward Kerala coast. In recent decades, weakening cross-equatorial monsoon low-level jet moisture flux across the Palghat gap has exacerbated drought stress in this leeward rain-shadow basin, resulting in an accumulated drop of over $600\text{ mm}$ over the 43-year observational window.
2. **The Wetting Sector (Coromandel Marine Corridor, Nagapattinam, Kaveri Delta):**  
   Tamil Nadu receives the majority of its annual precipitation during the **Northeast Monsoon (October–December)**. Warmer sea surface temperatures (SST) in the Bay of Bengal have intensified marine convection and increased the frequency of deep depressions and coastal rainbands, causing annual rainfall to surge by $>+400\text{ mm}$ over the study period.

> **Key Finding:** Precipitation does not follow a single regional narrative. The exact same macro-scale climate system drives statistically significant **desiccation in the southwest** and **humidification in the east**.

---

## 2. Discovery B — Widespread Regional Atmospheric Stilling (10m Wind Speed)

### Empirical Evidence
Analysis of **Surface Wind Speed at 10 Meters (`WS10M`)** reveals widespread deceleration of near-surface airflow across South India:
- **Total Valid Cells:** 66
- **Mean Sen's Slope:** $-0.0472\text{ m/s per decade}$
- **Negative Trend Cells:** 57 out of 66 ($86.4\%$)
- **Local Significance ($p < 0.05$):** 46 cells ($69.7\%$)
- **Benjamini–Hochberg FDR Control ($q = 0.05$):** **44 cells ($66.7\%$) remain significant**
- **Positive Trend Cells:** 8 cells (0 reach statistical significance)

### Physical Significance
This finding provides regional empirical confirmation of the global "atmospheric stilling" phenomenon documented in climate literature (Vautard et al., 2010). Potential drivers in the South Asian context include increased surface aerodynamic roughness from regional urbanization/afforestation, coupled with a weakening horizontal tropospheric thermal gradient between the Indian landmass and the northern Indian Ocean.

---

## 3. Discovery C — Orographic Elevation Thermal Buffering (2m Air Temperature)

### Empirical Evidence
Analysis of **Near-Surface Air Temperature (`T2M`)** shows positive trends across all 66 grid cells:
- **Mean Regional Warming Rate:** $+0.1099^\circ\text{C per decade}$ (ranging from $+0.014^\circ\text{C}$ to $+0.344^\circ\text{C/decade}$)
- **Local Significance ($p < 0.05$):** 29 cells ($43.9\%$)
- **FDR Significance ($q = 0.05$):** 24 cells ($36.4\%$)
- **Negative Trend Cells:** 0 cells

### Station Case Studies: Madurai vs. Coimbatore
- **Madurai ($9.93^\circ\text{N}, 78.12^\circ\text{E}$ — Semi-Arid Plains):**  
  Sen's Slope: $+0.170^\circ\text{C/decade}$, Mann-Kendall $Z = +2.20$, $p = 0.0279$ (**Statistically Significant Warming**). Over 43 years, Madurai has experienced a $+0.73^\circ\text{C}$ net temperature rise.
- **Coimbatore ($11.02^\circ\text{N}, 76.96^\circ\text{E}$ — Western Ghats Foothills):**  
  Sen's Slope: $+0.080^\circ\text{C/decade}$, Mann-Kendall $Z = +1.34$, $p = 0.1802$ (**Statistically Inconclusive / Non-Significant**).  
  *Scientific Caveat:* TerraTrend does not assert that Western Ghats buffering is an established certainty; rather, it highlights Coimbatore's attenuated rate as an empirical observation warranting continued sensor monitoring.

---

## 4. Regional Domain Geography & Delimitation (Investigation E)

A critical scientific distinction required by the NASA challenge is clarifying the boundary between a **rectangular bounding box** and an **administrative land boundary**:

- The queried regional box ($8.5^\circ\text{N} - 13.5^\circ\text{N}, 76.5^\circ\text{E} - 80.5^\circ\text{E}$) yields 66 native MERRA-2 grid cells ($0.5^\circ \text{ lat} \times 0.625^\circ \text{ lon}$, $\sim 55\text{ km} \times 68\text{ km}$).
- **Geographic Composition:**
  - **Inland Core (Tamil Nadu Landmass):** 32 cells in the central Kaveri River Basin, plains, and urban corridors.
  - **Western Orographic Boundary:** 11 cells along the Western Ghats ridge crest (elevations up to $900\text{ m}+$, straddling Tamil Nadu, Kerala, and southern Karnataka).
  - **Northern Border Zone:** 8 cells covering Chennai and the southern Andhra Pradesh border.
  - **Southern Tip & Gulf of Mannar:** 4 cells covering Kanyakumari, Tirunelveli, and Thoothukudi littoral.
  - **Maritime Littoral & Coastal Boundary Waters:** 11 cells over the Bay of Bengal, Palk Strait, and Gulf of Mannar (elevations $\le 1.0\text{ m}$).

By explicitly categorizing these zones in map tooltips and documentation, TerraTrend avoids misrepresenting marine or inter-state border assimilation cells as purely terrestrial Tamil Nadu data.

---

## 5. Summary Matrix of Tested NASA Variables

| NASA Variable Identifier | Physical Parameter | Long-Term Trend Direction | Local Sig ($p < 0.05$) | FDR Sig ($q < 0.05$) | Opposing Spatial Trends? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`T2M`** | Temperature at 2m | Uniform Positive (Warming) | 29 / 66 cells | 24 / 66 cells | No (All cells warming) |
| **`PRECTOTCORR`** | Corrected Precipitation | **Bifurcated Dipole** | 34 / 66 cells | **18 / 66 cells** | **YES (55 wetting, 11 drying)** |
| **`WS10M`** | Wind Speed at 10m | Dominant Negative (Stilling) | 46 / 66 cells | 44 / 66 cells | No (57 decreasing, 0 sig increasing) |
| **`RH2M`** | Relative Humidity at 2m | Dominant Positive (Humidifying) | 45 / 66 cells | 29 / 66 cells | Yes (57 humidifying, 9 drying) |
| **`ALLSKY_SFC_SW_DWN`** | Surface Solar Irradiance | Bifurcated (Coastal Brightening) | 14 / 30 cells | 9 / 30 cells | Yes (18 brightening, 12 dimming) |
