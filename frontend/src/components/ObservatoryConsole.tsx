"use client";

import React from "react";
import {
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  Droplets,
  MapPin,
  Navigation,
  Grid,
  Calendar,
  Play,
  Loader2,
  Sliders,
  Compass,
  Info,
  HelpCircle,
} from "lucide-react";
import { VariableMetadata, LocationPreset } from "@/types";
import { AppAudienceMode, AppTheme, EXPLORE_VARIABLE_INFO } from "@/constants/design-tokens";

interface ObservatoryConsoleProps {
  variables: Record<string, VariableMetadata>;
  selectedVariable: string;
  onSelectVariable: (varId: string) => void;

  mode: "point" | "regional";
  onSelectMode: (mode: "point" | "regional") => void;

  presets: LocationPreset[];
  selectedPresetId: string;
  onSelectPreset: (preset: LocationPreset) => void;

  latitude: number;
  longitude: number;
  onChangeCoordinates: (lat: number, lon: number) => void;

  startYear: number;
  endYear: number;
  temporalAggregation: "annual" | "monthly";
  onStartYearChange: (yr: number) => void;
  onEndYearChange: (yr: number) => void;
  onAggregationChange: (agg: "annual" | "monthly") => void;

  onRunAnalysis: () => void;
  isLoading: boolean;

  audienceMode: AppAudienceMode;
  theme: AppTheme;
}

const getVariableIcon = (id: string, isEditorial: boolean) => {
  switch (id) {
    case "T2M":
    case "T2M_MAX":
    case "T2M_MIN":
      return <Thermometer className={`w-3.5 h-3.5 shrink-0 ${isEditorial ? "text-amber-700" : "text-orange-400"}`} />;
    case "PRECTOTCORR":
      return <CloudRain className={`w-3.5 h-3.5 shrink-0 ${isEditorial ? "text-blue-700" : "text-blue-400"}`} />;
    case "WS10M":
      return <Wind className={`w-3.5 h-3.5 shrink-0 ${isEditorial ? "text-teal-700" : "text-teal-400"}`} />;
    case "ALLSKY_SFC_SW_DWN":
      return <Sun className={`w-3.5 h-3.5 shrink-0 ${isEditorial ? "text-amber-600" : "text-amber-400"}`} />;
    case "RH2M":
      return <Droplets className={`w-3.5 h-3.5 shrink-0 ${isEditorial ? "text-cyan-700" : "text-cyan-400"}`} />;
    default:
      return <Thermometer className={`w-3.5 h-3.5 shrink-0 ${isEditorial ? "text-amber-700" : "text-orange-400"}`} />;
  }
};

export const ObservatoryConsole: React.FC<ObservatoryConsoleProps> = ({
  variables,
  selectedVariable,
  onSelectVariable,
  mode,
  onSelectMode,
  presets,
  selectedPresetId,
  onSelectPreset,
  latitude,
  longitude,
  onChangeCoordinates,
  startYear,
  endYear,
  temporalAggregation,
  onStartYearChange,
  onEndYearChange,
  onAggregationChange,
  onRunAnalysis,
  isLoading,
  audienceMode,
  theme,
}) => {
  const isEditorial = theme === "editorial";
  const isExplore = audienceMode === "explore";
  const currentMeta = variables[selectedVariable];
  const exploreInfo = EXPLORE_VARIABLE_INFO[selectedVariable];
  const years = Array.from({ length: 2024 - 1981 + 1 }, (_, i) => 1981 + i);

  return (
    <section
      aria-label="Observatory Control Console"
      className={`rounded-2xl p-4 sm:p-5 shadow-sm transition-colors border space-y-4 ${
        isEditorial
          ? "bg-white border-[#e6e4df] text-stone-900 shadow-stone-200/50"
          : "bg-obs-surface1 border-obs-borderSubtle text-slate-100 shadow-black/40"
      }`}
    >
      {/* Console Header Bar with Mode Switcher */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b ${
        isEditorial ? "border-[#eceae5]" : "border-obs-borderSubtle"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-7 h-7 rounded-lg border text-xs ${
            isEditorial
              ? "bg-blue-50 border-blue-200 text-blue-800"
              : "bg-cyan-950/70 border-cyan-800/60 text-cyan-400"
          }`}>
            {isExplore ? <Compass className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
          </div>
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isEditorial ? "text-stone-800" : "text-slate-200"}`}>
              {isExplore ? "1. Select What & Where to Investigate" : "Observatory Parameter Specification"}
            </h2>
            <p className={`text-[11px] ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
              {isExplore
                ? "Choose an Earth-science variable, geographical region, and time window to reveal historical changes"
                : "Configure NASA Earth-science observation variables, spatial targets, and temporal bounds"}
            </p>
          </div>
        </div>

        {/* Spatial Mode Switcher */}
        <div
          role="radiogroup"
          aria-label="Spatial Analysis Mode"
          className={`flex items-center p-0.5 rounded-lg border ${
            isEditorial ? "bg-[#f5f4ef] border-[#dedad2]" : "bg-obs-canvas border-obs-borderSubtle"
          }`}
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === "point"}
            onClick={() => onSelectMode("point")}
            disabled={isLoading}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === "point"
                ? isEditorial
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                  : "bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/50"
                : isEditorial
                  ? "text-stone-600 hover:text-stone-900"
                  : "text-slate-400 hover:text-slate-200"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Point Station</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={mode === "regional"}
            onClick={() => onSelectMode("regional")}
            disabled={isLoading}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === "regional"
                ? isEditorial
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                  : "bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/50"
                : isEditorial
                  ? "text-stone-600 hover:text-stone-900"
                  : "text-slate-400 hover:text-slate-200"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Regional Grid</span>
          </button>
        </div>
      </div>

      {/* 3-Column Parameter Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Step 1: Variable Selection (lg:col-span-5) */}
        <div className={`lg:col-span-5 space-y-2.5 p-3.5 rounded-xl border ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2/60 border-obs-borderSubtle"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isEditorial ? "text-blue-900" : "text-cyan-400"
            }`}>
              <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                isEditorial ? "bg-blue-100 text-blue-900 border border-blue-300" : "bg-cyan-950 text-cyan-300 border border-cyan-800"
              }`}>
                1
              </span>
              {isExplore ? "Earth Variable" : "NASA Parameter"}
            </span>
            {currentMeta && (
              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
                isEditorial ? "bg-blue-50 text-blue-800 border-blue-200" : "bg-cyan-950/70 text-cyan-300 border-cyan-800/60"
              }`}>
                {currentMeta.units}
              </span>
            )}
          </div>

          {/* Variable Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5" role="radiogroup" aria-label="Earth Variables">
            {Object.entries(variables).map(([id, meta]) => {
              const isSelected = selectedVariable === id;
              const exp = EXPLORE_VARIABLE_INFO[id];
              const displayName = isExplore && exp ? exp.friendlyName : id;
              const subText = isExplore ? id : meta.name;

              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectVariable(id)}
                  disabled={isLoading}
                  className={`min-h-[46px] flex flex-col justify-center text-left p-2 rounded-lg border transition-all text-xs ${
                    isSelected
                      ? isEditorial
                        ? "bg-white border-blue-600 text-stone-900 shadow-sm ring-1 ring-blue-600/30"
                        : "bg-cyan-950/60 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/50"
                      : isEditorial
                        ? "bg-white/80 border-[#e6e4df] hover:border-stone-400 text-stone-700 hover:text-stone-900"
                        : "bg-obs-canvas/80 border-obs-borderSubtle hover:border-slate-700 text-slate-300 hover:text-white"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold flex items-center gap-1 text-[11px] truncate">
                      {getVariableIcon(id, isEditorial)}
                      <span className="truncate">{displayName}</span>
                    </span>
                    <span className={`text-[9px] font-mono shrink-0 ml-1 ${isEditorial ? "text-stone-400" : "text-slate-400"}`}>
                      {meta.units}
                    </span>
                  </div>
                  <span className={`text-[9.5px] truncate mt-0.5 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                    {subText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation Footer for Variable */}
          {currentMeta && (
            <div className={`pt-2 border-t text-[11px] flex items-center justify-between gap-2 ${
              isEditorial ? "border-[#eceae5] text-stone-600" : "border-obs-borderSubtle/60 text-slate-400"
            }`}>
              <span className="truncate">
                {isExplore && exploreInfo ? (
                  <span>
                    <strong className="font-semibold text-stone-800">{exploreInfo.category}:</strong> {exploreInfo.analogy}
                  </span>
                ) : (
                  <span>
                    <strong className="font-medium">Source:</strong>{" "}
                    {currentMeta.original_source.includes("MERRA-2") ? "NASA MERRA-2 Reanalysis" : "NASA CERES Solar"}
                  </span>
                )}
              </span>
              <span className={`shrink-0 text-[10px] font-mono ${isEditorial ? "text-stone-400" : "text-slate-500"}`}>
                Res: {currentMeta.spatial_resolution}
              </span>
            </div>
          )}
        </div>

        {/* Step 2: Spatial Target / Domain (lg:col-span-4) */}
        <div className={`lg:col-span-4 space-y-2.5 p-3.5 rounded-xl border ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2/60 border-obs-borderSubtle"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isEditorial ? "text-indigo-900" : "text-indigo-400"
            }`}>
              <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                isEditorial ? "bg-indigo-100 text-indigo-900 border border-indigo-300" : "bg-indigo-950 text-indigo-300 border border-indigo-800"
              }`}>
                2
              </span>
              {mode === "point" ? (isExplore ? "Location Target" : "Geographic Station") : "Regional Domain"}
            </span>
            <span className={`text-[10px] font-mono ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
              {mode === "point" ? "Tamil Nadu Focus" : "66 MERRA-2 Cells"}
            </span>
          </div>

          {mode === "point" ? (
            <div className="space-y-2">
              {/* Preset Chips */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1" role="radiogroup" aria-label="Station Presets">
                {presets.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelectPreset(preset)}
                      disabled={isLoading}
                      className={`min-h-[38px] p-1.5 rounded-md border text-left transition-all ${
                        isSelected
                          ? isEditorial
                            ? "bg-white border-indigo-600 text-stone-900 shadow-sm ring-1 ring-indigo-600/30"
                            : "bg-indigo-950/70 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40"
                          : isEditorial
                            ? "bg-white/80 border-[#e6e4df] text-stone-700 hover:border-stone-400 hover:text-stone-900"
                            : "bg-obs-canvas/80 border-obs-borderSubtle text-slate-300 hover:border-slate-700 hover:text-white"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="text-[11px] font-semibold truncate">{preset.name}</div>
                      <div className={`text-[9px] font-mono ${isEditorial ? "text-stone-400" : "text-slate-400"}`}>
                        {preset.latitude.toFixed(2)}°, {preset.longitude.toFixed(2)}°
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Coordinates Override */}
              <div className={`grid grid-cols-2 gap-2 pt-1 border-t ${
                isEditorial ? "border-[#eceae5]" : "border-obs-borderSubtle/60"
              }`}>
                <div>
                  <label
                    htmlFor="input-station-latitude"
                    className={`text-[10px] font-semibold uppercase tracking-wider block ${
                      isEditorial ? "text-stone-500" : "text-slate-400"
                    }`}
                  >
                    Latitude (°N)
                  </label>
                  <input
                    id="input-station-latitude"
                    name="latitude"
                    type="number"
                    step="0.01"
                    min="-90"
                    max="90"
                    value={latitude}
                    disabled={isLoading}
                    onChange={(e) => onChangeCoordinates(parseFloat(e.target.value) || 0, longitude)}
                    className={`mt-0.5 w-full border rounded-md px-2 py-1 text-xs font-mono tabular-nums focus:outline-none ${
                      isEditorial
                        ? "bg-white border-[#dedad2] text-stone-900 focus:border-blue-600"
                        : "bg-obs-canvas border-obs-borderSubtle text-slate-100 focus:border-cyan-500"
                    }`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="input-station-longitude"
                    className={`text-[10px] font-semibold uppercase tracking-wider block ${
                      isEditorial ? "text-stone-500" : "text-slate-400"
                    }`}
                  >
                    Longitude (°E)
                  </label>
                  <input
                    id="input-station-longitude"
                    name="longitude"
                    type="number"
                    step="0.01"
                    min="-180"
                    max="180"
                    value={longitude}
                    disabled={isLoading}
                    onChange={(e) => onChangeCoordinates(latitude, parseFloat(e.target.value) || 0)}
                    className={`mt-0.5 w-full border rounded-md px-2 py-1 text-xs font-mono tabular-nums focus:outline-none ${
                      isEditorial
                        ? "bg-white border-[#dedad2] text-stone-900 focus:border-blue-600"
                        : "bg-obs-canvas border-obs-borderSubtle text-slate-100 focus:border-cyan-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={`border rounded-lg p-2.5 text-xs space-y-1.5 ${
              isEditorial ? "bg-white border-[#e6e4df] text-stone-700" : "bg-obs-canvas/80 border-obs-borderSubtle text-slate-300"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-[11px] ${isEditorial ? "text-indigo-900" : "text-indigo-300"}`}>
                  South Peninsular Domain (66 Cells)
                </span>
                <span className={`text-[9px] font-mono ${isEditorial ? "text-stone-400" : "text-slate-400"}`}>
                  0.5° × 0.625° Grid
                </span>
              </div>
              <p className={`text-[10px] leading-relaxed ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                A rectangular selection; neighbouring regions and offshore cells may be included.
              </p>
              <div className={`text-[10px] font-mono pt-1 border-t ${
                isEditorial ? "border-stone-200 text-emerald-800" : "border-obs-borderSubtle text-emerald-400"
              }`}>
                ✓ Benjamini-Hochberg FDR spatial control active
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Temporal Bounds & Primary Execution (lg:col-span-3) */}
        <div className={`lg:col-span-3 space-y-2.5 p-3.5 rounded-xl border flex flex-col justify-between ${
          isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2/60 border-obs-borderSubtle"
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isEditorial ? "text-amber-800" : "text-amber-400"
              }`}>
                <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                  isEditorial ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-amber-950 text-amber-300 border border-amber-800"
                }`}>
                  3
                </span>
                Time Period
              </span>
              <span className={`text-[10px] font-mono ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
                1981–2023
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="select-start-year"
                  className={`text-[10px] font-semibold uppercase tracking-wider block ${
                    isEditorial ? "text-stone-500" : "text-slate-400"
                  }`}
                >
                  Start Year
                </label>
                <select
                  id="select-start-year"
                  name="startYear"
                  value={startYear}
                  disabled={isLoading}
                  onChange={(e) => onStartYearChange(parseInt(e.target.value, 10))}
                  className={`mt-0.5 w-full border rounded-md px-2 py-1 text-xs font-mono tabular-nums focus:outline-none ${
                    isEditorial
                      ? "bg-white border-[#dedad2] text-stone-900 focus:border-blue-600"
                      : "bg-obs-canvas border-obs-borderSubtle text-slate-100 focus:border-cyan-500"
                  }`}
                >
                  {years
                    .filter((y) => y < endYear - 3)
                    .map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-end-year"
                  className={`text-[10px] font-semibold uppercase tracking-wider block ${
                    isEditorial ? "text-stone-500" : "text-slate-400"
                  }`}
                >
                  End Year
                </label>
                <select
                  id="select-end-year"
                  name="endYear"
                  value={endYear}
                  disabled={isLoading}
                  onChange={(e) => onEndYearChange(parseInt(e.target.value, 10))}
                  className={`mt-0.5 w-full border rounded-md px-2 py-1 text-xs font-mono tabular-nums focus:outline-none ${
                    isEditorial
                      ? "bg-white border-[#dedad2] text-stone-900 focus:border-blue-600"
                      : "bg-obs-canvas border-obs-borderSubtle text-slate-100 focus:border-cyan-500"
                  }`}
                >
                  {years
                    .filter((y) => y > startYear + 3)
                    .map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {mode === "point" && (
              <div className="mt-2">
                <label
                  htmlFor="select-temporal-aggregation"
                  className={`text-[10px] font-semibold uppercase tracking-wider block ${
                    isEditorial ? "text-stone-500" : "text-slate-400"
                  }`}
                >
                  Aggregation
                </label>
                <select
                  id="select-temporal-aggregation"
                  name="aggregation"
                  value={temporalAggregation}
                  disabled={isLoading}
                  onChange={(e) => onAggregationChange(e.target.value as "annual" | "monthly")}
                  className={`mt-0.5 w-full border rounded-md px-2 py-1 text-xs focus:outline-none ${
                    isEditorial
                      ? "bg-white border-[#dedad2] text-stone-900 focus:border-blue-600"
                      : "bg-obs-canvas border-obs-borderSubtle text-slate-100 focus:border-cyan-500"
                  }`}
                >
                  <option value="annual">Annual Mean (Standard)</option>

                </select>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onRunAnalysis}
              disabled={isLoading}
              className={`w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-xs font-bold tracking-wide shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isEditorial
                  ? "bg-stone-900 hover:bg-stone-800 shadow-stone-400/30"
                  : "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-600/30"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Querying NASA Observations...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>Discover Earth Trends</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
