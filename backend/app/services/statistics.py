"""
Scientific Statistical Engine for Earth System Trend Discovery.
Implements:
1. Ordinary Least Squares (OLS) Linear Regression
2. Mann-Kendall Non-Parametric Trend Test (Standard & Autocorrelation-Adjusted)
3. Sen's Slope Estimator with Non-Parametric 95% Confidence Intervals
4. Time Series Diagnostics, Baseline Anomalies & Moving Averages
5. Benjamini-Hochberg False Discovery Rate (FDR) Multiple Testing Correction
"""
import math
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
import pandas as pd
from scipy import stats
import pymannkendall as pmk

from app.models.schemas import (
    TimeSeriesPoint,
    StatisticalDiagnostics,
    TrendStatistics
)

class TrendAnalysisEngine:
    @staticmethod
    def calculate_lag1_autocorrelation(series: np.ndarray) -> Tuple[float, bool]:
        """
        Calculates sample lag-1 autocorrelation (r1) and evaluates significance
        against the two-tailed 95% confidence bounds: +/- 1.96 / sqrt(N).
        """
        n = len(series)
        if n < 4:
            return 0.0, False
        mean = np.mean(series)
        var = np.var(series)
        if var == 0:
            return 0.0, False
        
        diff = series - mean
        r1 = np.sum(diff[:-1] * diff[1:]) / (var * (n - 1))
        r1 = float(np.clip(r1, -1.0, 1.0))
        critical_value = 1.96 / math.sqrt(n)
        is_significant = abs(r1) > critical_value
        return r1, is_significant

    @classmethod
    def analyze_timeseries(
        cls,
        raw_records: List[Dict[str, Any]],
        alpha: float = 0.05
    ) -> Tuple[List[TimeSeriesPoint], TrendStatistics]:
        """
        Executes complete scientific trend analysis pipeline on a time series.
        """
        if not raw_records:
            raise ValueError("Input time series cannot be empty.")

        df = pd.DataFrame(raw_records)
        n_total = len(df)
        
        # Diagnostics
        valid_df = df.dropna(subset=["value"]).copy()
        n_valid = len(valid_df)
        missing_count = n_total - n_valid
        missing_pct = round((missing_count / n_total) * 100.0, 2)

        if n_valid < 5:
            raise ValueError(f"Insufficient valid data points ({n_valid}) for statistical trend analysis. Minimum required is 5.")

        values = valid_df["value"].to_numpy(dtype=float)
        years = valid_df["year"].to_numpy(dtype=float)
        min_year = int(np.min(years))
        max_year = int(np.max(years))
        span_years = max_year - min_year + 1

        baseline_mean = float(np.mean(values))
        baseline_std = float(np.std(values, ddof=1)) if n_valid > 1 else 0.0
        min_val = float(np.min(values))
        max_val = float(np.max(values))

        # Lag-1 Autocorrelation
        r1, r1_sig = cls.calculate_lag1_autocorrelation(values)

        # 1. OLS Linear Regression
        # Normalize x to 0..N-1 for numerical precision during linregress
        x_norm = years - min_year
        ols_res = stats.linregress(x_norm, values)
        ols_slope_yr = float(ols_res.slope)
        ols_intercept = float(ols_res.intercept)
        ols_r_sq = float(ols_res.rvalue ** 2)
        ols_p_val = float(ols_res.pvalue)
        ols_std_err = float(ols_res.stderr)
        ols_slope_dec = ols_slope_yr * 10.0

        # 2. Non-Parametric Mann-Kendall Test
        # We run the standard test
        mk_res = pmk.original_test(values, alpha=alpha)
        mk_trend = str(mk_res.trend)
        mk_p_val = float(mk_res.p)
        mk_z = float(mk_res.z)
        mk_tau = float(mk_res.Tau)
        mk_score = float(mk_res.s)
        mk_var = float(mk_res.var_s)

        # 3. Sen's Slope Estimator
        # Calculate Sen's slope and 95% confidence intervals
        sens_slope_yr = float(mk_res.slope)
        sens_slope_dec = sens_slope_yr * 10.0
        
        # Calculate Sen's slope confidence intervals if supported
        # In pymannkendall, mk_res has slope, but let's calculate exact non-parametric CI:
        ci_lower_yr, ci_upper_yr = cls._calculate_sens_slope_ci(values, mk_var, alpha=alpha)
        sens_ci_lower_dec = ci_lower_yr * 10.0
        sens_ci_upper_dec = ci_upper_yr * 10.0

        # 4. Modified Mann-Kendall (if significant serial autocorrelation detected)
        modified_mk_p = None
        if r1_sig and r1 > 0:
            try:
                mod_res = pmk.hamed_rao_modification_test(values, alpha=alpha)
                modified_mk_p = float(mod_res.p)
            except Exception:
                # Fallback to Yue and Wang if Hamed & Rao encounters singularity
                try:
                    mod_res_yw = pmk.yue_wang_modification_test(values, alpha=alpha)
                    modified_mk_p = float(mod_res_yw.p)
                except Exception:
                    modified_mk_p = mk_p_val

        # Primary significance is determined by Mann-Kendall test p-value (or modified if autocorrelation is strong)
        effective_p = modified_mk_p if (modified_mk_p is not None and r1_sig) else mk_p_val
        is_sig = effective_p < alpha

        if effective_p < 0.001:
            sig_label = "p < 0.001 (Extremely Significant)"
        elif effective_p < 0.01:
            sig_label = "p < 0.01 (Highly Significant)"
        elif effective_p < 0.05:
            sig_label = "p < 0.05 (Statistically Significant)"
        else:
            sig_label = f"Not Significant (p = {effective_p:.3f} >= 0.05)"

        total_change = sens_slope_yr * span_years
        pct_change = (total_change / abs(baseline_mean) * 100.0) if abs(baseline_mean) > 1e-6 else None

        diagnostics = StatisticalDiagnostics(
            n_observations=n_total,
            missing_count=missing_count,
            missing_percentage=missing_pct,
            baseline_mean=round(baseline_mean, 3),
            baseline_std=round(baseline_std, 3),
            min_value=round(min_val, 3),
            max_value=round(max_val, 3),
            lag1_autocorrelation=round(r1, 3),
            autocorrelation_significant=r1_sig
        )

        trend_stats = TrendStatistics(
            ols_slope_per_year=round(ols_slope_yr, 4),
            ols_slope_per_decade=round(ols_slope_dec, 3),
            ols_intercept=round(ols_intercept, 3),
            ols_r_squared=round(ols_r_sq, 3),
            ols_p_value=round(ols_p_val, 5),
            ols_std_err=round(ols_std_err, 4),
            sens_slope_per_year=round(sens_slope_yr, 4),
            sens_slope_per_decade=round(sens_slope_dec, 3),
            sens_slope_ci_lower_per_decade=round(sens_ci_lower_dec, 3),
            sens_slope_ci_upper_per_decade=round(sens_ci_upper_dec, 3),
            mk_score=round(mk_score, 1),
            mk_variance=round(mk_var, 1),
            mk_tau=round(mk_tau, 3),
            mk_z=round(mk_z, 3),
            mk_p_value=round(mk_p_val, 5),
            mk_trend=mk_trend,
            is_statistically_significant=is_sig,
            significance_label=sig_label,
            modified_mk_p_value=round(modified_mk_p, 5) if modified_mk_p is not None else None,
            total_change_over_period=round(total_change, 3),
            percentage_change_over_period=round(pct_change, 2) if pct_change is not None else None,
            diagnostics=diagnostics
        )

        # Build output TimeSeriesPoints with anomalies, moving average, and trend lines
        # Determine 5-year rolling average
        df["rolling_5yr"] = df["value"].rolling(window=5, center=True, min_periods=3).mean()
        
        # Calculate median intercept for Sen's trend line: median(y_i - slope * x_i)
        sen_intercept = float(np.median(values - sens_slope_yr * (years - min_year)))

        points: List[TimeSeriesPoint] = []
        for idx, row in df.iterrows():
            val = row["value"]
            yr = int(row["year"])
            x_step = yr - min_year
            
            anomaly = round(val - baseline_mean, 3) if pd.notnull(val) else None
            roll_val = round(float(row["rolling_5yr"]), 3) if pd.notnull(row["rolling_5yr"]) else None
            ols_line = round(ols_intercept + ols_slope_yr * x_step, 3)
            sen_line = round(sen_intercept + sens_slope_yr * x_step, 3)

            points.append(TimeSeriesPoint(
                date=str(row["date"]),
                year=yr,
                month=int(row["month"]) if pd.notnull(row.get("month")) else None,
                value=round(float(val), 3) if pd.notnull(val) else None,
                baseline_anomaly=anomaly,
                rolling_mean_5yr=roll_val,
                ols_trend_value=ols_line,
                sens_trend_value=sen_line
            ))

        return points, trend_stats

    @staticmethod
    def _calculate_sens_slope_ci(
        values: np.ndarray,
        var_s: float,
        alpha: float = 0.05
    ) -> Tuple[float, float]:
        """
        Computes non-parametric two-sided 100*(1-alpha)% confidence interval
        for Sen's slope estimator using the rank method.
        """
        n = len(values)
        slopes = []
        for i in range(n - 1):
            for j in range(i + 1, n):
                slopes.append((values[j] - values[i]) / (j - i))
        
        slopes.sort()
        n_slopes = len(slopes)
        if n_slopes == 0:
            return 0.0, 0.0

        # Normal critical value for 1 - alpha/2
        z_crit = stats.norm.ppf(1.0 - alpha / 2.0)
        c_alpha = z_crit * math.sqrt(var_s)
        
        m1 = int(round((n_slopes - c_alpha) / 2.0))
        m2 = int(round((n_slopes + c_alpha) / 2.0))

        # Clamp ranks to valid array indices
        rank_lower = max(0, min(n_slopes - 1, m1))
        rank_upper = max(0, min(n_slopes - 1, m2))

        lower_ci = float(slopes[rank_lower])
        upper_ci = float(slopes[rank_upper])
        return lower_ci, upper_ci

    @staticmethod
    def apply_benjamini_hochberg(p_values: List[float], q: float = 0.05) -> List[bool]:
        """
        Applies Benjamini-Hochberg False Discovery Rate (FDR) procedure
        to control false positive rates when evaluating multiple spatial grid cells.
        Returns a list of booleans indicating FDR significance for each test.
        """
        m = len(p_values)
        if m == 0:
            return []
        
        sorted_indices = np.argsort(p_values)
        sorted_p = np.array(p_values)[sorted_indices]
        
        # Critical value threshold for each rank k (1-indexed)
        ranks = np.arange(1, m + 1)
        thresholds = (ranks / m) * q
        
        # Find largest k where p_(k) <= threshold
        significant_mask = sorted_p <= thresholds
        if not np.any(significant_mask):
            return [False] * m
        
        max_k_idx = np.max(np.where(significant_mask)[0])
        
        # Any hypothesis with sorted rank <= max_k_idx is significant
        fdr_results = np.zeros(m, dtype=bool)
        fdr_results[sorted_indices[:max_k_idx + 1]] = True
        return fdr_results.tolist()

trend_engine = TrendAnalysisEngine()
