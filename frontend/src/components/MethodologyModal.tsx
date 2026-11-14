"use client";

import React, { useEffect } from "react";
import { X, BookOpen, ShieldCheck } from "lucide-react";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Listen for Escape key to close modal
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="methodology-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-obs-surface1 border border-obs-borderSubtle rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-obs-borderSubtle pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 id="methodology-modal-title" className="text-lg font-bold text-white tracking-tight">
              TerraTrend Scientific Methodology & Statistical Formulation
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Methodology Modal"
            className="p-1.5 rounded-lg hover:bg-obs-surface2 text-slate-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Non-Parametric Mann-Kendall Trend Test */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>1. Mann-Kendall Non-Parametric Trend Test</span>
          </h3>
          <p className="text-slate-300">
            The Mann-Kendall test (Mann 1945, Kendall 1975) is a rank-based non-parametric statistical test recommended by the World Meteorological Organization (WMO) for detecting monotonic trends in climatological and hydrological series. Unlike Ordinary Least Squares (OLS), it requires no assumption of normal distribution and is robust against non-normality, missing values, and isolated extreme weather outliers.
          </p>
          <div className="p-3 bg-obs-canvas rounded-lg border border-obs-borderSubtle font-mono text-[11px] text-cyan-300 space-y-1.5">
            <div>Score S = ∑ (k=1 to n-1) ∑ (j=k+1 to n) sgn(x_j - x_k)</div>
            <div>Var(S) = [ n(n-1)(2n+5) - ∑ t(t-1)(2t+5) ] / 18</div>
            <div>Standardized Z = (S - 1) / √Var(S) if S &gt; 0, or (S + 1) / √Var(S) if S &lt; 0</div>
            <div>Two-tailed p-value = 2 × [ 1 - Φ(|Z|) ]</div>
          </div>
          <p className="text-slate-400">
            Null Hypothesis (H₀): No monotonic trend exists in the data. If p &lt; 0.05, H₀ is rejected, proving statistically significant change at the 95% confidence level.
          </p>
        </div>

        {/* Section 2: Sen's Slope Estimator */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
            2. Sen's Slope Estimator & 95% Confidence Intervals
          </h3>
          <p className="text-slate-300">
            Sen's slope estimator (Sen 1968) calculates the median slope among all pairwise data combinations:
          </p>
          <div className="p-3 bg-obs-canvas rounded-lg border border-obs-borderSubtle font-mono text-[11px] text-emerald-300">
            Q_k = (x_j - x_i) / (j - i) for all 1 ≤ i &lt; j ≤ n; Sen's Slope = median(Q)
          </div>
          <p className="text-slate-400">
            A non-parametric 95% two-sided confidence interval is constructed using rank percentiles derived from the standard normal variance of S, avoiding parametric standard error distortions.
          </p>
        </div>

        {/* Section 3: Serial Autocorrelation Correction */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
            3. Serial Autocorrelation Correction (Hamed & Rao / Yue & Wang)
          </h3>
          <p className="text-slate-300">
            Earth system climate time series commonly exhibit positive serial persistence (e.g. ENSO cycles, ocean thermal inertia), which can inflate the variance of S and cause false rejections of H₀ (Type I error). TerraTrend computes the sample lag-1 autocorrelation (r₁). When r₁ is statistically significant (|r₁| &gt; 1.96 / √N), we apply the modified Mann-Kendall variance correction factor (n / n*) to verify true significance.
          </p>
        </div>

        {/* Section 4: Spatial False Discovery Rate (FDR) */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
            4. Spatial Multiple Testing: Benjamini-Hochberg (FDR)
          </h3>
          <p className="text-slate-300">
            When performing simultaneous hypothesis tests across dozens of spatial grid cells, testing each at α = 0.05 leads to the multiple testing problem. TerraTrend implements the Benjamini-Hochberg False Discovery Rate procedure (FDR = 0.05) to bound the expected proportion of false positive discoveries across the geographic domain.
          </p>
        </div>

        {/* Section 5: Data Lineage & Citations */}
        <div className="space-y-3 text-xs leading-relaxed border-t border-obs-borderSubtle pt-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Official NASA Data Attribution & Lineage
          </h3>
          <ul className="list-disc pl-5 text-slate-400 space-y-1.5">
            <li>
              <span className="text-slate-200 font-medium">NASA POWER Project:</span> Prediction of Worldwide Energy Resources, NASA Langley Research Center.
            </li>
            <li>
              <span className="text-slate-200 font-medium">MERRA-2:</span> Modern-Era Retrospective Analysis for Research and Applications, Version 2, NASA Global Modeling and Assimilation Office (GMAO). Gelaro et al. (2017), Journal of Climate.
            </li>
            <li>
              <span className="text-slate-200 font-medium">CERES:</span> Clouds and the Earth's Radiant Energy System, NASA Langley Research Center.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-obs-borderSubtle">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] px-4 py-2 bg-obs-surface2 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
