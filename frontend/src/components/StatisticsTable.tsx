"use client";

import React, { useState } from "react";
import { TrendStatistics, VariableMetadata } from "@/types";
import { Calculator, Info, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  formatSlope,
  formatConfidenceInterval,
  formatPValue,
} from "@/utils/formatters";
import { AppAudienceMode, AppTheme } from "@/constants/design-tokens";

interface StatisticsTableProps {
  stats: TrendStatistics;
  meta: VariableMetadata;
  theme?: AppTheme;
  audienceMode?: AppAudienceMode;
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({
  stats,
  meta,
  theme = "editorial",
  audienceMode = "explore",
}) => {
  const [showAdvanced, setShowAdvanced] = useState(audienceMode === "research");
  const isEditorial = theme === "editorial";
  const isExplore = audienceMode === "explore";
  const units = meta.units;
  const diag = stats.diagnostics;

  return (
    <section
      aria-label="Comprehensive Statistical Analysis Matrix"
      className={`rounded-2xl p-4 sm:p-5 shadow-sm border transition-colors space-y-4 ${
        isEditorial
          ? "bg-white border-[#e6e4df] text-stone-900 shadow-stone-200/50"
          : "bg-obs-surface1 border-obs-borderSubtle text-slate-100 shadow-black/40"
      }`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-2 ${
        isEditorial ? "border-[#eceae5]" : "border-obs-borderSubtle"
      }`}>
        <div className="flex items-center gap-2">
          <Calculator className={`w-4 h-4 shrink-0 ${isEditorial ? "text-blue-700" : "text-cyan-400"}`} />
          <h3 className={`text-sm font-bold ${isEditorial ? "text-stone-900" : "text-slate-100"}`}>
            {isExplore ? "Statistical Evidence & Trend Quantification" : "Comprehensive Statistical Analysis Matrix"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono px-2.5 py-1 rounded border self-start sm:self-auto ${
            isEditorial ? "bg-[#f5f4ef] border-[#dedad2] text-stone-600" : "bg-obs-canvas border-obs-borderSubtle text-slate-400"
          }`}>
            α = 0.05 Two-Tailed Test (WMO Climatological Standard)
          </span>
          {isExplore && (
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                isEditorial
                  ? "bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300"
                  : "bg-obs-surface2 hover:bg-slate-800 text-slate-200 border-obs-borderSubtle"
              }`}
            >
              <span>{showAdvanced ? "Hide Full Matrix" : "Show Full Matrix"}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Grid of Key Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        {/* Sen's Slope */}
        <div className={`border p-3 rounded-xl ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
        }`}>
          <span className={`font-medium block mb-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
            Sen&apos;s Slope Rate
          </span>
          <div className="text-base font-bold font-mono tabular-nums text-emerald-700">
            {formatSlope(stats.sens_slope_per_decade, units, "decade")}
          </div>
          <span className={`text-[10px] font-mono tabular-nums block mt-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
            {formatSlope(stats.sens_slope_per_year, units, "year")}
          </span>
        </div>

        {/* 95% Confidence Interval */}
        <div className={`border p-3 rounded-xl ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
        }`}>
          <span className={`font-medium block mb-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
            Sen&apos;s 95% Confidence Interval
          </span>
          <div className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${isEditorial ? "text-stone-900" : "text-slate-200"}`}>
            {formatConfidenceInterval(
              stats.sens_slope_ci_lower_per_decade,
              stats.sens_slope_ci_upper_per_decade,
              units
            )}
          </div>
          <span className={`text-[10px] block mt-1 ${isEditorial ? "text-stone-500" : "text-slate-500"}`}>
            Non-parametric Gilbert rank bounds
          </span>
        </div>

        {/* Mann-Kendall Z-score */}
        <div className={`border p-3 rounded-xl ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
        }`}>
          <span className={`font-medium block mb-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
            Mann-Kendall Z-Statistic
          </span>
          <div className={`text-base font-bold font-mono tabular-nums ${isEditorial ? "text-blue-800" : "text-cyan-400"}`}>
            {stats.mk_z >= 0 ? `+${stats.mk_z.toFixed(2)}` : stats.mk_z.toFixed(2)}
          </div>
          <span className={`text-[10px] font-mono tabular-nums block mt-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
            S = {stats.mk_score}, Var(S) = {stats.mk_variance.toFixed(1)}
          </span>
        </div>

        {/* Mann-Kendall p-value */}
        <div className={`border p-3 rounded-xl ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
        }`}>
          <span className={`font-medium block mb-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
            Mann-Kendall p-value
          </span>
          <div
            className={`text-base font-bold font-mono tabular-nums ${
              stats.is_statistically_significant
                ? "text-emerald-700"
                : isEditorial ? "text-stone-600" : "text-slate-400"
            }`}
          >
            {formatPValue(stats.mk_p_value)}
          </div>
          <span className={`text-[10px] block mt-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
            {stats.is_statistically_significant ? "Reject H₀ (p < 0.05)" : "Fail to reject H₀ (p ≥ 0.05)"}
          </span>
        </div>

        {/* Show remaining metrics if not hidden */}
        {(!isExplore || showAdvanced) && (
          <>
            {/* OLS Slope & R² */}
            <div className={`border p-3 rounded-xl ${
              isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
            }`}>
              <span className={`font-medium block mb-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                OLS Linear Fit (R²)
              </span>
              <div className="text-sm font-bold font-mono tabular-nums text-indigo-700">
                {formatSlope(stats.ols_slope_per_decade, units, "decade")}
              </div>
              <span className={`text-[10px] font-mono tabular-nums block mt-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                R² = {stats.ols_r_squared.toFixed(3)} (p = {formatPValue(stats.ols_p_value)})
              </span>
            </div>

            {/* Total Cumulative Shift */}
            <div className={`border p-3 rounded-xl ${
              isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
            }`}>
              <span className={`font-medium block mb-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                Total Net Change
              </span>
              <div className={`text-sm font-bold font-mono tabular-nums ${isEditorial ? "text-stone-900" : "text-slate-200"}`}>
                {stats.total_change_over_period >= 0 ? `+${stats.total_change_over_period.toFixed(2)}` : stats.total_change_over_period.toFixed(2)} {units}
              </div>
              <span className={`text-[10px] font-mono tabular-nums block mt-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                {stats.percentage_change_over_period !== null && stats.percentage_change_over_period !== undefined
                  ? `${stats.percentage_change_over_period >= 0 ? `+${stats.percentage_change_over_period.toFixed(1)}` : stats.percentage_change_over_period.toFixed(1)}% baseline shift`
                  : "Over entire record"}
              </span>
            </div>

            {/* Autocorrelation */}
            <div className={`border p-3 rounded-xl ${
              isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
            }`}>
              <span className={`font-medium block mb-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                Lag-1 Autocorrelation (r₁)
              </span>
              <div className={`text-sm font-bold font-mono tabular-nums ${isEditorial ? "text-stone-900" : "text-slate-200"}`}>
                {diag.lag1_autocorrelation >= 0 ? `+${diag.lag1_autocorrelation.toFixed(3)}` : diag.lag1_autocorrelation.toFixed(3)}
              </div>
              <span className={`text-[10px] block mt-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                {diag.autocorrelation_significant
                  ? "Significant (Yue & Wang variance correction applied)"
                  : "Not significant (|r₁| within white-noise limits)"}
              </span>
            </div>

            {/* Data Completeness */}
            <div className={`border p-3 rounded-xl ${
              isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
            }`}>
              <span className={`font-medium block mb-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                Data Completeness
              </span>
              <div className="text-sm font-bold font-mono tabular-nums text-emerald-700">
                {(100 - diag.missing_percentage).toFixed(1)}% Valid
              </div>
              <span className={`text-[10px] font-mono tabular-nums block mt-1 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                {diag.n_observations - diag.missing_count}/{diag.n_observations} points (0 fill values)
              </span>
            </div>
          </>
        )}
      </div>

      {/* Scientific Distinction Note: Statistical Significance vs Physical Magnitude */}
      <div className={`border rounded-xl p-3.5 text-xs flex items-start gap-2.5 ${
        isEditorial ? "bg-[#f5f4ef] border-[#dedad2] text-stone-700" : "bg-obs-canvas border-obs-borderSubtle text-slate-300"
      }`}>
        <Info className={`w-4 h-4 shrink-0 mt-0.5 ${isEditorial ? "text-blue-700" : "text-cyan-400"}`} />
        <div className="space-y-1 leading-relaxed">
          <span className={`font-semibold block text-[11px] uppercase tracking-wider ${isEditorial ? "text-stone-900" : "text-slate-200"}`}>
            Scientific Method Note: Statistical Significance vs Environmental Magnitude
          </span>
          <p className={`text-[11px] ${isEditorial ? "text-stone-600" : "text-slate-400"}`}>
            <strong className={isEditorial ? "text-stone-900" : "text-slate-300"}>Statistical Significance (p &lt; 0.05)</strong> evaluates whether a trend is reliably distinguishable from natural interannual climate noise. It does not measure physical severity. Conversely, <strong className={isEditorial ? "text-stone-900" : "text-slate-300"}>Trend Magnitude (Sen&apos;s Slope)</strong> quantifies the physical rate of change per decade. Even an environmentally meaningful shift may not achieve statistical significance if year-to-year variability or sample variance is high.
          </p>
        </div>
      </div>
    </section>
  );
};
