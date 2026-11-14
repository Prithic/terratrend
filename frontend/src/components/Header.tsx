"use client";

import React from "react";
import { BookOpen, Download, Globe, Compass, Microscope, Sun, Moon } from "lucide-react";
import { AppAudienceMode, AppTheme } from "@/constants/design-tokens";

interface HeaderProps {
  onOpenMethodology: () => void;
  onOpenExport: () => void;
  cacheHit?: boolean;
  audienceMode: AppAudienceMode;
  onAudienceModeChange: (mode: AppAudienceMode) => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMethodology,
  onOpenExport,
  cacheHit,
  audienceMode,
  onAudienceModeChange,
  theme,
  onThemeChange,
}) => {
  const isEditorial = theme === "editorial";

  return (
    <header
      className={`border-b sticky top-0 z-40 transition-colors backdrop-blur-md ${
        isEditorial
          ? "bg-[#faf9f5]/95 border-[#e6e4df] text-stone-900"
          : "bg-obs-surface1/95 border-obs-borderSubtle text-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand and Challenge Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-600 shadow-md ring-1 ring-black/10 shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-black tracking-tight flex items-center gap-1 ${isEditorial ? "text-stone-900" : "text-white"}`}>
                TERRA<span className="text-cyan-600">TREND</span>
              </h1>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isEditorial
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-blue-500/10 text-cyan-400 border-cyan-500/30"
              }`}>
                NASA Space Apps 2026
              </span>
            </div>
            <p className={`text-xs ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
              Earth System Trend Discovery & Intelligence • NASA MERRA-2 & CERES
            </p>
          </div>
        </div>

        {/* Live Controls: Audience Mode, Theme Toggle, Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Audience Mode Switcher (Explore vs Research) */}
          <div
            role="radiogroup"
            aria-label="Platform Experience Mode"
            className={`flex items-center p-0.5 rounded-lg border text-xs ${
              isEditorial ? "bg-[#f0eee6] border-[#dedad2]" : "bg-obs-canvas border-obs-borderSubtle"
            }`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={audienceMode === "explore"}
              onClick={() => onAudienceModeChange("explore")}
              className={`min-h-[32px] flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                audienceMode === "explore"
                  ? isEditorial
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/40"
                  : isEditorial ? "text-stone-600 hover:text-stone-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={audienceMode === "research"}
              onClick={() => onAudienceModeChange("research")}
              className={`min-h-[32px] flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                audienceMode === "research"
                  ? isEditorial
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/40"
                  : isEditorial ? "text-stone-600 hover:text-stone-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>Research</span>
            </button>
          </div>

          {/* Theme Toggle (Editorial vs Observatory) */}
          <button
            type="button"
            onClick={() => onThemeChange(isEditorial ? "observatory" : "editorial")}
            title={`Switch to ${isEditorial ? "Observatory Dark" : "Scientific Editorial Light"} mode`}
            className={`min-h-[34px] min-w-[34px] flex items-center justify-center p-1.5 rounded-lg border text-xs transition-colors ${
              isEditorial
                ? "bg-[#f0eee6] hover:bg-[#e6e3da] border-[#dedad2] text-stone-700"
                : "bg-obs-canvas hover:bg-slate-800 border-obs-borderSubtle text-slate-300"
            }`}
          >
            {isEditorial ? <Moon className="w-4 h-4 text-stone-700" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* NASA API Status Pill */}
          <div className={`hidden sm:flex items-center gap-2 min-h-[34px] px-2.5 py-1 rounded-lg border text-xs ${
            isEditorial ? "bg-[#f5f4ef] border-[#dedad2] text-stone-700" : "bg-obs-canvas border-obs-borderSubtle text-slate-300"
          }`}>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
            <span className="font-medium text-[11px]">NASA API</span>
            {cacheHit !== undefined && (
              <span className={`text-[10px] pl-1.5 border-l font-mono ${isEditorial ? "border-stone-300 text-stone-500" : "border-slate-700 text-slate-400"}`}>
                {cacheHit ? "Cached" : "Live"}
              </span>
            )}
          </div>

          {/* Action Modals */}
          <button
            type="button"
            onClick={onOpenMethodology}
            className={`min-h-[34px] flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
              isEditorial
                ? "bg-white hover:bg-stone-50 border-stone-300 text-stone-800 shadow-sm"
                : "bg-obs-surface2 hover:bg-slate-800 border-obs-borderSubtle text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
            <span>Methodology</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="min-h-[34px] flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-lg text-white bg-cyan-700 hover:bg-cyan-600 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
