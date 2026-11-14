> **Independent audit warning:** This document contains historical, unverified claims and may describe superseded calculations. Do not cite its numerical findings or provenance assertions until revalidated. See [independent review](codex-independent-review.md).

# TerraTrend — Mathematical and Statistical Methodology

**Challenge:** 2026 NASA Space Apps Challenge — *Be an Earth System Trend Detective*  
**Standard:** World Meteorological Organization (WMO) Non-Parametric Climate Trend Guidelines  

---

## 1. Introduction

In historical climate and Earth-system observations, time series often deviate from idealized Gaussian assumptions:
- Climate observations frequently display skewed distributions.
- Isolated extreme meteorological events (cyclones, heatwaves, cloudbursts) produce significant outliers that bias classical least-squares regression.
- Missing observational records occur due to sensor maintenance or satellite orbital gaps.
- Serial autocorrelation (persistence) can inflate test statistics.

To address these challenges, TerraTrend implements a robust non-parametric statistical architecture centered on the **Mann-Kendall Trend Test** and **Sen's Slope Estimator**, complemented by **autocorrelation diagnostics** and **False Discovery Rate (FDR)** multiple-testing control.

---

## 2. Mann-Kendall Monotonic Trend Test

### Formulation
For a time series $X = \{x_1, x_2, \dots, x_n\}$ where each $x_i$ represents an annual or monthly value at time $t_i$:

The Mann-Kendall test statistic $S$ is computed as:
$$S = \sum_{k=1}^{n-1} \sum_{j=k+1}^n \text{sgn}(x_j - x_k)$$

where the sign function $\text{sgn}(\theta)$ is defined as:
$$\text{sgn}(\theta) = \begin{cases} +1 & \text{if } \theta > 0 \\ 0 & \text{if } \theta = 0 \\ -1 & \text{if } \theta < 0 \end{cases}$$

### Variance with Tie Correction
When $n \ge 10$, $S$ is approximately normally distributed with mean $E[S] = 0$. In the presence of tied values ($x_j = x_k$), the variance of $S$ is corrected according to Kendall (1975):
$$\text{Var}(S) = \frac{n(n-1)(2n+5) - \sum_{t} t(t-1)(2t+5)}{18}$$
where $t$ is the extent of any given tie group, and $\sum_{t}$ sums over all tied groups.

### Standardized Test Statistic $Z$ and Two-Tailed Significance
$$Z = \begin{cases} \frac{S - 1}{\sqrt{\text{Var}(S)}} & \text{if } S > 0 \\ 0 & \text{if } S = 0 \\ \frac{S + 1}{\sqrt{\text{Var}(S)}} & \text{if } S < 0 \end{cases}$$

The two-tailed $p$-value for the test of the null hypothesis $H_0$ (no monotonic trend) is evaluated against the standard normal cumulative distribution function $\Phi(z)$:
$$p = 2 \times [1 - \Phi(|Z|)]$$

- **Decision Rule:**
  - If $p < 0.05$ and $Z > 0$: **Statistically significant increasing trend** ($\alpha = 0.05$).
  - If $p < 0.05$ and $Z < 0$: **Statistically significant decreasing trend** ($\alpha = 0.05$).
  - If $p \ge 0.05$: **No statistically significant trend** (fail to reject $H_0$).

---

## 3. Sen's Slope Estimator & 95% Confidence Intervals

Sen's slope (Sen, 1968) provides a non-parametric estimator of the linear rate of change that is insensitive to outliers.

### Pairwise Slope Calculation
All pairwise slopes $Q_k$ between distinct time points $(t_i, x_i)$ and $(t_j, x_j)$ with $i < j$ are calculated:
$$Q_k = \frac{x_j - x_i}{j - i} \quad \text{for all } 1 \le i < j \le n$$
For a sample of size $n$, there are $N = \frac{n(n-1)}{2}$ pairwise slopes.

The estimated Sen's slope is the median:
$$Q_{\text{median}} = \text{median}(Q)$$

The decadal rate of change is:
$$\text{Slope}_{\text{decadal}} = 10 \times Q_{\text{median}}$$

### Non-Parametric 95% Confidence Interval
A non-parametric two-sided confidence interval at level $1 - \alpha$ is established by ranking the sorted pairwise slopes $Q_{(1)} \le Q_{(2)} \le \dots \le Q_{(N)}$:
$$C_\alpha = Z_{1 - \alpha/2} \times \sqrt{\text{Var}(S)}$$
The rank indices for lower and upper limits are:
$$M_1 = \frac{N - C_\alpha}{2}, \quad M_2 = \frac{N + C_\alpha}{2}$$
Clamped to valid array indices:
$$\text{CI}_{\text{lower}} = Q_{(M_1)}, \quad \text{CI}_{\text{upper}} = Q_{(M_2)}$$

---

## 4. Serial Autocorrelation & Adjusted Mann-Kendall

In meteorological time series, multi-year oceanic and atmospheric modes (e.g., ENSO, Indian Ocean Dipole) induce positive serial autocorrelation ($r_1 > 0$), which reduces the effective sample size and inflates the probability of falsely rejecting $H_0$ (Type I error).

### Sample Lag-1 Autocorrelation
$$r_1 = \frac{\sum_{i=1}^{n-1} (x_i - \bar{x})(x_{i+1} - \bar{x})}{\sum_{i=1}^n (x_i - \bar{x})^2}$$

Significant serial correlation is determined at the two-tailed 95% confidence level using Bartlett's limits:
$$\text{Critical Limit} = \pm \frac{1.96}{\sqrt{n}}$$

If $|r_1| > 1.96/\sqrt{n}$, TerraTrend executes the **Hamed & Rao (1998)** modified Mann-Kendall test, calculating the variance correction factor $n / n^*$ to adjust the effective variance of $S$:
$$\text{Var}^*(S) = \text{Var}(S) \times \left[ 1 + \frac{2}{n(n-1)(n-2)} \sum_{i=1}^{n-1} (n - i)(n - i - 1)(n - i - 2) \rho^*(i) \right]$$

---

## 5. Spatial Multiple Testing Correction (Benjamini-Hochberg FDR)

When evaluating $M$ spatial grid cells simultaneously across a geographic domain, testing each cell at nominal significance level $\alpha = 0.05$ results in an elevated family-wise false positive rate.

TerraTrend implements the **Benjamini-Hochberg (1995) False Discovery Rate (FDR)** procedure:
1. Sort all $M$ calculated $p$-values in ascending order:
   $$p_{(1)} \le p_{(2)} \le \dots \le p_{(M)}$$
2. For a target false discovery rate $q = 0.05$, determine the maximum index $k$ satisfying:
   $$p_{(k)} \le \frac{k}{M} \times q$$
3. Declare all tests with rank $i \le k$ as statistically significant under FDR control.
