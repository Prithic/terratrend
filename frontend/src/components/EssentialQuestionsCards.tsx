"use client";

import React, { useState } from "react";
import { HelpCircle, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { ScientificExplanation, TrendStatistics } from "@/types";

interface EssentialQuestionsCardsProps {
  explanation: ScientificExplanation;
  stats?: TrendStatistics;
}

export const EssentialQuestionsCards: React.FC<EssentialQuestionsCardsProps> = ({
  explanation,
  stats,
}) => {
  const [showLimitations, setShowLimitations] = useState(false);

  const isSig = stats?.is_statistically_significant ?? explanation.question_are_changes_significant.startsWith("YES");

  const getConfidenceBadge = (tier: string) => {
    switch (tier) {
      case "High Confidence":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-900/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {tier}
          </span>
        );
      case "Moderate Confidence":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-900/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            {tier}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-obs-surface2 text-slate-300 border border-obs-borderSubtle">
            <HelpCircle className="w-3.5 h-3.5" />
            {tier}
          </span>
        );
    }
  };

  return (
    <section
      aria-labelledby="essential-questions-title"
      className="bg-obs-surface1 border border-cyan-900/40 rounded-2xl p-5 sm:p-6 shadow-xl shadow-cyan-950/20 space-y-5"
    >
      {/* Top Banner: 4 Essential NASA Questions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-obs-borderSubtle gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
              NASA CHALLENGE CORE ACCEPTANCE CRITERIA
            </span>
          </div>
          <h2
            id="essential-questions-title"
            className="text-lg font-extrabold text-white tracking-tight mt-0.5"
          >
            The 4 Essential Earth System Questions
          </h2>
        </div>
        <div>{getConfidenceBadge(explanation.confidence_tier)}</div>
      </div>

      {/* 4 Essential Questions Grid with Distinct Left Accent Strips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. WHAT is changing? */}
        <div className="bg-obs-surface2 border-l-4 border-l-cyan-500 border border-obs-borderSubtle rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-mono font-bold">
              1
            </span>
            <span>WHAT is changing?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {explanation.question_what}
          </p>
        </div>

        {/* 2. WHERE is it changing? */}
        <div className="bg-obs-surface2 border-l-4 border-l-indigo-500 border border-obs-borderSubtle rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-mono font-bold">
              2
            </span>
            <span>WHERE is it changing?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {explanation.question_where}
          </p>
        </div>

        {/* 3. HOW MUCH is it changing? */}
        <div className="bg-obs-surface2 border-l-4 border-l-amber-500 border border-obs-borderSubtle rounded-xl p-4 transition-all hover:border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-mono font-bold">
              3
            </span>
            <span>HOW MUCH is it changing?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {explanation.question_how_much}
          </p>
        </div>

        {/* 4. ARE the changes statistically significant? */}
        <div
          className={`border-l-4 border rounded-xl p-4 transition-all ${
            isSig
              ? "bg-emerald-950/20 border-l-emerald-500 border-emerald-500/40 shadow-sm shadow-emerald-950/30"
              : "bg-obs-surface2 border-l-slate-600 border-obs-borderSubtle"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isSig ? "text-emerald-400" : "text-slate-300"}`}>
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-bold ${isSig ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                4
              </span>
              <span>ARE changes statistically significant?</span>
            </div>
            {isSig ? (
              <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Significant (p &lt; 0.05)
              </span>
            ) : (
              <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Not Significant
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {explanation.question_are_changes_significant}
          </p>
        </div>
      </div>

      {/* Synthesis Section */}
      <div className="bg-obs-surface2 border border-obs-borderSubtle rounded-xl p-4 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-slate-100 font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Scientific Synthesis & Climatological Grounding</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          {explanation.scientific_synthesis}
        </p>
      </div>

      {/* Expandable Limitations & Citation */}
      <div className="border-t border-obs-borderSubtle pt-3">
        <button
          type="button"
          onClick={() => setShowLimitations(!showLimitations)}
          aria-expanded={showLimitations}
          aria-controls="scientific-limitations-drawer"
          className="min-h-[36px] flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-md px-1"
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Scientific Limitations & Data Lineage Audit</span>
          </span>
          {showLimitations ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
        </button>

        {showLimitations && (
          <div id="scientific-limitations-drawer" className="mt-3 space-y-3 text-xs text-slate-400 animate-fadeIn">
            <ul className="list-disc pl-5 space-y-1.5">
              {explanation.scientific_limitations.map((lim, i) => (
                <li key={i} className="leading-relaxed">
                  {lim}
                </li>
              ))}
            </ul>

            <div className="p-3 bg-obs-canvas rounded-lg border border-obs-borderSubtle text-[11px] font-mono text-slate-400">
              <span className="text-slate-300 font-bold block mb-1">Source Citation:</span>
              {explanation.citation}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
