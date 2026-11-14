"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RegionalGridPoint, VariableMetadata, RegionalSummaryStatistics } from "@/types";
import { Map, Layers, CheckCircle2, Sliders } from "lucide-react";
import { formatSlope, formatPValue, getTrendColor } from "@/utils/formatters";

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
}

export const RegionalMap: React.FC<RegionalMapProps> = ({
  gridPoints,
  meta,
  summary,
}) => {
  const [mounted, setMounted] = useState(false);
  const [filterMode, setFilterMode] = useState<"local" | "fdr">("fdr");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-obs-surface1 border border-obs-borderSubtle rounded-2xl p-8 text-center text-xs text-slate-400">
        Loading interactive Earth-science spatial map...
      </div>
    );
  }

  const activeCount =
    filterMode === "local"
      ? summary.significant_cells_count
      : (summary.fdr_significant_count ?? summary.significant_cells_count);

  return (
    <section
      aria-label="Regional Spatial Trend Distribution Map"
      className="bg-obs-surface1 border border-obs-borderSubtle rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
    >
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-obs-borderSubtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Regional Spatial Trend Distribution Map
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {gridPoints.length} NASA MERRA-2 Grid Cells •{" "}
            <span className="font-mono font-bold text-cyan-300 tabular-nums">
              {activeCount} ({((activeCount / gridPoints.length) * 100).toFixed(1)}%)
            </span>{" "}
            {filterMode === "local" ? "Local Significant (p < 0.05)" : "FDR Significant (q < 0.05)"}
          </p>
        </div>

        {/* Filter Toggle & Dual-Channel Legend */}
        <div className="flex items-center flex-wrap gap-3 text-[11px] text-slate-300">
          <div
            role="radiogroup"
            aria-label="Significance Filter"
            className="flex items-center bg-obs-canvas border border-obs-borderSubtle rounded-lg p-0.5"
          >
            <button
              type="button"
              role="radio"
              aria-checked={filterMode === "local"}
              onClick={() => setFilterMode("local")}
              className={`min-h-[32px] px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                filterMode === "local"
                  ? "bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Local (p &lt; 0.05)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={filterMode === "fdr"}
              onClick={() => setFilterMode("fdr")}
              className={`min-h-[32px] px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                filterMode === "fdr"
                  ? "bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              FDR Control (q &lt; 0.05)
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block ring-2 ring-white/60"></span>
            <span>Significant</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-slate-600 border border-dashed border-slate-400 inline-block"></span>
            <span>Inconclusive</span>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="h-[440px] w-full rounded-xl overflow-hidden border border-obs-borderSubtle relative z-10">
        <MapContainer
          center={[11.1, 78.5]}
          zoom={7}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> & NASA'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {gridPoints.map((pt, idx) => {
            const color = getTrendColor(pt.sens_slope_per_decade, meta.identifier);
            const isMarkedSig =
              filterMode === "local"
                ? pt.is_significant
                : (pt.is_fdr_significant ?? pt.is_significant);
            return (
              <CircleMarker
                key={`grid-${idx}`}
                center={[pt.latitude, pt.longitude]}
                radius={isMarkedSig ? 12 : 8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isMarkedSig ? 0.9 : 0.4,
                  color: isMarkedSig ? "#ffffff" : "#64748b",
                  weight: isMarkedSig ? 2 : 1,
                  dashArray: isMarkedSig ? undefined : "3, 3",
                }}
              >
                <Popup className="custom-popup">
                  <div className="text-xs text-slate-900 p-1 space-y-1 min-w-[180px]">
                    <div className="font-bold border-b pb-1 text-slate-900 font-mono">
                      Grid: {pt.latitude.toFixed(2)}°N, {pt.longitude.toFixed(2)}°E
                    </div>
                    {pt.elevation_m !== null && pt.elevation_m !== undefined && (
                      <div className="text-[11px] text-slate-600 font-mono">
                        Elevation: {pt.elevation_m} m
                      </div>
                    )}
                    <div className="flex justify-between gap-3">
                      <span>Sen's Rate:</span>
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
                      <span>Local α=0.05:</span>
                      <span
                        className={`font-semibold ${
                          pt.is_significant ? "text-emerald-700" : "text-slate-600"
                        }`}
                      >
                        {pt.is_significant ? "Significant" : "Not Significant"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>FDR q=0.05:</span>
                      <span
                        className={`font-semibold ${
                          pt.is_fdr_significant ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {pt.is_fdr_significant ? "FDR Significant" : "Not Significant"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 border-t pt-1">
                      <span>Net Shift:</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-obs-surface2 p-3.5 rounded-xl border border-obs-borderSubtle">
        <div>
          <span className="text-slate-400 block">Domain Mean Rate:</span>
          <span className="font-mono font-bold tabular-nums text-slate-200">
            {formatSlope(summary.regional_mean_slope_per_decade, meta.units, "decade")}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Min Rate (Western Ghats):</span>
          <span className="font-mono font-bold tabular-nums text-blue-400">
            {formatSlope(summary.min_slope_per_decade, meta.units, "decade")}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Max Rate (Plains/Coast):</span>
          <span className="font-mono font-bold tabular-nums text-red-400">
            {formatSlope(summary.max_slope_per_decade, meta.units, "decade")}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">FDR Corrected Significant:</span>
          <span className="font-mono font-bold tabular-nums text-emerald-400">
            {summary.fdr_significant_count ?? summary.significant_cells_count} Cells (Benjamini-Hochberg)
          </span>
        </div>
      </div>
    </section>
  );
};
