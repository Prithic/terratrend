import React, { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
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
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5" />
            {tier}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#08101e] border border-cyan-900/40 rounded-2xl p-5 sm:p-6 shadow-xl shadow-cyan-950/20 space-y-5">
      {/* Top Banner: 4 Essential NASA Questions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              NASA CHALLENGE CORE ACCEPTANCE CRITERIA
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
            The 4 Essential Earth System Questions
          </h2>
        </div>
        <div>{getConfidenceBadge(explanation.confidence_tier)}</div>
      </div>

      {/* 4 Essential Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. WHAT is changing? */}
        <div className="bg-[#0c1626] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all">
          <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px]">
              1
            </span>
            <span>WHAT is changing?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {explanation.question_what}
          </p>
        </div>

        {/* 2. WHERE is it changing? */}
        <div className="bg-[#0c1626] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px]">
              2
            </span>
            <span>WHERE is it changing?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {explanation.question_where}
          </p>
        </div>

        {/* 3. HOW MUCH is it changing? */}
        <div className="bg-[#0c1626] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[11px]">
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
          className={`border rounded-xl p-4 transition-all ${
            isSig
              ? "bg-emerald-950/20 border-emerald-500/40 shadow-sm shadow-emerald-950/30"
              : "bg-slate-900/60 border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
                4
              </span>
              <span>ARE changes statistically significant?</span>
            </div>
            {isSig ? (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Significant (p &lt; 0.05)
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
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
      <div className="bg-[#0d1829] border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-slate-100 font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Scientific Synthesis & Climatological Grounding</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          {explanation.scientific_synthesis}
        </p>
      </div>

      {/* Expandable Limitations & Citation */}
      <div className="border-t border-slate-800/80 pt-3">
        <button
          onClick={() => setShowLimitations(!showLimitations)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Scientific Limitations & Data Lineage Audit</span>
          </span>
          {showLimitations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showLimitations && (
          <div className="mt-3 space-y-3 text-xs text-slate-400 animate-fadeIn">
            <ul className="list-disc pl-5 space-y-1.5">
              {explanation.scientific_limitations.map((lim, i) => (
                <li key={i} className="leading-relaxed">
                  {lim}
                </li>
              ))}
            </ul>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-slate-300 font-bold block mb-1">Source Citation:</span>
              {explanation.citation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
