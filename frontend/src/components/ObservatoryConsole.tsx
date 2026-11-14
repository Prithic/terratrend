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
  Layers,
  Sparkles,
} from "lucide-react";
import { VariableMetadata, LocationPreset } from "@/types";

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
}

const getVariableIcon = (id: string) => {
  switch (id) {
    case "T2M":
    case "T2M_MAX":
    case "T2M_MIN":
      return <Thermometer className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    case "PRECTOTCORR":
      return <CloudRain className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    case "WS10M":
      return <Wind className="w-3.5 h-3.5 text-teal-400 shrink-0" />;
    case "ALLSKY_SFC_SW_DWN":
      return <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    case "RH2M":
      return <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    default:
      return <Thermometer className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
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
}) => {
  const currentMeta = variables[selectedVariable];
  const years = Array.from({ length: 2024 - 1981 + 1 }, (_, i) => 1981 + i);

  return (
    <section
      aria-label="Observatory Control Console"
      className="bg-obs-surface1 border border-obs-borderSubtle rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 space-y-4"
    >
      {/* Console Header Bar with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-obs-borderSubtle">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Observatory Parameter Specification
            </h2>
            <p className="text-[11px] text-slate-400">
              Configure NASA Earth-science observation variables, spatial targets, and temporal bounds
            </p>
          </div>
        </div>

        {/* Mode Toggle Switcher */}
        <div
          role="radiogroup"
          aria-label="Spatial Analysis Mode"
          className="flex items-center bg-obs-canvas border border-obs-borderSubtle rounded-lg p-0.5"
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === "point"}
            onClick={() => onSelectMode("point")}
            disabled={isLoading}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === "point"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/50"
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
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/50"
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
        <div className="lg:col-span-5 space-y-2.5 bg-obs-surface2/60 p-3.5 rounded-xl border border-obs-borderSubtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                1
              </span>
              Earth-Science Variable
            </span>
            {currentMeta && (
              <span className="text-[10px] font-mono font-medium text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
                Units: {currentMeta.units}
              </span>
            )}
          </div>

          {/* Variable Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5" role="radiogroup" aria-label="NASA Variables">
            {Object.entries(variables).map(([id, meta]) => {
              const isSelected = selectedVariable === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectVariable(id)}
                  disabled={isLoading}
                  className={`min-h-[44px] flex flex-col justify-center text-left p-2 rounded-lg border transition-all text-xs ${
                    isSelected
                      ? "bg-cyan-950/60 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/50"
                      : "bg-obs-canvas/80 border-obs-borderSubtle hover:border-slate-700 text-slate-300 hover:text-white"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      {getVariableIcon(id)}
                      {id}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {meta.units}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 truncate mt-0.5">
                    {meta.name}
                  </span>
                </button>
              );
            })}
          </div>

          {currentMeta && (
            <div className="pt-2 border-t border-obs-borderSubtle/60 text-[11px] text-slate-400 flex items-center justify-between gap-2">
              <span className="truncate">
                <span className="text-slate-300 font-medium">Source:</span>{" "}
                {currentMeta.original_source.includes("MERRA-2") ? "NASA MERRA-2 Reanalysis" : "NASA CERES Solar"}
              </span>
              <span className="shrink-0 text-[10px] text-slate-500 font-mono">
                Res: {currentMeta.spatial_resolution}
              </span>
            </div>
          )}
        </div>

        {/* Step 2: Spatial Target / Domain (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-2.5 bg-obs-surface2/60 p-3.5 rounded-xl border border-obs-borderSubtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px]">
                2
              </span>
              {mode === "point" ? "Geographic Station" : "Regional Domain"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {mode === "point" ? "Tamil Nadu Focus" : "35+ MERRA-2 Cells"}
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
                          ? "bg-indigo-950/70 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40"
                          : "bg-obs-canvas/80 border-obs-borderSubtle text-slate-300 hover:border-slate-700 hover:text-white"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="text-[11px] font-semibold truncate">{preset.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        {preset.latitude.toFixed(2)}°, {preset.longitude.toFixed(2)}°
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Coordinates Override */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-obs-borderSubtle/60">
                <div>
                  <label
                    htmlFor="input-station-latitude"
                    className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block"
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
                    className="mt-0.5 w-full bg-obs-canvas border border-obs-borderSubtle rounded-md px-2 py-1 text-xs text-slate-100 font-mono tabular-nums focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="input-station-longitude"
                    className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block"
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
                    className="mt-0.5 w-full bg-obs-canvas border border-obs-borderSubtle rounded-md px-2 py-1 text-xs text-slate-100 font-mono tabular-nums focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-obs-canvas/80 border border-obs-borderSubtle rounded-lg p-2.5 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-300 text-[11px]">
                  Tamil Nadu & Western Ghats Domain
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  0.5° × 0.625° Grid
                </span>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Evaluates 66 assimilation cells from the Arabian Sea / Western Ghats rain-shadow through the Kaveri basin to the Bay of Bengal coast (8.5°N - 13.5°N, 76.5°E - 80.5°E).
              </p>
              <div className="text-[10px] text-emerald-400 font-mono pt-1 border-t border-obs-borderSubtle">
                ✓ Benjamini-Hochberg FDR spatial control enabled
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Temporal Bounds & Primary Execution (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-2.5 bg-obs-surface2/60 p-3.5 rounded-xl border border-obs-borderSubtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                  3
                </span>
                Temporal Bounds
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                1981–2023
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="select-start-year"
                  className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block"
                >
                  Start Year
                </label>
                <select
                  id="select-start-year"
                  name="startYear"
                  value={startYear}
                  disabled={isLoading}
                  onChange={(e) => onStartYearChange(parseInt(e.target.value, 10))}
                  className="mt-0.5 w-full bg-obs-canvas border border-obs-borderSubtle rounded-md px-2 py-1 text-xs text-slate-100 font-mono tabular-nums focus:border-cyan-500 focus:outline-none"
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
                  className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block"
                >
                  End Year
                </label>
                <select
                  id="select-end-year"
                  name="endYear"
                  value={endYear}
                  disabled={isLoading}
                  onChange={(e) => onEndYearChange(parseInt(e.target.value, 10))}
                  className="mt-0.5 w-full bg-obs-canvas border border-obs-borderSubtle rounded-md px-2 py-1 text-xs text-slate-100 font-mono tabular-nums focus:border-cyan-500 focus:outline-none"
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
                  className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block"
                >
                  Aggregation
                </label>
                <select
                  id="select-temporal-aggregation"
                  name="aggregation"
                  value={temporalAggregation}
                  disabled={isLoading}
                  onChange={(e) => onAggregationChange(e.target.value as "annual" | "monthly")}
                  className="mt-0.5 w-full bg-obs-canvas border border-obs-borderSubtle rounded-md px-2 py-1 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="annual">Annual Mean (Standard)</option>
                  <option value="monthly">Monthly Timeseries</option>
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
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Computing Trends...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>Execute Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
