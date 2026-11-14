# TERRATREND | NASA Earth System Trend Discovery & Intelligence Platform

[![NASA Space Apps 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-0B3D91.svg)](https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20SciPy%20%7C%20Pandas-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20TypeScript%20%7C%20Tailwind-black.svg)](https://nextjs.org)
[![Tests](https://img.shields.io/badge/Tests-Pytest%20Passing%20(9%2F9)-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Official Submission for the 2026 NASA Space Apps Challenge:**  
> **Challenge:** "Be an Earth System Trend Detective"  
> **Team:** CODEVERSE  

---

## 1. Problem Statement

Detecting meaningful long-term trends across Earth's climate system is challenging. Climate records exhibit natural decadal variability, missing values, extreme weather outliers, and spatial heterogeneity. Casual observers and non-specialists frequently struggle with:
1. Identifying whether an observed environmental shift is real or merely short-term noise.
2. Distinguishing between practical physical magnitude and rigorous statistical significance.
3. Interpreting raw multi-dimensional reanalysis products without specialized domain tools.
4. Avoiding the multiple-testing fallacy when analyzing spatial grids across large geographic regions.

---

## 2. Project Overview

**TerraTrend** is an open-source, evidence-grounded Earth-system intelligence platform. It enables researchers, educators, policymakers, and citizen scientists to query historical satellite and atmospheric assimilation records, visualize multi-decade trajectories, execute rank-based non-parametric trend tests, and generate grounded natural-language scientific explanations.

The platform answers the **Four Essential NASA Questions**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE 4 ESSENTIAL NASA TREND QUESTIONS                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. WHAT is changing?                                                       │
│     Identifies the physical variable, baseline climatological mean, and    │
│     direction of change.                                                    │
│                                                                             │
│  2. WHERE is it changing?                                                   │
│     Pins changes to station coordinates or native 0.5° × 0.625° NASA        │
│     MERRA-2 assimilation grid cells.                                        │
│                                                                             │
│  3. HOW MUCH is it changing?                                                │
│     Calculates Sen's slope rate (/decade and /year), non-parametric 95%     │
│     confidence intervals, and cumulative period shift.                     │
│                                                                             │
│  4. ARE the changes statistically significant?                              │
│     Conducts Mann-Kendall rank tests, checks lag-1 autocorrelation (r₁),    │
│     and controls spatial False Discovery Rate (Benjamini-Hochberg FDR).     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Capabilities

- **Direct NASA Ingestion:** Seamless integration with NASA POWER Monthly and Regional APIs, accessing 44 continuous years (1981–2024) of MERRA-2 and CERES data.
- **Fill-Value & Missing-Data Filters:** Automatic detection and sanitization of `-999.0` fill values.
- **Robust Statistical Engine:**
  - Non-parametric **Mann-Kendall test** with tie-corrected variance and two-tailed $p$-value.
  - Non-parametric **Sen's Slope Estimator** with rank-based 95% confidence intervals.
  - Parametric **Ordinary Least Squares (OLS)** linear regression for comparison ($R^2$).
  - **Serial Autocorrelation Check** ($r_1$) and modified Mann-Kendall test (Hamed & Rao 1998 / Yue & Wang 2004).
  - Spatial **Benjamini-Hochberg False Discovery Rate (FDR)** control for regional multi-cell domains.
- **Interactive Visualization Suite:**
  - Historical time series with toggleable trend layers (Sen's slope, OLS fit, 5-year running average, climatological baseline).
  - Diverging anomaly charts (red/blue).
  - High-performance Leaflet spatial maps rendering 66 native MERRA-2 grid cells with local vs. FDR significance toggles.
- **Automated Research Export:** One-click download of full datasets as `.csv` or formatted executive briefs as `.md`.

---

## 4. Architecture & System Flow

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

For complete technical details, see [docs/architecture.md](docs/architecture.md).

---

## 5. NASA Datasets & Source Lineage

| Parameter Identifier | Scientific Variable Name | Units | Original Source | Dataset Lineage | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`T2M`** | Temperature at 2 Meters | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Atmospheric assimilation (`tavgM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`T2M_MAX`** | Maximum Daily 2m Temperature | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Daily maximum aggregation (`statM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`T2M_MIN`** | Minimum Daily 2m Temperature | $^\circ\text{C}$ | NASA GMAO MERRA-2 | Daily minimum aggregation (`statM_2d_slv_Nx`) | $0.5^\circ \times 0.625^\circ$ |
| **`PRECTOTCORR`** | Precipitation Corrected | $\text{mm/day}$ | NASA MERRA-2 + CPC | Surface flux corrected with global CPC gauges | $0.5^\circ \times 0.625^\circ$ |
| **`WS10M`** | Wind Speed at 10 Meters | $\text{m/s}$ | NASA GMAO MERRA-2 | Horizontal wind vector magnitude | $0.5^\circ \times 0.625^\circ$ |
| **`ALLSKY_SFC_SW_DWN`** | Surface Solar Downward Flux | $\text{kW-hr/m}^2/\text{day}$ | NASA CERES / FLASHFlux | Clouds & Earth Radiant Energy System SYN1deg | $1.0^\circ \times 1.0^\circ$ |
| **`RH2M`** | Relative Humidity at 2 Meters | $\%$ | NASA GMAO MERRA-2 | Derived from specific humidity & pressure | $0.5^\circ \times 0.625^\circ$ |

For full variable documentation, see [docs/data-sources.md](docs/data-sources.md).

---

## 6. Statistical Methodology

### Mann-Kendall Non-Parametric Trend Test
$$S = \sum_{k=1}^{n-1} \sum_{j=k+1}^n \text{sgn}(x_j - x_k)$$

$$\text{Var}(S) = \frac{n(n-1)(2n+5) - \sum_{t} t(t-1)(2t+5)}{18}$$

$$Z = \begin{cases} \frac{S - 1}{\sqrt{\text{Var}(S)}} & \text{if } S > 0 \\ 0 & \text{if } S = 0 \\ \frac{S + 1}{\sqrt{\text{Var}(S)}} & \text{if } S < 0 \end{cases}$$

Two-tailed significance:
$$p = 2 \times [1 - \Phi(|Z|)]$$

### Sen's Slope Estimator & 95% Confidence Interval
$$Q_k = \frac{x_j - x_i}{j - i} \quad \text{for all } 1 \le i < j \le n$$
$$\text{Sen's Slope} = \text{median}(Q)$$

Two-sided 95% rank confidence interval derived from $C_\alpha = Z_{1-\alpha/2} \times \sqrt{\text{Var}(S)}$.

For full mathematical proofs, see [docs/methodology.md](docs/methodology.md).

---

## 7. Study Region & Verified Findings (1981–2023)

Demonstration focus: **Tamil Nadu, India** ($8.5^\circ\text{N} - 13.5^\circ\text{N}, 76.5^\circ\text{E} - 80.5^\circ\text{E}$), spanning coastal, riverine, and Western Ghats montane ecosystems.

### Station Verification Benchmark

| Location | Coordinates | Sen's Slope Rate | 95% Confidence Interval | OLS Slope ($R^2$) | Mann-Kendall $Z$ | $p$-value | Significance ($\alpha=0.05$) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Madurai** | $9.93^\circ\text{N}, 78.12^\circ\text{E}$ | **$+0.170^\circ\text{C/dec}$** | $[+0.023, +0.313]$ | $+0.164^\circ\text{C/dec}$ ($R^2=0.15$) | $+2.20$ | **$p = 0.0279$** | **STATISTICALLY SIGNIFICANT WARMING** |
| **Chennai** | $13.08^\circ\text{N}, 80.27^\circ\text{E}$ | $+0.060^\circ\text{C/dec}$ | $[-0.004, +0.131]$ | $+0.059^\circ\text{C/dec}$ ($R^2=0.08$) | $+1.79$ | $p = 0.0734$ | Borderline Non-Significant |
| **Coimbatore** | $11.02^\circ\text{N}, 76.96^\circ\text{E}$ | $+0.080^\circ\text{C/dec}$ | $[-0.026, +0.203]$ | $+0.079^\circ\text{C/dec}$ ($R^2=0.06$) | $+1.34$ | $p = 0.1802$ | Inconclusive / Not Significant |

### Scientific Discussion on Coimbatore
Coimbatore's 43-year observational record demonstrates a modest estimated slope ($+0.080^\circ\text{C/decade}$), but the trend does not reach 95% statistical significance ($p = 0.1802$).
> **Scientific Caveat:** We treat regional orographic moderation (such as Western Ghats windward/leeward gap effects) as an **unconfirmed working hypothesis** rather than an established physical fact. At the $0.5^\circ$ resolution of MERRA-2, complex mountain pass micro-climates cannot be resolved without fine-scale meso-scale modeling or dense in-situ station networks.

### Regional Grid Analysis (66 Native MERRA-2 Cells)
- **Domain Mean Sen's Slope:** $+0.110^\circ\text{C/decade}$
- **Cell Rate Range:** $+0.014^\circ\text{C/decade}$ to $+0.344^\circ\text{C/decade}$
- **Unadjusted Significant Cells ($\alpha = 0.05$):** 29 of 66 cells ($43.9\%$)
- **FDR Corrected Significant Cells ($q = 0.05$):** 24 of 66 cells ($36.4\%$)

For full validation tables, see [docs/validation.md](docs/validation.md).

---

## 8. Installation & Local Development

### Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** (Node.js 20+ recommended)

### 1. Clone Repository
```bash
git clone https://github.com/codeverse/terratrend.git
cd terratrend
```

### 2. Backend Setup
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
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. API Documentation & Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/variables` | Returns supported variables with complete NASA metadata |
| `GET` | `/api/locations` | Returns preset demonstration stations and regional bounding boxes |
| `POST` | `/api/trend/point` | Executes point trend analysis (OLS, Mann-Kendall, Sen's slope, 95% CI) |
| `POST` | `/api/trend/regional` | Executes spatial grid analysis across bounding boxes with Benjamini-Hochberg FDR |

---

## 10. Automated Tests & Reproducibility

Execute the complete automated test suite:
```bash
# Set PYTHONPATH to backend directory
$env:PYTHONPATH="backend"   # Windows Powershell
# export PYTHONPATH="backend" # Linux / macOS

python -m pytest backend/tests -v
```

All 9 test cases pass:
- `test_get_variables`
- `test_get_locations`
- `test_point_trend_real_nasa_query_madurai_significant`
- `test_point_trend_real_nasa_query_coimbatore`
- `test_ols_and_mann_kendall_positive_trend`
- `test_mann_kendall_no_trend`
- `test_missing_data_diagnostics_and_fill_value`
- `test_benjamini_hochberg_fdr`
- `test_lag1_autocorrelation`

---

## 11. Scientific Limitations & Uncertainty

1. **Spatial Scale:** MERRA-2's $0.5^\circ \times 0.625^\circ$ resolution averages atmospheric dynamics over $\approx 2,500\text{ km}^2$. Urban micro-climates and steep topography are smoothed.
2. **Assimilation Model Dependency:** Reanalysis assimilates satellite sounders and conventional weather stations through the NASA GEOS model. Surface variables are model diagnostics rather than raw in-situ readings.
3. **Serial Autocorrelation:** Multi-year oscillations (e.g., ENSO) can bias short records. We provide lag-1 autocorrelation diagnostics and modified Mann-Kendall adjustments to address this.

---

## 12. Team & Acknowledgements

Developed by **CODEVERSE** for the 2026 NASA International Space Apps Challenge.
Special thanks to:
- The **NASA POWER Project Team** at NASA Langley Research Center.
- The **NASA Global Modeling and Assimilation Office (GMAO)** for MERRA-2.
- The **NASA CERES Science Team**.

---

## 13. License & Citation

- **Code:** Licensed under the [MIT License](LICENSE).
- **NASA Data:** Public domain under [NASA Open Data Policy](https://www.nasa.gov/open/data.html).
- **Citation:** See [CITATION.cff](CITATION.cff).
