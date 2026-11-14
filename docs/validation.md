# TerraTrend — Scientific Validation and Verification Report

**Challenge:** 2026 NASA Space Apps Challenge — *Be an Earth System Trend Detective*  
**Team:** CODEVERSE  
**Status:** Validated against Official NASA MERRA-2 and CERES Datasets  
**Evaluation Date:** November 2026  

---

## 1. Overview and Validation Objectives

TerraTrend answers the four essential NASA Earth-system questions:
1. **WHAT is changing?**
2. **WHERE is it changing?**
3. **HOW MUCH is it changing?**
4. **ARE the changes statistically significant?**

To ensure scientific defensibility for peer review and competition judging, all data pipelines, statistical calculations, and spatial aggregations were subjected to rigorous independent validation. Synthetic or fabricated test fixtures were strictly excluded from the production pipeline.

---

## 2. NASA Data Source Lineage and Protocol Validation

### A. Data Lineage and Acquisition Protocol
- **Primary API:** NASA POWER Monthly API (`https://power.larc.nasa.gov/api/temporal/monthly`)
- **Atmospheric Model:** NASA GMAO MERRA-2 (`tavgM_2d_slv_Nx` and `statM_2d_slv_Nx`)
- **Solar Irradiance:** NASA CERES SYN1deg assimilation product
- **Native Grid Spacing:** $0.5^\circ \text{ latitude} \times 0.625^\circ \text{ longitude}$ (approximately $50\text{ km} \times 50\text{ km}$)
- **Time Standard:** Local Solar Time (LST)
- **Fill-Value Protocol:** Missing or uncalculated values in NASA POWER are coded as `-999.0`. TerraTrend parses all responses through a strict fill-value filter (`|v - fill_value| < 1e-4` or `v <= -900.0`), rejecting invalid entries prior to statistical estimation.

### B. Regional Grid Boundary Conditions
The NASA POWER regional endpoint enforces a documented constraint:
> *Bounding boxes must span at least $2.0^\circ$ in both latitude and longitude.*

TerraTrend's ingestion engine validates domain boundaries. For the Tamil Nadu demonstration domain ($8.5^\circ\text{N} - 13.5^\circ\text{N}, 76.5^\circ\text{E} - 80.5^\circ\text{E}$), the API returned **66 contiguous spatial grid cells**, each corresponding to a native MERRA-2 atmospheric assimilation cell.

---

## 3. Independent Reproduction of Demonstration Results (1981–2023)

To ensure full reproducibility, the three demonstration cities in Tamil Nadu were analyzed over the 43-year observational baseline ($N = 43$ continuous annual means, 1981–2023).

### Reproducible Execution Command
```bash
python -c "
from app.services.nasa_power import nasa_service
from app.services.statistics import trend_engine

cities = [('Madurai', 9.9252, 78.1198), ('Chennai', 13.0827, 80.2707), ('Coimbatore', 11.0168, 76.9558)]
for name, lat, lon in cities:
    raw, hit = nasa_service.fetch_point_data('T2M', lat, lon, 1981, 2023)
    records = nasa_service.parse_point_series(raw, 'T2M', 'annual')
    pts, stats = trend_engine.analyze_timeseries(records, alpha=0.05)
    print(f'{name}: Sen={stats.sens_slope_per_decade:+.3f} C/dec, 95%CI=[{stats.sens_slope_ci_lower_per_decade:+.3f},{stats.sens_slope_ci_upper_per_decade:+.3f}], Z={stats.mk_z:+.2f}, p={stats.mk_p_value:.5f}, Sig={stats.is_statistically_significant}')
"
```

### Verified Benchmark Output Table

| Demonstration Location | Latitude / Longitude | Baseline Mean $\pm \text{SD}$ | Sen's Slope Rate | 95% Confidence Interval | OLS Linear Slope ($R^2$) | Mann-Kendall $Z$ | $p$-value | Significant at $\alpha=0.05$? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Madurai** | $9.9252^\circ\text{N}, 78.1198^\circ\text{E}$ | $27.098 \pm 0.539^\circ\text{C}$ | **$+0.170^\circ\text{C/dec}$** | $[+0.023, +0.313]$ | $+0.164^\circ\text{C/dec}$ ($R^2=0.146$) | $+2.20$ | **$p = 0.0279$** | **YES** (Statistically Significant) |
| **Chennai** | $13.0827^\circ\text{N}, 80.2707^\circ\text{E}$ | $27.859 \pm 0.261^\circ\text{C}$ | $+0.060^\circ\text{C/dec}$ | $[-0.004, +0.131]$ | $+0.059^\circ\text{C/dec}$ ($R^2=0.082$) | $+1.79$ | $p = 0.0734$ | **NO** (Borderline, $p \ge 0.05$) |
| **Coimbatore** | $11.0168^\circ\text{N}, 76.9558^\circ\text{E}$ | $24.466 \pm 0.408^\circ\text{C}$ | $+0.080^\circ\text{C/dec}$ | $[-0.026, +0.203]$ | $+0.079^\circ\text{C/dec}$ ($R^2=0.060$) | $+1.34$ | $p = 0.1802$ | **NO** (Not Significant, $p \ge 0.05$) |

### Scientific Interpretation of Findings
1. **Madurai exhibits statistically significant warming** over 1981–2023. The non-parametric Sen's median slope ($+0.170^\circ\text{C/decade}$) and OLS linear regression ($+0.164^\circ\text{C/decade}$) demonstrate strong agreement, proving the trend is not distorted by extreme isolated seasons. The 95% confidence interval $[+0.023, +0.313]$ excludes zero.
2. **Chennai exhibits positive warming ($+0.060^\circ\text{C/decade}$), but does not reach the standard 95% significance threshold** ($p = 0.0734$). The maritime boundary layer and coastal thermal inertia contribute to smaller decadal variance.
3. **Coimbatore exhibits an estimated slope of $+0.080^\circ\text{C/decade}$, but is not statistically significant** ($p = 0.1802$).
   - *Scientific Caution:* We do not assert Western Ghats orographic windward/leeward buffering as an established physical cause. Rather, orographic moderation and elevation lapse dynamics remain **unconfirmed working hypotheses**. At the $0.5^\circ$ resolution of MERRA-2, micro-topographic mountain pass effects cannot be resolved without fine-scale meso-scale modeling or dense in-situ station networks.

---

## 4. Regional Domain Grid Verification (66 Cells)

The regional domain covering Tamil Nadu ($8.5^\circ\text{N} - 13.5^\circ\text{N}, 76.875^\circ\text{E} - 80.0^\circ\text{E}$) was audited:
- **Total NASA Assimilation Cells:** 66
- **Data Completeness:** 100% (2,838 out of 2,838 cell-year records valid, 0 fill values)
- **Elevation Range:** $0.0\text{ m}$ (coastal) to $841.7\text{ m}$ (inland Western Ghats uplands)
- **Domain Mean Sen's Slope:** $+0.110^\circ\text{C/decade}$
- **Minimum Grid Cell Rate:** $+0.014^\circ\text{C/decade}$
- **Maximum Grid Cell Rate:** $+0.344^\circ\text{C/decade}$
- **Unadjusted Significant Cells ($\alpha = 0.05$):** 29 of 66 cells ($43.9\%$)
- **False Discovery Rate (FDR) Significant Cells ($q = 0.05$):** 24 of 66 cells ($36.4\%$)

### Benjamini-Hochberg FDR Assessment
When evaluating 66 simultaneous hypothesis tests across space, standard $\alpha=0.05$ testing carries a nominal expected false positive rate of $66 \times 0.05 = 3.3$ false rejections under the global null. Applying the Benjamini-Hochberg step-up procedure at $q = 0.05$ reduced the significant count from 29 to 24 cells. Five borderline cells with $0.032 < p < 0.049$ were appropriately identified as failing false discovery control, preventing spatial over-interpretation.

---

## 5. Statistical Formula Verification

### A. Tie-Correction in Mann-Kendall Variance
When identical annual averages occur, ties reduce the true variance of $S$. The engine implements the exact WMO tie-correction formula:
$$\text{Var}(S) = \frac{n(n-1)(2n+5) - \sum_{t} t(t-1)(2t+5)}{18}$$
Verified against known test vectors in `backend/tests/test_statistics.py`.

### B. Serial Correlation (Lag-1 Autocorrelation)
In climate records, multi-year persistence can inflate the rejection rate of Mann-Kendall. For all three demonstration cities, sample lag-1 autocorrelation was evaluated:
- Madurai: $r_1 = 0.189$ (Bartlett 95% critical limit: $\pm 1.96 / \sqrt{43} = \pm 0.299$) $\rightarrow$ Not significant.
- Chennai: $r_1 = 0.226$ ($|r_1| < 0.299$) $\rightarrow$ Not significant.
- Coimbatore: $r_1 = 0.212$ ($|r_1| < 0.299$) $\rightarrow$ Not significant.
Since $|r_1| < 0.299$, serial correlation does not inflate the test statistic, confirming that standard Mann-Kendall test results are statistically valid.

---

## 6. Known Limitations and Scientific Uncertainty

1. **Spatial Resolution:** MERRA-2 native grid resolution is $0.5^\circ \times 0.625^\circ$ ($\sim 50\text{ km}$). Sub-grid micro-climate features (such as urban heat islands or steep mountain valleys in the Western Ghats) are smoothed across the grid box.
2. **Atmospheric Assimilation Lineage:** MERRA-2 is an atmospheric reanalysis model assimilating satellite radiances, sounders, and conventional observations via the Goddard Earth Observing System (GEOS). Surface 2m temperatures are model-assimilated diagnostics, not direct thermometer readings from a single weather station.
3. **Precipitation Gauge Density:** While MERRA-2 precipitation is corrected using Climate Prediction Center (CPC) global gauge data, gauge density in mountainous terrain can introduce higher variance relative to flat coastal plains.
4. **Time Range Boundaries:** Observational coverage from NASA POWER is currently complete through 2023. Recent 2024 months are provisional and subject to NASA post-processing updates.

---

## 7. Automated Test Suite Execution

All 9 validation test cases executed via Pytest pass with zero errors:
```
backend/tests/test_nasa_integration.py::test_get_variables PASSED
backend/tests/test_nasa_integration.py::test_get_locations PASSED
backend/tests/test_nasa_integration.py::test_point_trend_real_nasa_query_madurai_significant PASSED
backend/tests/test_nasa_integration.py::test_point_trend_real_nasa_query_coimbatore PASSED
backend/tests/test_statistics.py::test_ols_and_mann_kendall_positive_trend PASSED
backend/tests/test_statistics.py::test_mann_kendall_no_trend PASSED
backend/tests/test_statistics.py::test_missing_data_diagnostics_and_fill_value PASSED
backend/tests/test_statistics.py::test_benjamini_hochberg_fdr PASSED
backend/tests/test_statistics.py::test_lag1_autocorrelation PASSED
```
