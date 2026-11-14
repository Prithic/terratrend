"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RegionalGridPoint, VariableMetadata, RegionalSummaryStatistics } from "@/types";
import { Map, Layers, CheckCircle2, Sliders, ArrowUpRight, ArrowDownRight, Compass } from "lucide-react";
import { formatSlope, formatPValue } from "@/utils/formatters";
import { AppAudienceMode, AppTheme } from "@/constants/design-tokens";

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface RegionalMapProps {
  gridPoints: RegionalGridPoint[];
  meta: VariableMetadata;
  summary: RegionalSummaryStatistics;
  theme?: AppTheme;
  audienceMode?: AppAudienceMode;
}

export const RegionalMap: React.FC<RegionalMapProps> = ({
  gridPoints,
  meta,
  summary,
  theme = "editorial",
  audienceMode = "explore",
}) => {
  const [mounted, setMounted] = useState(false);
  const [filterMode, setFilterMode] = useState<"fdr" | "local">("fdr");

  const isEditorial = theme === "editorial";
  const isExplore = audienceMode === "explore";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`rounded-2xl p-8 text-center text-xs border ${
        isEditorial ? "bg-white border-[#e6e4df] text-stone-500" : "bg-obs-surface1 border-obs-borderSubtle text-slate-400"
      }`}>
        Loading interactive Earth-science spatial map...
      </div>
    );
  }

  const activeCount =
    filterMode === "local"
      ? summary.significant_cells_count
      : (summary.fdr_significant_count ?? summary.significant_cells_count);

  // Diverging color generator based on physical variable
  const getCellColor = (slope: number) => {
    if (meta.identifier.includes("T2M")) {
      // Temperature: Red (Warming) vs Blue (Cooling)
      if (slope > 0.25) return "#dc2626";
      if (slope > 0.15) return "#ea580c";
      if (slope > 0.05) return "#f59e0b";
      if (slope > -0.05) return "#10b981";
      if (slope > -0.15) return "#0284c7";
      return "#2563eb";
    } else if (meta.identifier === "PRECTOTCORR") {
      // Precipitation: Blue/Teal (Wetting) vs Amber/Rust (Drying)
      if (slope > 0.20) return "#0284c7";
      if (slope > 0.05) return "#06b6d4";
      if (slope > -0.05) return "#10b981";
      if (slope > -0.20) return "#f59e0b";
      return "#dc2626";
    } else if (meta.identifier === "WS10M") {
      // Wind speed: Stilling (Violet/Indigo) vs Strengthening (Amber)
      if (slope > 0.0) return "#0284c7";
      if (slope > -0.04) return "#818cf8";
      return "#4f46e5";
    } else {
      // General flux
      if (slope > 0.05) return "#0284c7";
      if (slope > -0.05) return "#10b981";
      return "#f59e0b";
    }
  };

  return (
    <section
      aria-label="Regional Spatial Trend Distribution Map"
      className={`rounded-2xl p-4 sm:p-5 shadow-sm border transition-colors space-y-4 ${
        isEditorial
          ? "bg-white border-[#e6e4df] text-stone-900 shadow-stone-200/50"
          : "bg-obs-surface1 border-obs-borderSubtle text-slate-100 shadow-black/40"
      }`}
    >
      {/* Map Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 ${
        isEditorial ? "border-[#eceae5]" : "border-obs-borderSubtle"
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Map className={`w-4 h-4 ${isEditorial ? "text-blue-700" : "text-cyan-400"}`} />
            <h3 className={`text-sm font-bold ${isEditorial ? "text-stone-900" : "text-slate-100"}`}>
              Regional Spatial Trend Distribution Map
            </h3>
          </div>
          <p className={`text-xs mt-0.5 ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
            {gridPoints.length} NASA MERRA-2 Grid Cells •{" "}
            <span className={`font-mono font-bold tabular-nums ${isEditorial ? "text-blue-800" : "text-cyan-300"}`}>
              {activeCount} ({((activeCount / gridPoints.length) * 100).toFixed(1)}%)
            </span>{" "}
            {filterMode === "local" ? "Local Significant (p < 0.05)" : "FDR Controlled (q < 0.05)"}
          </p>
        </div>

        {/* Filter Toggle & Dual-Channel Legend */}
        <div className="flex items-center flex-wrap gap-2.5 text-[11px]">
          {/* Significance Control Switch */}
          <div
            role="radiogroup"
            aria-label="Significance Filter"
            className={`flex items-center p-0.5 rounded-lg border ${
              isEditorial ? "bg-[#f5f4ef] border-[#dedad2]" : "bg-obs-canvas border-obs-borderSubtle"
            }`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={filterMode === "fdr"}
              onClick={() => setFilterMode("fdr")}
              className={`min-h-[30px] px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                filterMode === "fdr"
                  ? isEditorial
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/50"
                  : isEditorial ? "text-stone-600 hover:text-stone-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              FDR Control (q &lt; 0.05)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={filterMode === "local"}
              onClick={() => setFilterMode("local")}
              className={`min-h-[30px] px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                filterMode === "local"
                  ? isEditorial
                    ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                    : "bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/50"
                  : isEditorial ? "text-stone-600 hover:text-stone-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Local (p &lt; 0.05)
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block ring-2 ring-white/60"></span>
            <span>Significant</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-stone-400 border border-dashed border-stone-600 inline-block"></span>
            <span>Inconclusive</span>
          </div>
        </div>
      </div>

      {/* Opposing Trends Dipole Highlight Banner */}
      {summary.has_opposing_trends && (
        <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs ${
          isEditorial
            ? "bg-blue-50/70 border-blue-200 text-blue-950"
            : "bg-indigo-950/40 border-indigo-700/60 text-indigo-200"
        }`}>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <strong className="font-bold">Opposing Regional Trends Discovered:</strong>
              <span className="ml-1">
                Both statistically significant increasing and decreasing directions co-exist within this domain.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold border border-blue-300">
              <ArrowUpRight className="w-3 h-3" />
              {summary.positive_cells_count} Increasing ({summary.fdr_positive_cells_count} FDR Sig)
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-900 font-semibold border border-red-300">
              <ArrowDownRight className="w-3 h-3" />
              {summary.negative_cells_count} Decreasing ({summary.fdr_negative_cells_count} FDR Sig)
            </span>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div className={`h-[440px] w-full rounded-xl overflow-hidden border relative z-10 ${
        isEditorial ? "border-[#dedad2]" : "border-obs-borderSubtle"
      }`}>
        <MapContainer
          center={[11.1, 78.5]}
          zoom={7}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> & NASA'
            url={
              isEditorial
                ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
          />

          {gridPoints.map((pt, idx) => {
            const color = getCellColor(pt.sens_slope_per_decade);
            const isMarkedSig =
              filterMode === "local"
                ? pt.is_significant
                : (pt.is_fdr_significant ?? pt.is_significant);

            return (
              <CircleMarker
                key={`grid-${idx}`}
                center={[pt.latitude, pt.longitude]}
                radius={isMarkedSig ? 13 : 8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isMarkedSig ? 0.9 : 0.45,
                  color: isMarkedSig ? "#ffffff" : "#475569",
                  weight: isMarkedSig ? 2.5 : 1,
                  dashArray: isMarkedSig ? undefined : "3, 3",
                }}
              >
                <Popup className="custom-popup">
                  <div className="text-xs text-stone-900 p-1 space-y-1 min-w-[200px]">
                    <div className="font-bold border-b pb-1 text-stone-900 font-mono flex justify-between items-center">
                      <span>Cell: {pt.latitude.toFixed(2)}°N, {pt.longitude.toFixed(2)}°E</span>
                      {pt.elevation_m !== null && pt.elevation_m !== undefined && (
                        <span className="text-[10px] text-stone-600 font-normal">
                          {pt.elevation_m > 5 ? `${pt.elevation_m.toFixed(0)}m elev` : "Maritime / Coast"}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between gap-3">
                      <span>Sen&apos;s Rate:</span>
                      <span className="font-mono font-bold tabular-nums">
                        {formatSlope(pt.sens_slope_per_decade, meta.units, "decade")}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span>Mann-Kendall p:</span>
                      <span className="font-mono font-bold tabular-nums">
                        {formatPValue(pt.mk_p_value)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span>Significance:</span>
                      <span
                        className={`font-semibold ${
                          pt.is_fdr_significant
                            ? "text-emerald-700"
                            : pt.is_significant
                            ? "text-blue-700"
                            : "text-stone-500"
                        }`}
                      >
                        {pt.is_fdr_significant
                          ? "FDR Significant (q < 0.05)"
                          : pt.is_significant
                          ? "Local Sig (p < 0.05)"
                          : "Not Significant"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3 border-t pt-1">
                      <span>Net Historical Shift:</span>
                      <span className="font-mono font-bold tabular-nums">
                        {pt.total_change >= 0 ? `+${pt.total_change.toFixed(2)}` : pt.total_change.toFixed(2)} {meta.units}
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Regional Domain Summary Grid */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3.5 rounded-xl border ${
        isEditorial ? "bg-[#faf9f6] border-[#e7e5e0]" : "bg-obs-surface2 border-obs-borderSubtle"
      }`}>
        <div>
          <span className={`block ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>Domain Mean Rate:</span>
          <span className={`font-mono font-bold tabular-nums ${isEditorial ? "text-stone-900" : "text-slate-200"}`}>
            {formatSlope(summary.regional_mean_slope_per_decade, meta.units, "decade")}
          </span>
        </div>
        <div>
          <span className={`block ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>Minimum Extrema:</span>
          <span className="font-mono font-bold tabular-nums text-blue-700">
            {formatSlope(summary.min_slope_per_decade, meta.units, "decade")}
          </span>
        </div>
        <div>
          <span className={`block ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>Maximum Extrema:</span>
          <span className="font-mono font-bold tabular-nums text-red-700">
            {formatSlope(summary.max_slope_per_decade, meta.units, "decade")}
          </span>
        </div>
        <div>
          <span className={`block ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>FDR Controlled Cells:</span>
          <span className="font-mono font-bold tabular-nums text-emerald-700">
            {summary.fdr_significant_count ?? summary.significant_cells_count} of {summary.total_grid_cells} Cells
          </span>
        </div>
      </div>
    </section>
  );
};
