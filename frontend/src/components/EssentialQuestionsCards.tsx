"use client";

import React, { useState } from "react";
import { HelpCircle, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { ScientificExplanation, TrendStatistics } from "@/types";
import { AppAudienceMode, AppTheme } from "@/constants/design-tokens";

interface EssentialQuestionsCardsProps {
  explanation: ScientificExplanation;
  stats?: TrendStatistics;
  theme?: AppTheme;
  audienceMode?: AppAudienceMode;
}

export const EssentialQuestionsCards: React.FC<EssentialQuestionsCardsProps> = ({
  explanation,
  stats,
  theme = "editorial",
  audienceMode = "explore",
}) => {
  const [showLimitations, setShowLimitations] = useState(false);
  const isEditorial = theme === "editorial";
  const isExplore = audienceMode === "explore";

  const isSig = stats?.is_statistically_significant ?? explanation.question_are_changes_significant.startsWith("YES");

  const getConfidenceBadge = (tier: string) => {
    switch (tier) {
      case "High Confidence":
        return (
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isEditorial
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isExplore ? "Verified Signal" : tier}
          </span>
        );
      case "Moderate Confidence":
        return (
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isEditorial
              ? "bg-amber-50 text-amber-800 border-amber-300"
              : "bg-amber-950/80 text-amber-400 border-amber-500/40"
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {isExplore ? "Emerging Trend" : tier}
          </span>
        );
      default:
        return (
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isEditorial
              ? "bg-stone-100 text-stone-700 border-stone-300"
              : "bg-obs-surface2 text-slate-300 border-obs-borderSubtle"
          }`}>
            <HelpCircle className="w-3.5 h-3.5" />
            {isExplore ? "Natural Variation" : tier}
          </span>
        );
    }
  };

  return (
    <section
      aria-labelledby="essential-questions-title"
      className={`rounded-2xl p-5 sm:p-6 shadow-sm border transition-colors space-y-5 ${
        isEditorial
          ? "bg-white border-[#e6e4df] text-stone-900 shadow-stone-200/50"
          : "bg-obs-surface1 border-cyan-900/40 text-slate-100 shadow-cyan-950/20"
      }`}
    >
      {/* Top Banner: 4 Essential NASA Questions Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b gap-3 ${
        isEditorial ? "border-[#eceae5]" : "border-obs-borderSubtle"
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
              isEditorial ? "text-blue-800" : "text-cyan-400"
            }`}>
              NASA CHALLENGE CORE ACCEPTANCE CRITERIA
            </span>
          </div>
          <h2
            id="essential-questions-title"
            className={`text-lg font-extrabold tracking-tight mt-0.5 ${
              isEditorial ? "text-stone-900" : "text-white"
            }`}
          >
            The 4 Essential Earth System Questions
          </h2>
        </div>
        <div>{getConfidenceBadge(explanation.confidence_tier)}</div>
      </div>

      {/* 4 Essential Questions Grid with Distinct Left Accent Strips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. WHAT is changing? */}
        <div className={`border-l-4 border-l-cyan-600 border rounded-xl p-4 transition-all ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
        }`}>
          <div className={`flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider ${
            isEditorial ? "text-cyan-800" : "text-cyan-400"
          }`}>
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-bold ${
              isEditorial ? "bg-cyan-100 text-cyan-900 border border-cyan-300" : "bg-cyan-950 text-cyan-300 border border-cyan-800"
            }`}>
              1
            </span>
            <span>WHAT is changing?</span>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
            isEditorial ? "text-stone-800" : "text-slate-200"
          }`}>
            {explanation.question_what}
          </p>
        </div>

        {/* 2. WHERE is it changing? */}
        <div className={`border-l-4 border-l-indigo-600 border rounded-xl p-4 transition-all ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
        }`}>
          <div className={`flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider ${
            isEditorial ? "text-indigo-800" : "text-indigo-400"
          }`}>
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-bold ${
              isEditorial ? "bg-indigo-100 text-indigo-900 border border-indigo-300" : "bg-indigo-950 text-indigo-300 border border-indigo-800"
            }`}>
              2
            </span>
            <span>WHERE is it changing?</span>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
            isEditorial ? "text-stone-800" : "text-slate-200"
          }`}>
            {explanation.question_where}
          </p>
        </div>

        {/* 3. HOW MUCH is it changing? */}
        <div className={`border-l-4 border-l-amber-600 border rounded-xl p-4 transition-all ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
        }`}>
          <div className={`flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-wider ${
            isEditorial ? "text-amber-800" : "text-amber-400"
          }`}>
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-bold ${
              isEditorial ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-amber-950 text-amber-300 border border-amber-800"
            }`}>
              3
            </span>
            <span>HOW MUCH is it changing?</span>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
            isEditorial ? "text-stone-800" : "text-slate-200"
          }`}>
            {explanation.question_how_much}
          </p>
        </div>

        {/* 4. ARE the changes statistically significant? */}
        <div
          className={`border-l-4 border rounded-xl p-4 transition-all ${
            isSig
              ? isEditorial
                ? "bg-emerald-50/70 border-l-emerald-600 border-emerald-300 shadow-sm"
                : "bg-emerald-950/20 border-l-emerald-500 border-emerald-500/40 shadow-sm"
              : isEditorial
                ? "bg-[#faf9f6] border-l-stone-400 border-[#e7e5e0]"
                : "bg-obs-surface2 border-l-slate-600 border-obs-borderSubtle"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
              isSig
                ? isEditorial ? "text-emerald-900" : "text-emerald-400"
                : isEditorial ? "text-stone-700" : "text-slate-300"
            }`}>
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-bold ${
                isSig
                  ? isEditorial ? "bg-emerald-200 text-emerald-950 border border-emerald-400" : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : isEditorial ? "bg-stone-200 text-stone-700 border border-stone-300" : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}>
                4
              </span>
              <span>ARE changes statistically significant?</span>
            </div>
            {isSig ? (
              <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded border ${
                isEditorial ? "bg-emerald-100 text-emerald-900 border-emerald-300" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}>
                Significant (p &lt; 0.05)
              </span>
            ) : (
              <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded border ${
                isEditorial ? "bg-stone-200 text-stone-700 border-stone-300" : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}>
                Natural Variation
              </span>
            )}
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
            isEditorial ? "text-stone-800" : "text-slate-200"
          }`}>
            {explanation.question_are_changes_significant}
          </p>
        </div>
      </div>

      {/* Synthesis Section */}
      <div className={`border rounded-xl p-4 text-xs space-y-2 ${
        isEditorial ? "bg-[#f7f6f2] border-[#e6e4df] text-stone-800" : "bg-obs-surface2 border-obs-borderSubtle text-slate-300"
      }`}>
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className={`w-4 h-4 shrink-0 ${isEditorial ? "text-blue-700" : "text-cyan-400"}`} />
          <span>Scientific Synthesis & Climatological Grounding</span>
        </div>
        <p className={`leading-relaxed ${isEditorial ? "text-stone-700" : "text-slate-300"}`}>
          {explanation.scientific_synthesis}
        </p>
      </div>

      {/* Actionable Sector & Decision-Maker Impacts */}
      {explanation.actionable_impacts && explanation.actionable_impacts.length > 0 && (
        <div className={`border rounded-xl p-4 text-xs space-y-2.5 ${
          isEditorial ? "bg-[#f0fdf4] border-emerald-300 text-stone-800" : "bg-emerald-950/30 border-emerald-800/50 text-emerald-100"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <span className="text-[11px] uppercase tracking-wider font-mono">Real-World Operational & Sector Impacts:</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
              isEditorial ? "bg-emerald-100 text-emerald-900 border border-emerald-300" : "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"
            }`}>
              Policy & Adaptation
            </span>
          </div>
          <ul className="space-y-1.5 pl-1">
            {explanation.actionable_impacts.map((impact, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                <span className={`leading-relaxed ${isEditorial ? "text-stone-800" : "text-slate-200"}`}>{impact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expandable Limitations & Citation */}
      <div className={`border-t pt-3 ${isEditorial ? "border-[#eceae5]" : "border-obs-borderSubtle"}`}>
        <button
          type="button"
          onClick={() => setShowLimitations(!showLimitations)}
          aria-expanded={showLimitations}
          aria-controls="scientific-limitations-drawer"
          className={`min-h-[36px] flex items-center justify-between w-full text-xs font-semibold rounded-md px-1 transition-colors ${
            isEditorial ? "text-stone-600 hover:text-stone-900" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Scientific Limitations & Data Lineage Audit</span>
          </span>
          {showLimitations ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
        </button>

        {showLimitations && (
          <div id="scientific-limitations-drawer" className={`mt-3 space-y-3 text-xs animate-fadeIn ${
            isEditorial ? "text-stone-600" : "text-slate-400"
          }`}>
            <ul className="list-disc pl-5 space-y-1.5">
              {explanation.scientific_limitations.map((lim, i) => (
                <li key={i} className="leading-relaxed">
                  {lim}
                </li>
              ))}
            </ul>

            <div className={`p-3 rounded-lg border text-[11px] font-mono ${
              isEditorial ? "bg-[#f5f4ef] border-[#dedad2] text-stone-700" : "bg-obs-canvas border-obs-borderSubtle text-slate-400"
            }`}>
              <span className={`font-bold block mb-1 ${isEditorial ? "text-stone-900" : "text-slate-300"}`}>
                Source Citation:
              </span>
              {explanation.citation}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
