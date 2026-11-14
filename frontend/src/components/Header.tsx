import React from "react";
import { Activity, BookOpen, Download, Globe, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenMethodology: () => void;
  onOpenExport: () => void;
  cacheHit?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMethodology,
  onOpenExport,
  cacheHit,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#070e1b]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand and Challenge Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Globe className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                TERRA<span className="text-cyan-400">TREND</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/30">
                NASA Space Apps 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Earth System Trend Discovery & Intelligence Platform • MERRA-2 Lineage
            </p>
          </div>
        </div>

        {/* Live Status and Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>NASA POWER API</span>
            {cacheHit !== undefined && (
              <span className="text-[10px] text-slate-500 border-l border-slate-700 pl-2">
                {cacheHit ? "Cached" : "Live Fetched"}
              </span>
            )}
          </div>

          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Methodology & Math</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm shadow-cyan-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
