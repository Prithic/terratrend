"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Copy, Check, FileText } from "lucide-react";
import { PointTrendResponse, RegionalTrendResponse } from "@/types";
import { formatSlope, formatConfidenceInterval, formatPValue } from "@/utils/formatters";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pointData?: PointTrendResponse | null;
  regionalData?: RegionalTrendResponse | null;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  pointData,
  regionalData,
}) => {
  const [copied, setCopied] = useState(false);

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    if (!pointData) return;

    const headers = [
      "Date",
      "Year",
      "Month",
      `Observed_${pointData.variable_metadata.identifier}_(${pointData.variable_metadata.units})`,
      "Baseline_Anomaly",
      "Rolling_Mean_5Yr",
      "Sens_Trend_Value",
      "OLS_Fit_Value",
    ];

    const rows = pointData.timeseries.map((pt) => [
      pt.date,
      pt.year,
      pt.month ?? "",
      pt.value ?? "",
      pt.baseline_anomaly ?? "",
      pt.rolling_mean_5yr ?? "",
      pt.sens_trend_value ?? "",
      pt.ols_trend_value ?? "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `TerraTrend_${pointData.variable_metadata.identifier}_${pointData.location.name.replace(/\s+/g, "_")}_${pointData.period.start_year}_${pointData.period.end_year}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateMarkdownReport = () => {
    if (!pointData) return "";
    const p = pointData;
    const s = p.statistics;
    const e = p.scientific_explanation;

    const fmtNum = (num: number, digits = 3) => (num > 0 ? `+${num.toFixed(digits)}` : num.toFixed(digits));

    return `# TERRATREND | NASA Earth System Trend Intelligence Report
Generated: ${p.retrieval_timestamp}
Challenge: NASA Space Apps 2026 - Be an Earth System Trend Detective

## 1. Executive Summary & The 4 Essential NASA Questions

### 1. WHAT is changing?
${e.question_what}

### 2. WHERE is it changing?
${e.question_where}

### 3. HOW MUCH is it changing?
${e.question_how_much}

### 4. ARE the changes statistically significant?
${e.question_are_changes_significant}

---

## 2. Statistical Analysis Matrix
- **Observed Variable:** ${p.variable_metadata.name} (${p.variable_metadata.identifier})
- **Units:** ${p.variable_metadata.units}
- **Observational Period:** ${p.period.start_year} – ${p.period.end_year} (${s.diagnostics.n_observations} observations)
- **Baseline Mean:** ${s.diagnostics.baseline_mean.toFixed(2)} ± ${s.diagnostics.baseline_std.toFixed(2)} ${p.variable_metadata.units}
- **Sen's Slope Rate:** ${formatSlope(s.sens_slope_per_decade, p.variable_metadata.units, "decade")} (${formatSlope(s.sens_slope_per_year, p.variable_metadata.units, "year")})
- **Sen's 95% Confidence Interval:** ${formatConfidenceInterval(s.sens_slope_ci_lower_per_decade, s.sens_slope_ci_upper_per_decade, p.variable_metadata.units)}
- **Mann-Kendall Test:** Z = ${fmtNum(s.mk_z, 2)}, S = ${s.mk_score}, p-value = ${formatPValue(s.mk_p_value)}
- **Null Hypothesis (H₀: No Trend):** ${s.is_statistically_significant ? "REJECTED (p < 0.05)" : "FAIL TO REJECT (p >= 0.05)"}
- **Ordinary Least Squares (OLS):** Slope = ${formatSlope(s.ols_slope_per_decade, p.variable_metadata.units, "decade")}, R² = ${s.ols_r_squared.toFixed(3)}
- **Lag-1 Autocorrelation:** r₁ = ${s.diagnostics.lag1_autocorrelation.toFixed(3)} (Significant: ${s.diagnostics.autocorrelation_significant})
- **Cumulative Net Shift:** ${fmtNum(s.total_change_over_period, 2)} ${p.variable_metadata.units}

---

## 3. Climatological Synthesis
${e.scientific_synthesis}

## 4. Scientific Limitations & Data Lineage
${e.scientific_limitations.map((l) => `- ${l}`).join("\n")}

**Source Citation:**
${e.citation}
`;
  };

  const handleCopyMarkdown = () => {
    const text = generateMarkdownReport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-obs-surface1 border border-obs-borderSubtle rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 text-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-obs-borderSubtle pb-4">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 id="export-modal-title" className="text-lg font-bold text-white tracking-tight">
              Export Scientific Intelligence Report
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Export Modal"
            className="p-1.5 rounded-lg hover:bg-obs-surface2 text-slate-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Export verified observational data and statistical analysis packages for peer review, research publications, or competition evaluation.
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CSV Download */}
          <div className="bg-obs-surface2 border border-obs-borderSubtle p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Full Raw Data (.CSV)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Includes complete yearly observations, climatological baseline anomalies, 5-year running averages, Sen's slope line, and OLS regression fit.
            </p>
            <button
              type="button"
              onClick={handleDownloadCSV}
              disabled={!pointData}
              className="min-h-[38px] w-full flex items-center justify-center gap-2 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Dataset</span>
            </button>
          </div>

          {/* Markdown Copy */}
          <div className="bg-obs-surface2 border border-obs-borderSubtle p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Executive Brief (.MD)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formatted markdown document containing answers to the 4 NASA questions, statistical matrix, limitations, and citations.
            </p>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              disabled={!pointData}
              className="min-h-[38px] w-full flex items-center justify-center gap-2 py-2 px-3 bg-obs-canvas hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold border border-obs-borderSubtle transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-obs-borderSubtle">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] px-4 py-2 bg-obs-surface2 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
