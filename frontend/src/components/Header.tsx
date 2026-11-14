"use client";

import React from "react";
import { BookOpen, Download, Globe } from "lucide-react";

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
    <header className="border-b border-obs-borderSubtle bg-obs-surface1/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand and Challenge Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-white/20 shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
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
          {/* Status badge with restrained indicator (no aggressive ping) */}
          <div className="flex items-center gap-2 min-h-[38px] px-3 py-1.5 rounded-lg bg-obs-canvas border border-obs-borderSubtle text-xs text-slate-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="font-medium">NASA POWER API</span>
            {cacheHit !== undefined && (
              <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2 font-mono">
                {cacheHit ? "Cached" : "Live Fetched"}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenMethodology}
            className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-obs-surface2 hover:bg-slate-800 border border-obs-borderSubtle rounded-lg transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Methodology & Math</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm shadow-cyan-600/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
