# TERRATREND | NASA Earth System Trend Discovery & Intelligence Platform

[![NASA Space Apps 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-0B3D91.svg)](https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20SciPy%20%7C%20Pandas-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20TypeScript%20%7C%20Tailwind-black.svg)](https://nextjs.org)
[![Tests](https://img.shields.io/badge/Tests-Pytest%20Passing%20(24%2F24)-brightgreen.svg)]()
[![ESLint](https://img.shields.io/badge/ESLint-Clean%20(0%20warnings)-brightgreen.svg)]()
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA%20Compliant-blue.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **NASA Space Apps Challenge 2026 Submission**<br>
> **Challenge:** [Be an Earth System Trend Detective](https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/)<br>
> **Team:** CODEVERSE<br>
> **Repository:** [https://github.com/Prithic/terratrend](https://github.com/Prithic/terratrend)

---

## 1. Challenge & Problem Statement

Earth's climate system exhibits pronounced natural decadal variability, missing observations, extreme weather outliers, and spatial heterogeneity. Casual observers and decision-makers often face critical obstacles when evaluating environmental change:
1. **Disentangling Trend from Noise:** Differentiating authentic decadal shifts from temporary meteorological fluctuations or cyclic oscillations (e.g., ENSO, Indian Ocean Dipole).
2. **Rate Magnitude vs Statistical Significance:** Recognizing that an environmentally large shift may lack statistical significance under high variance, while a modest shift in a stable maritime zone may achieve high statistical significance.
3. **Spatial Divergence within Single Systems:** Large-scale atmospheric forcing often drives opposing physical impacts across neighboring micro-climates (such as windward rainfall intensification versus leeward rain-shadow desiccation).
4. **Spatial Multiple Testing Fallacy:** Testing dozens of spatial grid cells simultaneously inflates false positive rates unless controlled using False Discovery Rate (FDR) corrections.

TerraTrend was engineered to answer the **Four Essential NASA Questions**:

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

## 2. TerraTrend Solution Overview

**TerraTrend** is an open-source, evidence-grounded Earth-system intelligence platform. Operating with **zero synthetic data** and **zero hardcoded scientific outcomes**, all point and spatial queries retrieve, filter, and analyze real assimilation data from the official **NASA POWER Monthly API** (MERRA-2 atmospheric assimilation and CERES solar irradiance products).

Key capabilities:
- **Strict Fill-Value Parsing:** Automatically strips `-999.0` NASA missing values prior to statistical computation.
- **Calendar-Year Non-Parametric Modeling:** Fits Sen's slopes using actual calendar years via SciPy Theil–Sen, correctly handling observational gaps and missing years.
- **WMO-Standard Significance Testing:** Performs two-sided Mann-Kendall trend tests with full tie-corrected variance and lag-1 autocorrelation diagnostics ($r_1$).
- **Spatial False Discovery Rate:** Enforces Benjamini-Hochberg FDR control ($q = 0.05$) across multi-cell regional grids.
- **Evidence-Grounded Insights:** Synthesizes structured answers to the 4 Essential Questions without ungrounded causal speculation.

---

## 3. Explore & Research User Experiences

TerraTrend provides two purpose-built personas and dual visual themes:

### Dual Audience Modes
| Feature | Explore Mode (Default) | Research Mode |
| :--- | :--- | :--- |
| **Primary Audience** | General public, students, educators, policymakers | Climatologists, data scientists, NASA judges |
| **Variable Naming** | Human-friendly (*"Rainfall & Precipitation"*) | Official NASA parameter codes (`PRECTOTCORR`) |
| **Analogies & Mental Models** | Relatable physical analogies (e.g., bathtub water levels) | Formal physical unit definitions |
| **Statistical Presentation** | Clear qualitative badges (*"Statistically Significant"*) | Exact $p$-values, FDR $q$-values, Mann-Kendall $Z$, $\tau$, variance |
| **Data Matrix** | Collapsed key metrics card | Expandable 12-parameter technical matrix with CSV/MD export |

### Dual Visual Themes
- **Scientific Editorial Light Theme (Default):** Warm-neutral canvas (`#fbfaf7`), crisp stone typography (`#1c1917`), subtle borders, and publication-grade charts designed for daytime research (contrast ratio $> 14:1$, exceeding WCAG 2.2 AAA).
- **Observatory Dark Theme:** Deep-space canvas (`#040810`), luminous cyan, emerald, and amber telemetry accents for darkroom monitoring and projection.

---

## 4. Supported NASA Variables

| Identifier | Name | Units | Source | Dataset Lineage | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`T2M`** | Temperature at 2 Meters | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Atmospheric assimilation (`tavgM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`T2M_MAX`** | Maximum Daily 2m Temperature | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Daily maximum aggregation (`statM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`T2M_MIN`** | Minimum Daily 2m Temperature | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Daily minimum aggregation (`statM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`PRECTOTCORR`** | Precipitation Corrected | $\text{mm/day}$ | NASA MERRA-2 + CPC | Surface flux corrected with global CPC gauges | $0.5^\circ \times 0.625^\circ$ |
| **`WS10M`** | Wind Speed at 10 Meters | $\text{m/s}$ | NASA GMAO MERRA-2 | Horizontal wind vector magnitude | $0.5^\circ \times 0.625^\circ$ |
| **`ALLSKY_SFC_SW_DWN`** | Surface Solar Downward Flux | $\text{kW-hr/m}^2/\text{day}$ | NASA CERES / FLASHFlux | Clouds & Earth Radiant Energy System SYN1deg | $1.0^\circ \times 1.0^\circ$ |
| **`RH2M`** | Relative Humidity at 2 Meters | $\%$ | NASA GMAO MERRA-2 | Derived from specific humidity & pressure | $0.5^\circ \times 0.625^\circ$ |

*For complete variable metadata and data processing details, see [docs/data-sources.md](docs/data-sources.md).*

---

## 5. Statistical Methodology

### 1. Mann-Kendall Non-Parametric Trend Test
$$S = \sum_{k=1}^{n-1} \sum_{j=k+1}^n \text{sgn}(x_j - x_k)$$

$$\text{Var}(S) = \frac{n(n-1)(2n+5) - \sum_{t} t(t-1)(2t+5)}{18}$$

$$Z = \begin{cases} \frac{S - 1}{\sqrt{\text{Var}(S)}} & \text{if } S > 0 \\ 0 & \text{if } S = 0 \\ \frac{S + 1}{\sqrt{\text{Var}(S)}} & \text{if } S < 0 \end{cases}$$

Two-tailed significance:
$$p = 2 \times [1 - \Phi(|Z|)]$$

### 2. Sen's Slope Estimator & 95% Confidence Interval
Calculated using true calendar years $t_i$:
$$Q_k = \frac{x_j - x_i}{t_j - t_i} \quad \text{for all } 1 \le i < j \le n$$
$$\text{Sen's Slope} = \text{median}(Q)$$
Confidence intervals are derived non-parametrically using SciPy's Theil-Sen implementation.

### 3. Spatial False Discovery Rate (Benjamini-Hochberg FDR)
When evaluating $m$ grid cells simultaneously across space, testing at unadjusted $\alpha = 0.05$ produces false positives by chance. We rank ordered $p$-values $p_{(1)} \le p_{(2)} \le \dots \le p_{(m)}$ and find the largest rank $k$ satisfying:
$$p_{(k)} \le \frac{k}{m} \times Q$$
All hypotheses $i = 1, \dots, k$ are declared statistically significant at FDR rate $Q = 0.05$.

*For complete proofs and references, see [docs/methodology.md](docs/methodology.md).*

---

## 6. Scientific Findings: Verified vs. Exploratory Research

To maintain scientific integrity, TerraTrend clearly distinguishes between verified platform results and preliminary exploratory research:

### A. Verified Station Benchmarks (1981–2023)
- **Madurai ($9.93^\circ\text{N}, 78.12^\circ\text{E}$):** 43 continuous years of MERRA-2 `T2M` confirm a statistically significant warming trend:
  - Sen's slope: **$+0.170^\circ\text{C/decade}$** (95% CI: $[+0.023, +0.313]$)
  - Mann-Kendall: $Z = +2.20$, **$p = 0.0279$** (Significant at $\alpha = 0.05$)
  - Serial autocorrelation: $r_1 = 0.189$ (within Bartlett 95% noise bounds $\pm 0.299$)
- **Coimbatore ($11.02^\circ\text{N}, 76.96^\circ\text{E}$):** 43 continuous years of MERRA-2 `T2M` show a modest positive slope that does not achieve statistical significance:
  - Sen's slope: $+0.080^\circ\text{C/decade}$ (95% CI: $[-0.026, +0.203]$)
  - Mann-Kendall: $Z = +1.34$, $p = 0.1802$ (Not significant; correctly identified by platform)

### B. Exploratory Regional Bounding Box Research (66 MERRA-2 Grid Cells)
The regional analysis covers a rectangular bounding box ($8.5^\circ - 13.5^\circ\text{N}, 76.5^\circ - 80.5^\circ\text{E}$) spanning southern peninsular India and adjacent maritime waters.

> **Scientific Disclosure:** This rectangular domain is an exploratory bounding box, not an administrative boundary mask. Numerical results below are preliminary exploratory findings from a cached regional payload, not certified independent NASA publications.

1. **Precipitation (`PRECTOTCORR`, 1981–2023):**
   - **Production Units:** The production API serves NASA's annual mean daily rate in **`mm/day`**.
   - **Exploratory Spatial Rates:** Across 66 cells, estimated Sen's slope rates range from $-0.438\text{ mm/day/decade}$ (leeward southern rain shadow) to $+0.329\text{ mm/day/decade}$ (eastern Coromandel marine corridor).
   - **Significance Distribution:** 55 cells exhibit positive estimated rates (14 pass Benjamini-Hochberg FDR at $q=0.05$; 2 pass conservative Benjamini-Yekutieli FDR). 11 cells exhibit negative estimated rates (4 pass BH FDR; 0 pass BY FDR).
   - **Calendar-Aware Annual Accumulation:** A separate exploratory script (`backend/scripts/analyze_cached_precipitation.py`) sums month-length-weighted daily rates to derive exact annual totals in `mm/year` (accounting for leap years). These calculations are documented separately in [docs/precipitation_cached_exploratory_cells.csv](docs/precipitation_cached_exploratory_cells.csv) and are not mixed with daily rate slopes.
2. **Atmospheric Stilling (`WS10M`, 1981–2023):**
   - 57 of 66 cells show negative Sen's slope estimates, with 44 cells passing Benjamini-Hochberg FDR control ($q = 0.05$), indicating decadal deceleration in near-surface wind speeds.

*For full exploratory cell tables and sensitivity analyses, see [docs/discoveries.md](docs/discoveries.md) and [docs/codex-independent-review.md](docs/codex-independent-review.md).*

---

## 7. System Architecture

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
│   • Theil-Sen Slope + 95% CI    │   │   • MERRA-2 & CERES Assimilation │
│   • OLS Regression & R²         │   │   • Fill-Value Filter (-999.0)   │
│   • Autocorrelation (r₁)        │   │   • Configurable Disk Cache      │
│   • Benjamini-Hochberg FDR      │   │   • Retries & Timeout Controls   │
└─────────────────────────────────┘   └──────────────────────────────────┘
```

---

## 8. Quickstart & Installation

### Option A: Local Development

#### Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** (Node.js 20+ recommended)

#### 1. Backend Setup
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
API runs at: `http://127.0.0.1:8000` (Interactive docs: `http://127.0.0.1:8000/docs`)

#### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Docker Compose (Syntax Verified)
```bash
docker compose up --build
```
*Note: Docker Compose configuration has been verified via `docker compose config`.*

---

## 9. Automated Testing (24/24 Passed)

TerraTrend organizes its test suite into fast deterministic unit tests and end-to-end integration tests:

```bash
# Run deterministic unit tests (no network or cache required):
python -m pytest -m unit -v

# Run full test suite:
python -m pytest -v
```

### Verified Test Categories:
- **`test_precipitation_aggregation.py` (8 unit tests):** Verifies leap-year (366-day) vs standard (365-day) accumulation, missing month rejection, and invalid fill-value filtering.
- **`test_statistics.py` (6 unit/benchmark tests):** Verifies Mann-Kendall detection on known trends, null hypothesis retention on white noise, fill-value exclusion, analytical Benjamini-Hochberg FDR ranking, serial autocorrelation ($r_1$), and Theil-Sen calendar spacing with gaps.
- **`test_catalog_metadata.py` (3 unit tests):** Verifies metadata completeness, coordinates, and bounding box spans for all 7 NASA variables.
- **`test_nasa_integration.py` (4 unit & integration tests):** Verifies API endpoints for `/api/variables`, `/api/locations`, Madurai significant warming, and Coimbatore non-significance.
- **`test_regional_discovery.py` (3 unit & integration tests):** Verifies regional spatial calculation, summary statistics, FDR control, and calendar-day aggregation distinction.

### Frontend Quality:
- **ESLint:** Clean (`npm run lint` exits 0 with 0 warnings).
- **TypeScript & Build:** Clean (`npm run build` exits 0 with 5/5 static pages prerendered).

---

## 10. Visual QA & Screenshots Gallery

High-resolution screenshots are archived in [`docs/screenshots/final/`](docs/screenshots/final/):

| Viewport | Mode / View | Screenshot Link |
| :--- | :--- | :--- |
| Desktop (1280x800) | Editorial Light • Explore Mode | [01_desktop_editorial_light_explore.png](docs/screenshots/final/01_desktop_editorial_light_explore.png) |
| Desktop (1280x800) | Editorial Light • Research Mode | [02_desktop_editorial_light_research.png](docs/screenshots/final/02_desktop_editorial_light_research.png) |
| Desktop (1280x800) | Observatory Dark • Research Mode | [03_desktop_observatory_dark_research.png](docs/screenshots/final/03_desktop_observatory_dark_research.png) |
| Desktop (1280x800) | Observatory Dark • Regional Map | [04_desktop_observatory_dark_regional_map.png](docs/screenshots/final/04_desktop_observatory_dark_regional_map.png) |
| Desktop (1280x800) | Editorial Light • Regional Map | [05_desktop_editorial_light_regional_map.png](docs/screenshots/final/05_desktop_editorial_light_regional_map.png) |
| Tablet (768x1024) | Editorial Light • Responsive View | [06_tablet_768px_editorial_light.png](docs/screenshots/final/06_tablet_768px_editorial_light.png) |
| Mobile (375x667) | Editorial Light • Mobile View | [07_mobile_375px_editorial_light.png](docs/screenshots/final/07_mobile_375px_editorial_light.png) |
| Desktop (1280x800) | Methodology Modal Dialog | [08_desktop_methodology_modal.png](docs/screenshots/final/08_desktop_methodology_modal.png) |
| Desktop (1280x800) | Export Research Brief Modal | [09_desktop_export_modal.png](docs/screenshots/final/09_desktop_export_modal.png) |

---

## 11. Scientific Limitations & Uncertainty Disclosures

1. **Spatial Scale:** NASA MERRA-2's $0.5^\circ \times 0.625^\circ$ grid cells average atmospheric physics over $\approx 2,500\text{ km}^2$. Micro-topographic features (such as mountain passes) and localized urban heat islands cannot be resolved without fine-scale meso-scale modeling.
2. **Assimilation Model Dependencies:** Surface variables (`T2M`, `PRECTOTCORR`, `WS10M`) are produced by the NASA GEOS atmospheric general circulation model assimilating satellite sounders and conventional weather observations. They represent physically consistent reanalysis diagnostics rather than isolated thermometer readings.
3. **Serial Autocorrelation:** Multi-year oscillations (e.g., ENSO) can introduce persistence. We compute lag-1 autocorrelation diagnostics to detect potential variance inflation.
4. **Spatial Dependence:** Regional hypothesis tests across contiguous grid cells exhibit spatial autocorrelation. Benjamini-Hochberg FDR provides standard false discovery control, but conservative procedures (e.g. Benjamini-Yekutieli) yield fewer significant cells under arbitrary dependence.

---

## 12. Official NASA Space Apps Submission Details

- **Challenge:** [Be an Earth System Trend Detective](https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/)
- **Project Title:** TerraTrend
- **Team Name:** CODEVERSE
- **Repository:** [https://github.com/Prithic/terratrend](https://github.com/Prithic/terratrend)
- **Primary Data Sources:**
  - NASA Prediction of Worldwide Energy Resources (POWER) Project: [https://power.larc.nasa.gov](https://power.larc.nasa.gov)
  - NASA Modern-Era Retrospective analysis for Research and Applications, Version 2 (MERRA-2), GMAO, NASA Goddard Space Flight Center.
  - NASA Clouds and the Earth's Radiant Energy System (CERES) SYN1deg, NASA Langley Research Center.
- **Tags & Keywords:** `NASA Earth Science`, `Climate Trends`, `MERRA-2`, `CERES`, `Mann-Kendall`, `Sen's Slope`, `False Discovery Rate`, `Full-Stack GIS`, `FastAPI`, `Next.js`.
- **AI & Space Agency Data Transparency:** TerraTrend was architected and implemented by CODEVERSE using modern software engineering tools. All data ingestion, statistical calculations, significance determinations, and visual representations operate deterministically on real NASA data without generative simulation or synthetic fabrication.

---

## 13. License

Distributed under the MIT License. See [LICENSE](LICENSE) for details. NASA data remains in the public domain under the [NASA Open Data Policy](https://www.nasa.gov/open/data.html).
