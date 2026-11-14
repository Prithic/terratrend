# TERRATREND | NASA Earth System Trend Discovery & Intelligence Platform

[![NASA Space Apps 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-0B3D91.svg)](https://www.spaceappschallenge.org/2026/challenges/be-an-earth-system-trend-detective/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20SciPy%20%7C%20Pandas-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20TypeScript%20%7C%20Tailwind-black.svg)](https://nextjs.org)
[![Tests](https://img.shields.io/badge/Tests-Pytest%20Passing%20(9%2F9)-brightgreen.svg)]()

> **Official Solution for the 2026 NASA Space Apps Challenge:**  
> **"Be an Earth System Trend Detective"**

---

## 1. Product Vision & Essential Acceptance Criteria

**TerraTrend** is an open, evidence-grounded scientific intelligence platform designed to discover, quantify, statistically evaluate, and explain historical Earth-system changes using official **NASA Earth Observations and Meteorological Assimilation Data (MERRA-2 & CERES)**.

TerraTrend is engineered to definitively answer the **Four Essential NASA Questions**:

| Essential NASA Question | TerraTrend Scientific Resolution |
| :--- | :--- |
| **1. WHAT is changing?** | Identifies the physical Earth parameter (e.g., 2m Air Temperature, Precipitation, Solar Irradiance), its baseline climatological mean, and direction of shift. |
| **2. WHERE is it changing?** | Pins changes to precise coordinates, station locations, or native 0.5° × 0.625° NASA MERRA-2 grid cells across regional terrain. |
| **3. HOW MUCH is it changing?** | Computes the non-parametric **Sen's Slope Estimator** (rate/decade and rate/year) with 95% rank-based confidence intervals and total period change, contrasted with parametric OLS linear regression ($R^2$). |
| **4. ARE the changes statistically significant?** | Conducts rank-based **Mann-Kendall Trend Testing** ($S$, $\text{Var}(S)$, normalized $Z$, two-tailed $p$-value), adjusts for serial autocorrelation ($r_1$), and controls spatial multiple-testing via **Benjamini-Hochberg False Discovery Rate (FDR)**. |

---

## 2. Scientific Data Strategy & Lineage

TerraTrend rejects fabricated data and synthetic mocks. All analyses are executed directly against official NASA resources:

- **Primary Source:** [NASA POWER Monthly API](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/) (Langley Research Center)
- **Lineage:**
  - **MERRA-2:** Modern-Era Retrospective Analysis for Research and Applications, Version 2 (NASA GMAO). Assimilates spaceborne sounders (AIRS, AMSU), microwave radiometers, and global meteorological observations.
  - **CERES:** Clouds and the Earth's Radiant Energy System (NASA Langley) for all-sky surface downward solar irradiance (`ALLSKY_SFC_SW_DWN`).
  - **Precipitation:** MERRA-2 corrected with CPC gauge observations (`PRECTOTCORR`).
- **Observational Period:** 1981–2024 (up to 44 continuous years).
- **Study Demonstration Region:** Tamil Nadu, India (encompassing Western Ghats orographic gradients, central Kaveri agricultural basin, and Coromandel coastal zones).
  - *Demonstration Stations:* Coimbatore, Chennai, Madurai, Tiruchirappalli, Salem, Kanyakumari, Ooty (Nilgiris).

---

## 3. Statistical Methodology

### A. Non-Parametric Mann-Kendall Test
The Mann-Kendall test tests the null hypothesis ($H_0$) of no monotonic trend versus the alternative ($H_1$) of an upward or downward monotonic trend:

$$S = \sum_{k=1}^{n-1} \sum_{j=k+1}^n \text{sgn}(x_j - x_k)$$

Variance with tie correction:
$$\text{Var}(S) = \frac{n(n-1)(2n+5) - \sum_{t} t(t-1)(2t+5)}{18}$$

Standardized test statistic:
$$Z = \begin{cases} \frac{S - 1}{\sqrt{\text{Var}(S)}} & \text{if } S > 0 \\ 0 & \text{if } S = 0 \\ \frac{S + 1}{\sqrt{\text{Var}(S)}} & \text{if } S < 0 \end{cases}$$

Two-tailed significance:
$$p = 2 \times [1 - \Phi(|Z|)]$$

### B. Sen's Slope Estimator & 95% Confidence Interval
Calculates the median of all pairwise slopes:
$$Q_{k} = \frac{x_j - x_i}{j - i} \quad \text{for all } 1 \le i < j \le n$$
$$\text{Sen's Slope} = \text{median}(Q)$$

Two-sided 95% rank confidence interval derived from $C_\alpha = Z_{1-\alpha/2} \times \sqrt{\text{Var}(S)}$.

### C. Serial Autocorrelation Correction
Calculates sample lag-1 autocorrelation ($r_1$). When $|r_1| > 1.96 / \sqrt{N}$, modified Mann-Kendall variance inflation adjustments (Hamed & Rao 1998 / Yue & Wang 2004) are applied to eliminate false rejections driven by multi-year climate persistence.

### D. Benjamini-Hochberg False Discovery Rate (FDR)
Controls family-wise false discoveries when analyzing dozens of regional spatial grid cells simultaneously ($\text{FDR} \le 0.05$).

---

## 4. Key Scientific Findings in Study Region (1981–2023)

| Location | Variable | Sen's Rate | Mann-Kendall $Z$ | $p$-value | Significance ($\alpha=0.05$) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Madurai** | T2M (Temperature) | **+0.170 °C/decade** | $+2.20$ | **$p = 0.0279$** | **STATISTICALLY SIGNIFICANT WARMING** |
| **Chennai** | T2M (Temperature) | $+0.060$ °C/decade | $+1.79$ | $p = 0.0734$ | Borderline / Inconclusive |
| **Coimbatore** | T2M (Temperature) | $+0.080$ °C/decade | $+1.34$ | $p = 0.1802$ | Natural Decadal Variability (Western Ghats Gap) |

*Honest Scientific Distinction:* TerraTrend accurately identifies that while Madurai has experienced statistically significant warming ($p < 0.05$), Coimbatore's observed trend does not yet reach 95% significance due to interannual orographic buffering.

---

## 5. Technology Stack & Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │          TERRATREND FRONTEND                 │
                  │   Next.js 14 (App Router) + TypeScript       │
                  │   Tailwind CSS + Recharts + Leaflet Maps     │
                  └──────────────────────┬───────────────────────┘
                                         │ Reverse Proxy /api/*
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │           TERRATREND BACKEND                 │
                  │     FastAPI + Pydantic + Uvicorn             │
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

---

## 6. Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ (Node 20+ recommended)

### 1. Backend Setup & Run
```bash
# Navigate to backend and install dependencies
cd backend
pip install -r requirements.txt

# Run the FastAPI server on port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup & Run
```bash
# Navigate to frontend and install dependencies
cd frontend
npm install

# Start development server
npm run dev
# Or build and run production
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Automated Test Suite

TerraTrend includes comprehensive unit and integration tests verifying API response parsing, missing data handling, Sen's slope, Mann-Kendall significance, and live NASA POWER queries:

```bash
# Set python path and execute pytest
$env:PYTHONPATH="backend"   # Windows Powershell
# or: export PYTHONPATH="backend"  # Linux / macOS

python -m pytest backend/tests -v
```

Test Results:
- `test_get_variables` — PASSED
- `test_get_locations` — PASSED
- `test_point_trend_real_nasa_query_madurai_significant` — PASSED (Verified $p < 0.05$)
- `test_point_trend_real_nasa_query_coimbatore` — PASSED (Verified $p > 0.05$)
- `test_ols_and_mann_kendall_positive_trend` — PASSED
- `test_mann_kendall_no_trend` — PASSED
- `test_missing_data_diagnostics_and_fill_value` — PASSED (-999.0 fill value handling)
- `test_benjamini_hochberg_fdr` — PASSED (FDR spatial multi-testing vector)
- `test_lag1_autocorrelation` — PASSED

---

## 8. NASA Data Attribution & Citations

1. **NASA POWER Project:**
   NASA Langley Research Center (LaRC) POWER Project, funded through the NASA Earth Science/Applied Science Program. [https://power.larc.nasa.gov](https://power.larc.nasa.gov)
2. **MERRA-2 Reanalysis:**
   Gelaro, R., et al. (2017). *The Modern-Era Retrospective Analysis for Research and Applications, Version 2 (MERRA-2)*. Journal of Climate, 30(14), 5419-5454. doi:10.1175/JCLI-D-16-0758.1.
3. **Mann-Kendall & Sen's Slope:**
   - Mann, H. B. (1945). *Nonparametric tests against trend*. Econometrica, 245-259.
   - Kendall, M. G. (1975). *Rank Correlation Methods*. Charles Griffin, London.
   - Sen, P. K. (1968). *Estimates of the regression coefficient based on Kendall's tau*. J. Amer. Statist. Assoc., 63(324), 1379-1389.
   - Hamed, K. H., & Rao, A. R. (1998). *A modified Mann-Kendall trend test for autocorrelated data*. Journal of Hydrology, 204(1-4), 182-196.
   - Benjamini, Y., & Hochberg, Y. (1995). *Controlling the false discovery rate: a practical and powerful approach to multiple testing*. J. R. Stat. Soc. Ser. B, 57(1), 289-300.
