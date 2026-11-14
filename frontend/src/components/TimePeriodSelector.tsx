import React from "react";
import { Calendar, Play, Loader2, Sparkles } from "lucide-react";

interface TimePeriodSelectorProps {
  startYear: number;
  endYear: number;
  temporalAggregation: "annual" | "monthly";
  onStartYearChange: (yr: number) => void;
  onEndYearChange: (yr: number) => void;
  onAggregationChange: (agg: "annual" | "monthly") => void;
  onRunAnalysis: () => void;
  isLoading: boolean;
}

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  startYear,
  endYear,
  temporalAggregation,
  onStartYearChange,
  onEndYearChange,
  onAggregationChange,
  onRunAnalysis,
  isLoading,
}) => {
  const years = Array.from({ length: 2024 - 1981 + 1 }, (_, i) => 1981 + i);

  return (
    <div className="bg-[#0b1320] border border-slate-800/80 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
        {/* Start Year */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Start Year</span>
          </label>
          <select
            value={startYear}
            disabled={isLoading}
            onChange={(e) => onStartYearChange(parseInt(e.target.value))}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
          >
            {years.filter((y) => y < endYear - 3).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* End Year */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>End Year</span>
          </label>
          <select
            value={endYear}
            disabled={isLoading}
            onChange={(e) => onEndYearChange(parseInt(e.target.value))}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
          >
            {years.filter((y) => y > startYear + 3).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Aggregation */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
            <span>Aggregation</span>
          </label>
          <select
            value={temporalAggregation}
            disabled={isLoading}
            onChange={(e) => onAggregationChange(e.target.value as "annual" | "monthly")}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="annual">Annual Mean (Standard)</option>

          </select>
        </div>
      </div>

      {/* Execute Button */}
      <div className="shrink-0">
        <button
          onClick={onRunAnalysis}
          disabled={isLoading}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying NASA API & Calculating Trends...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Execute Scientific Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
