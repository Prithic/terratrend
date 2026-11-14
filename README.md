# TERRATREND | NASA Earth System Trend Discovery & Intelligence Platform

[![NASA Space Apps 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-0B3D91.svg)](https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20SciPy%20%7C%20Pandas-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20TypeScript%20%7C%20Tailwind-black.svg)](https://nextjs.org)
[![Tests](https://img.shields.io/badge/Tests-Pytest%20Passing%20(15%2F15)-brightgreen.svg)]()
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA%20Compliant-blue.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Official Submission for the 2026 NASA Space Apps Challenge**  
> **Challenge:** [Be an Earth System Trend Detective](https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/)  
> **Team:** CODEVERSE  
> **Repository:** [https://github.com/codeverse/terratrend](https://github.com/codeverse/terratrend)

---

## Executive Summary

**TerraTrend** is an open-source, evidence-grounded Earth-system intelligence platform engineered for the 2026 NASA International Space Apps Challenge. 

TerraTrend translates 44 continuous years (1981–2024) of NASA Earth-observation satellite data and assimilation models into rigorous, intuitive, and statistically defensible climate trend insights. Operating with **zero synthetic data** and **zero hardcoded values**, every calculation is derived on-demand from official NASA APIs (MERRA-2 and CERES) using non-parametric statistical methods.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE 4 ESSENTIAL NASA TREND QUESTIONS                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. WHAT is changing?                                                       │
│     Identifies the physical variable, baseline climatological mean, and     │
│     direction of change.                                                    │
│                                                                             │
│  2. WHERE is it changing?                                                   │
│     Pins changes to station coordinates or native 0.5° × 0.625° NASA        │
│     MERRA-2 assimilation grid cells.                                        │
│                                                                             │
│  3. HOW MUCH is it changing?                                                │
│     Calculates Sen's slope rate (/decade and /year), non-parametric 95%     │
│     confidence intervals, and cumulative period shift.                      │
│                                                                             │
│  4. ARE the changes statistically significant?                              │
│     Conducts Mann-Kendall rank tests, checks lag-1 autocorrelation (r₁),     │
│     and controls spatial False Discovery Rate (Benjamini-Hochberg FDR).      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Scientific Breakthrough: The Regional Precipitation Dipole

The NASA Challenge specifically asks:
> *"The same environmental process may produce a rising trend in one geographical region and a falling trend in another. The project must help users discover these spatial differences rather than simply display historical charts."*

Using TerraTrend's spatial engine across the 66 native MERRA-2 cells of the Tamil Nadu / South India regional domain ($8.5^\circ\text{N} - 13.5^\circ\text{N}, 76.5^\circ\text{E} - 80.5^\circ\text{E}$, 1981–2023), the platform detected and validated a **dramatic co-occurring hydrological dipole**:

```
                              TAMIL NADU PRECIPITATION DIPOLE (1981–2023)
                                (Variable: PRECTOTCORR | 66 Grid Cells)
                                
   WESTERN GHATS RAIN SHADOW (DRYING)             COROMANDEL COASTAL CORRIDOR (WETTING)
   ─────────────────────────────────             ─────────────────────────────────────
   • 11 Cells Showing Decreasing Rain            • 55 Cells Showing Increasing Rain
   • Peak: -0.438 mm/day/decade                  • Peak: +0.329 mm/day/decade
     (-159.8 mm/year/decade)                       (+120.3 mm/year/decade)
   • p = 0.0059 (Z = -2.75)                      • p = 0.0001 (Z = +3.87)
   • 4 Cells Pass Benjamini-Hochberg FDR         • 14 Cells Pass Benjamini-Hochberg FDR
```

1. **Wetting Maritime Corridor (55 cells total, 14 FDR significant):** Peak wetting occurs along the eastern Coromandel Coast and Kaveri delta at $10.0^\circ\text{N}, 80.0^\circ\text{E}$ ($+0.329\text{ mm/day/decade} \approx +120.3\text{ mm/yr/decade}$, $p = 0.0001$).
2. **Drying Foothill Corridor (11 cells total, 4 FDR significant):** Simultaneous drying occurs in the southwest leeward rain shadow of the southern Western Ghats at $8.5^\circ\text{N}, 77.5^\circ\text{E}$ ($-0.438\text{ mm/day/decade} \approx -159.8\text{ mm/yr/decade}$, $p = 0.0059$).

Both opposing trends occur within the **same regional domain** over the **same 43-year timeframe**, demonstrating how large-scale monsoon circulation shifts manifest as opposing regional impacts.

### Additional Validated Discoveries
- **Atmospheric Stilling (`WS10M`):** 57 of 66 cells show decreasing surface wind speeds over 1981–2023. **44 cells remain statistically significant under FDR control** ($q = 0.05$), documenting widespread regional atmospheric stilling (domain mean: $-0.047\text{ m/s/decade}$).
- **Thermal Elevation Buffering (`T2M`):** All 66 cells show warming ($+0.014^\circ\text{C}$ to $+0.344^\circ\text{C/decade}$). Inland urban centers like Madurai ($+0.170^\circ\text{C/decade}$, $p = 0.0279$) show significant warming, while elevated Western Ghats gateway cities like Coimbatore ($+0.080^\circ\text{C/decade}$, $p = 0.1802$) show subdued, non-significant rates.

*For complete data tables, coordinates, and cell-by-cell matrices, see [docs/discoveries.md](docs/discoveries.md) and [docs/validation.md](docs/validation.md).*

---

## 🎨 Dual Audience Personas & Visual Craftsmanship

TerraTrend bridges the gap between academic climatologists and the public through dedicated audience modes and themes:

### 1. Audience Modes
- **Explore Mode (Default):** Tailored for students, educators, and science communicators. Replaces intimidating parameter codes with human-friendly titles (*"Rainfall & Precipitation"*, *"Surface Wind Speed"*), includes relatable real-world analogies (e.g., bathtub water levels, household fan speeds), provides takeaway callouts, and hides raw mathematical matrices behind clean cards.
- **Research Mode:** Tailored for climatologists, data scientists, and NASA challenge judges. Exposes official NASA parameter identifiers (`PRECTOTCORR`, `ALLSKY_SFC_SW_DWN`), raw and FDR-adjusted $p$-values, Gilbert rank bounds, OLS linear regression coefficients ($R^2$), and an expandable 12-metric statistical matrix with CSV/Markdown export.

### 2. Dual Visual Themes
- **Scientific Editorial Light Theme (Default):** Warm-neutral canvas (`#fbfaf7`), crisp stone typography (`#1c1917`), subtle borders, and publication-grade charts designed for daytime research and long reading sessions (contrast ratio $> 14:1$, exceeding WCAG 2.2 AAA).
- **Observatory Dark Theme:** Deep-space canvas (`#040810`), luminous cyan, emerald, and amber telemetry accents, optimized for darkroom monitoring and projection.

---

## ⏱️ Judges' 60–90 Second Demonstration Walkthrough

Follow this step-by-step walkthrough to evaluate TerraTrend in under two minutes:

1. **Launch Platform (0:00 - 0:15):**
   - Open `http://localhost:3000`. Notice the clean Editorial Light theme, the central Observatory Console, and the **Four Essential NASA Questions** answering cards immediately displaying Madurai's 43-year warming trend ($+0.170^\circ\text{C/dec}$, $p = 0.0279$, significant).
2. **Inspect Interactive Time Series & Anomaly Chart (0:15 - 0:30):**
   - Toggle trend layers: Sen's slope line, 5-year running average, and 1981–2010 climatological baseline.
   - Scroll to the Anomaly Chart showing decadal shifts with diverging red/blue bars.
3. **Trigger Regional Opposing Trends Discovery (0:30 - 0:50):**
   - In the Observatory Console, switch the variable to **"Rainfall & Precipitation"** (`PRECTOTCORR`).
   - Click the **"Regional Grid"** tab and click **"Analyze Regional Domain"**.
   - Notice the **"Opposing Regional Trends Discovered"** alert banner indicating **55 Wetting Cells** vs **11 Drying Cells**.
   - Inspect the interactive Leaflet map: Blue markers along the Coromandel coast indicate wetting ($+120\text{ mm/yr/dec}$), while amber markers in the southern Ghats rain shadow indicate drying ($-160\text{ mm/yr/dec}$). Click any marker to view localized statistics.
4. **Switch to Research Mode (0:50 - 1:10):**
   - Click **"Research"** in the top-right header toggle. Notice the instantaneous transformation: technical variable codes (`PRECTOTCORR`), Benjamini-Hochberg FDR significance controls, serial autocorrelation diagnostics, and the expandable 12-parameter statistical matrix.
5. **Theme & Export (1:10 - 1:30):**
   - Click the **Sun/Moon theme toggle** to experience the Observatory Dark mode.
   - Click **"Export Research Brief"** to inspect or download the complete analysis as a Markdown report or raw CSV.

---

## System Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │          TERRATREND FRONTEND                 │
                  │   Next.js 14 (App Router) + TypeScript 5     │
                  │   Tailwind CSS + Recharts + Leaflet Maps     │
                  └──────────────────────┬───────────────────────┘
                                         │ Reverse Proxy /api/*
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │           TERRATREND BACKEND                 │
                  │     FastAPI + Pydantic v2 + Uvicorn          │
                  └──────────────┬───────────────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌─────────────────────────────────┐   ┌──────────────────────────────────┐
│   STATISTICAL ANALYSIS ENGINE   │   │     NASA DATA INGESTION ENGINE   │
│   • Mann-Kendall (Z & p-value)  │   │   • NASA POWER Monthly API       │
│   • Sen's Slope + 95% CI        │   │   • MERRA-2 & CERES Assimilation │
│   • OLS Regression & R²         │   │   • Fill-Value Filter (-999.0)   │
│   • Autocorrelation (r₁)        │   │   • Local SHA-256 Disk Cache     │
│   • Benjamini-Hochberg FDR      │   └──────────────────────────────────┘
└─────────────────────────────────┘
```

For complete architecture documentation, see [docs/architecture.md](docs/architecture.md).

---

## NASA Datasets & Source Lineage

| Parameter Identifier | Scientific Variable Name | Units | Original Source | Dataset Lineage | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`T2M`** | Temperature at 2 Meters | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Atmospheric assimilation (`tavgM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`T2M_MAX`** | Maximum Daily 2m Temperature | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Daily maximum aggregation (`statM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`T2M_MIN`** | Minimum Daily 2m Temperature | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Daily minimum aggregation (`statM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`PRECTOTCORR`** | Precipitation Corrected | $\text{mm/day}$ & $\text{mm/yr}$ | NASA MERRA-2 + CPC | Surface flux corrected with global CPC gauges | $0.5^\circ \times 0.625^\circ$ |
| **`WS10M`** | Wind Speed at 10 Meters | $\text{m/s}$ | NASA GMAO MERRA-2 | Horizontal wind vector magnitude | $0.5^\circ \times 0.625^\circ$ |
| **`ALLSKY_SFC_SW_DWN`** | Surface Solar Downward Flux | $\text{kW-hr/m}^2/\text{day}$ | NASA CERES / FLASHFlux | Clouds & Earth Radiant Energy System SYN1deg | $1.0^\circ \times 1.0^\circ$ |
| **`RH2M`** | Relative Humidity at 2 Meters | $\%$ | NASA GMAO MERRA-2 | Derived from specific humidity & pressure | $0.5^\circ \times 0.625^\circ$ |

For full variable documentation, see [docs/data-sources.md](docs/data-sources.md).

---

## Statistical Methodology

### 1. Mann-Kendall Non-Parametric Trend Test
$$S = \sum_{k=1}^{n-1} \sum_{j=k+1}^n \text{sgn}(x_j - x_k)$$

$$\text{Var}(S) = \frac{n(n-1)(2n+5) - \sum_{t} t(t-1)(2t+5)}{18}$$

$$Z = \begin{cases} \frac{S - 1}{\sqrt{\text{Var}(S)}} & \text{if } S > 0 \\ 0 & \text{if } S = 0 \\ \frac{S + 1}{\sqrt{\text{Var}(S)}} & \text{if } S < 0 \end{cases}$$

Two-tailed significance:
$$p = 2 \times [1 - \Phi(|Z|)]$$

### 2. Sen's Slope Estimator & 95% Confidence Interval
$$Q_k = \frac{x_j - x_i}{j - i} \quad \text{for all } 1 \le i < j \le n$$
$$\text{Sen's Slope} = \text{median}(Q)$$

Two-sided 95% rank confidence interval derived from $C_\alpha = Z_{1-\alpha/2} \times \sqrt{\text{Var}(S)}$.

### 3. Spatial False Discovery Rate (Benjamini-Hochberg FDR)
When testing $m = 66$ regional grid cells simultaneously, unadjusted $\alpha = 0.05$ produces false positives by chance. We rank ordered $p$-values $p_{(1)} \le p_{(2)} \le \dots \le p_{(m)}$ and find the largest rank $k$ satisfying:
$$p_{(k)} \le \frac{k}{m} \times Q$$
All hypotheses $i = 1, \dots, k$ are declared statistically significant at FDR rate $Q = 0.05$.

For complete mathematical proofs and references, see [docs/methodology.md](docs/methodology.md).

---

## Quickstart & Installation

### Option A: Local Development

#### Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** (Node.js 20+ recommended)

#### 1. Clone Repository
```bash
git clone https://github.com/codeverse/terratrend.git
cd terratrend
```

#### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows Powershell:
.\venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API will be live at: `http://127.0.0.1:8000` (Interactive docs: `/docs`)

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Docker Compose (1-Command Startup)

```bash
docker-compose up --build
```
This builds and launches both the FastAPI backend (port 8000) and the Next.js frontend (port 3000) with volume caching enabled.

---

### Option C: Cloud Deployment (Vercel + Render/Railway/Cloud Run)

1. **Backend (Render / Railway / GCP Cloud Run):**
   - Point to `backend/` directory or use `backend/Dockerfile`.
   - Set environment variables:
     - `PORT=8000`
     - `CORS_ORIGINS=https://your-frontend-app.vercel.app`
2. **Frontend (Vercel):**
   - Connect repository, set Root Directory to `frontend`.
   - Set Environment Variable: `BACKEND_URL=https://your-backend.onrender.com`
   - Deploy.

---

## Automated Test Suite (15/15 Passed)

Run the full automated test suite covering unit tests, mathematical proofs, NASA API integration, and regional discovery verification:

```bash
# Windows Powershell:
$env:PYTHONPATH="backend"; python -m pytest backend/tests -v

# Linux / macOS:
export PYTHONPATH="backend"; python -m pytest backend/tests -v
```

### Verified Test Cases:
1. `test_all_seven_variables_exist`: Verifies metadata completeness for all 7 NASA variables.
2. `test_preset_locations_integrity`: Verifies coordinates, bounding boxes, and metadata integrity.
3. `test_regional_presets_span`: Verifies geographical bounding box bounds.
4. `test_get_variables`: Tests FastAPI `/api/variables` endpoint.
5. `test_get_locations`: Tests FastAPI `/api/locations` endpoint.
6. `test_point_trend_real_nasa_query_madurai_significant`: Validates Madurai 43-year warming ($+0.170^\circ\text{C/dec}$, $p = 0.0279$).
7. `test_point_trend_real_nasa_query_coimbatore`: Validates Coimbatore non-significant trend ($p = 0.1802$).
8. `test_regional_precip_opposing_trends_discovery`: Validates Tamil Nadu precipitation dipole (55 wetting vs 11 drying cells, FDR significant).
9. `test_regional_wind_speed_stilling`: Validates atmospheric wind speed stilling across 44 FDR-significant cells.
10. `test_precipitation_accumulation_conversion`: Validates dual-unit conversion ($\text{mm/day}$ to $\text{mm/year}$).
11. `test_ols_and_mann_kendall_positive_trend`: Validates synthetic benchmark trend detection against SciPy.
12. `test_mann_kendall_no_trend`: Validates null hypothesis retention on white noise.
13. `test_missing_data_diagnostics_and_fill_value`: Validates NASA `-999.0` fill-value exclusion.
14. `test_benjamini_hochberg_fdr`: Validates Benjamini-Hochberg FDR rank calculations.
15. `test_lag1_autocorrelation`: Validates serial autocorrelation diagnostic calculation.

---

## Scientific Limitations & Uncertainty Disclosures

1. **Spatial Scale & Resolution:** NASA MERRA-2's $0.5^\circ \times 0.625^\circ$ resolution averages atmospheric dynamics over $\approx 2,500\text{ km}^2$. Urban heat islands and steep micro-topography (such as narrow Western Ghats passes) are spatially smoothed.
2. **Assimilation Model Dependencies:** Surface variables (`T2M`, `PRECTOTCORR`, `WS10M`) are produced by the NASA GEOS atmospheric general circulation model constrained by satellite sounders and conventional weather stations. They represent physically consistent reanalysis fields rather than raw in-situ gauge readings.
3. **Serial Autocorrelation:** Multi-year oscillations (e.g., ENSO, Indian Ocean Dipole) can introduce temporal persistence in short records. We provide lag-1 autocorrelation diagnostics and modified Mann-Kendall variance adjustments to prevent false positive trend detection.

---

## Official NASA Space Apps Submission Details

- **Challenge:** [Be an Earth System Trend Detective](https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/)
- **Project Title:** TerraTrend
- **Team Name:** CODEVERSE
- **Project Link:** [https://github.com/codeverse/terratrend](https://github.com/codeverse/terratrend)
- **Primary Data Sources:**
  - NASA Prediction of Worldwide Energy Resources (POWER) Project: [https://power.larc.nasa.gov](https://power.larc.nasa.gov)
  - NASA Modern-Era Retrospective analysis for Research and Applications, Version 2 (MERRA-2), GMAO, NASA Goddard Space Flight Center.
  - NASA Clouds and the Earth's Radiant Energy System (CERES) SYN1deg, NASA Langley Research Center.
- **Tags & Keywords:** `NASA Earth Science`, `Climate Trends`, `MERRA-2`, `CERES`, `Mann-Kendall`, `Sen's Slope`, `Precipitation Dipole`, `Atmospheric Stilling`, `False Discovery Rate`, `Full-Stack GIS`, `FastAPI`, `Next.js`.
- **AI & Space Agency Data Transparency:** TerraTrend was designed and implemented by CODEVERSE using modern software engineering tools. All data ingestion, scientific computations, statistical tests, and visual layers operate deterministically on real NASA data without generative simulation or synthetic hallucination.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details. NASA data remains in the public domain under the [NASA Open Data Policy](https://www.nasa.gov/open/data.html).
