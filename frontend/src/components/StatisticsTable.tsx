import React from "react";
import { TrendStatistics, VariableMetadata } from "@/types";
import { Binary, Check, X, Calculator, AlertCircle } from "lucide-react";

interface StatisticsTableProps {
  stats: TrendStatistics;
  meta: VariableMetadata;
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({ stats, meta }) => {
  const units = meta.units;
  const diag = stats.diagnostics;

  return (
    <div className="bg-[#0b1320] border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Comprehensive Statistical Analysis Matrix
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
          α = 0.05 Two-Tailed Test
        </span>
      </div>

      {/* Grid of Key Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        {/* Sen's Slope */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 font-medium block mb-1">
            Sen's Slope Rate
          </span>
          <div className="text-base font-bold font-mono text-emerald-400">
            {stats.sens_slope_per_decade >= 0 ? `+${stats.sens_slope_per_decade}` : stats.sens_slope_per_decade}
            <span className="text-xs text-slate-400 font-normal ml-1">
              {units}/decade
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {stats.sens_slope_per_year >= 0 ? `+${stats.sens_slope_per_year}` : stats.sens_slope_per_year} {units}/yr
          </span>
        </div>

        {/* 95% Confidence Interval */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 font-medium block mb-1">
            Sen's 95% Confidence Interval
          </span>
          <div className="text-sm font-bold font-mono text-slate-200">
            [{stats.sens_slope_ci_lower_per_decade >= 0 ? `+${stats.sens_slope_ci_lower_per_decade}` : stats.sens_slope_ci_lower_per_decade}, {stats.sens_slope_ci_upper_per_decade >= 0 ? `+${stats.sens_slope_ci_upper_per_decade}` : stats.sens_slope_ci_upper_per_decade}]
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Non-parametric rank bounds
          </span>
        </div>

        {/* Mann-Kendall Z-score */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 font-medium block mb-1">
            Mann-Kendall Z-Statistic
          </span>
          <div className="text-base font-bold font-mono text-cyan-400">
            {stats.mk_z >= 0 ? `+${stats.mk_z}` : stats.mk_z}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            S = {stats.mk_score}, Var(S) = {stats.mk_variance}
          </span>
        </div>

        {/* Mann-Kendall p-value */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 font-medium block mb-1">
            Mann-Kendall p-value
          </span>
          <div className={`text-base font-bold font-mono ${stats.is_statistically_significant ? "text-emerald-400" : "text-slate-400"}`}>
            {stats.mk_p_value < 0.0001 ? "< 0.0001" : stats.mk_p_value}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {stats.is_statistically_significant ? "Reject H₀ (p < 0.05)" : "Fail to reject H₀"}
          </span>
        </div>

        {/* OLS Slope & R² */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 font-medium block mb-1">
            OLS Linear Fit (R²)
          </span>
          <div className="text-sm font-bold font-mono text-indigo-400">
            {stats.ols_slope_per_decade >= 0 ? `+${stats.ols_slope_per_decade}` : stats.ols_slope_per_decade} {units}/dec
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            R² = {stats.ols_r_squared} (p = {stats.ols_p_value})
          </span>
        </div>

        {/* Total Cumulative Shift */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 font-medium block mb-1">
            Total Net Change
          </span>
          <div className="text-sm font-bold font-mono text-slate-200">
            {stats.total_change_over_period >= 0 ? `+${stats.total_change_over_period}` : stats.total_change_over_period} {units}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {stats.percentage_change_over_period !== null && stats.percentage_change_over_period !== undefined ? `${stats.percentage_change_over_period >= 0 ? `+${stats.percentage_change_over_period}` : stats.percentage_change_over_period}% baseline shift` : "Over entire period"}
          </span>
        </div>

        {/* Autocorrelation */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 font-medium block mb-1">
            Lag-1 Autocorrelation (r₁)
          </span>
          <div className="text-sm font-bold font-mono text-slate-200">
            {diag.lag1_autocorrelation}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {diag.autocorrelation_significant ? "Significant (Adjusted MK)" : "Not significant (|r₁| < threshold)"}
          </span>
        </div>

        {/* Data Completeness */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg">
          <span className="text-slate-400 font-medium block mb-1">
            Data Completeness
          </span>
          <div className="text-sm font-bold font-mono text-emerald-400">
            {(100 - diag.missing_percentage).toFixed(1)}% Valid
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {diag.n_observations - diag.missing_count}/{diag.n_observations} points (0 fill values)
          </span>
        </div>
      </div>
    </div>
  );
};
