"use client";

import React from "react";
import { TrendStatistics, VariableMetadata } from "@/types";
import { Calculator, Info, HelpCircle } from "lucide-react";
import {
  formatSlope,
  formatConfidenceInterval,
  formatPValue,
} from "@/utils/formatters";

interface StatisticsTableProps {
  stats: TrendStatistics;
  meta: VariableMetadata;
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({ stats, meta }) => {
  const units = meta.units;
  const diag = stats.diagnostics;

  return (
    <section
      aria-label="Comprehensive Statistical Analysis Matrix"
      className="bg-obs-surface1 border border-obs-borderSubtle rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-obs-borderSubtle pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-cyan-400 shrink-0" />
          <h3 className="text-sm font-bold text-slate-100">
            Comprehensive Statistical Analysis Matrix
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-obs-canvas border border-obs-borderSubtle text-slate-400 self-start sm:self-auto">
          α = 0.05 Two-Tailed Test (WMO Standard)
        </span>
      </div>

      {/* Grid of Key Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        {/* Sen's Slope */}
        <div className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-xl">
          <span className="text-slate-400 font-medium block mb-1">
            Sen's Slope Rate
          </span>
          <div className="text-base font-bold font-mono tabular-nums text-emerald-400">
            {formatSlope(stats.sens_slope_per_decade, units, "decade")}
          </div>
          <span className="text-[10px] text-slate-400 font-mono tabular-nums block mt-1">
            {formatSlope(stats.sens_slope_per_year, units, "year")}
          </span>
        </div>

        {/* 95% Confidence Interval */}
        <div className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-xl">
          <span className="text-slate-400 font-medium block mb-1">
            Sen's 95% Confidence Interval
          </span>
          <div className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-200">
            {formatConfidenceInterval(
              stats.sens_slope_ci_lower_per_decade,
              stats.sens_slope_ci_upper_per_decade,
              units
            )}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Non-parametric Gilbert rank bounds
          </span>
        </div>

        {/* Mann-Kendall Z-score */}
        <div className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-xl">
          <span className="text-slate-400 font-medium block mb-1">
            Mann-Kendall Z-Statistic
          </span>
          <div className="text-base font-bold font-mono tabular-nums text-cyan-400">
            {stats.mk_z >= 0 ? `+${stats.mk_z.toFixed(2)}` : stats.mk_z.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 font-mono tabular-nums block mt-1">
            S = {stats.mk_score}, Var(S) = {stats.mk_variance.toFixed(1)}
          </span>
        </div>

        {/* Mann-Kendall p-value */}
        <div className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-xl">
          <span className="text-slate-400 font-medium block mb-1">
            Mann-Kendall p-value
          </span>
          <div
            className={`text-base font-bold font-mono tabular-nums ${
              stats.is_statistically_significant ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            {formatPValue(stats.mk_p_value)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {stats.is_statistically_significant ? "Reject H₀ (p < 0.05)" : "Fail to reject H₀ (p ≥ 0.05)"}
          </span>
        </div>

        {/* OLS Slope & R² */}
        <div className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-xl">
          <span className="text-slate-400 font-medium block mb-1">
            OLS Linear Fit (R²)
          </span>
          <div className="text-sm font-bold font-mono tabular-nums text-indigo-400">
            {formatSlope(stats.ols_slope_per_decade, units, "decade")}
          </div>
          <span className="text-[10px] text-slate-400 font-mono tabular-nums block mt-1">
            R² = {stats.ols_r_squared.toFixed(3)} (p = {formatPValue(stats.ols_p_value)})
          </span>
        </div>

        {/* Total Cumulative Shift */}
        <div className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-xl">
          <span className="text-slate-400 font-medium block mb-1">
            Total Net Change
          </span>
          <div className="text-sm font-bold font-mono tabular-nums text-slate-200">
            {stats.total_change_over_period >= 0 ? `+${stats.total_change_over_period.toFixed(2)}` : stats.total_change_over_period.toFixed(2)} {units}
          </div>
          <span className="text-[10px] text-slate-400 font-mono tabular-nums block mt-1">
            {stats.percentage_change_over_period !== null && stats.percentage_change_over_period !== undefined
              ? `${stats.percentage_change_over_period >= 0 ? `+${stats.percentage_change_over_period.toFixed(1)}` : stats.percentage_change_over_period.toFixed(1)}% baseline shift`
              : "Over entire record"}
          </span>
        </div>

        {/* Autocorrelation */}
        <div className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-xl">
          <span className="text-slate-400 font-medium block mb-1">
            Lag-1 Autocorrelation (r₁)
          </span>
          <div className="text-sm font-bold font-mono tabular-nums text-slate-200">
            {diag.lag1_autocorrelation >= 0 ? `+${diag.lag1_autocorrelation.toFixed(3)}` : diag.lag1_autocorrelation.toFixed(3)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {diag.autocorrelation_significant
              ? "Significant (Yue & Wang variance correction applied)"
              : "Not significant (|r₁| within white-noise limits)"}
          </span>
        </div>

        {/* Data Completeness */}
        <div className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-xl">
          <span className="text-slate-400 font-medium block mb-1">
            Data Completeness
          </span>
          <div className="text-sm font-bold font-mono tabular-nums text-emerald-400">
            {(100 - diag.missing_percentage).toFixed(1)}% Valid
          </div>
          <span className="text-[10px] text-slate-400 font-mono tabular-nums block mt-1">
            {diag.n_observations - diag.missing_count}/{diag.n_observations} points (0 fill values)
          </span>
        </div>
      </div>

      {/* Scientific Distinction Note: Statistical Significance vs Physical Magnitude */}
      <div className="bg-obs-canvas border border-obs-borderSubtle rounded-xl p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider">
            Scientific Method Note: Statistical Significance vs Environmental Magnitude
          </span>
          <p className="text-[11px] text-slate-400">
            <strong className="text-slate-300">Statistical Significance (p &lt; 0.05)</strong> evaluates whether a trend is reliably distinguishable from natural interannual climate noise. It does not measure physical severity. Conversely, <strong className="text-slate-300">Trend Magnitude (Sen's Slope)</strong> quantifies the physical rate of change per decade. Even an environmentally meaningful shift may not achieve statistical significance if year-to-year variability or sample variance is high.
          </p>
        </div>
      </div>
    </section>
  );
};
