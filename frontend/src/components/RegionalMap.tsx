"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RegionalGridPoint, VariableMetadata, RegionalSummaryStatistics } from "@/types";
import { Map, Layers, CheckCircle2 } from "lucide-react";

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
  const [filterMode, setFilterMode] = useState<"local" | "fdr">("local");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#0b1320] border border-slate-800/80 rounded-xl p-8 text-center text-xs text-slate-400">
        Loading interactive Earth-science spatial map...
      </div>
    );
  }

  // Color generator based on slope and variable
  const getMarkerColor = (slope: number) => {
    if (meta.identifier.includes("T2M")) {
      // Temperature: warming (red), cooling (blue)
      if (slope > 0.25) return "#ef4444";
      if (slope > 0.15) return "#f97316";
      if (slope > 0.05) return "#f59e0b";
      if (slope > -0.05) return "#10b981";
      if (slope > -0.15) return "#38bdf8";
      return "#3b82f6";
    } else {
      // Precipitation / others: wet (teal/blue), dry (amber)
      if (slope > 0.1) return "#06b6d4";
      if (slope > 0.0) return "#38bdf8";
      if (slope > -0.1) return "#f59e0b";
      return "#ef4444";
    }
  };

  const activeCount = filterMode === "local" 
    ? summary.significant_cells_count 
    : (summary.fdr_significant_count ?? summary.significant_cells_count);

  return (
    <div className="bg-[#0b1320] border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Regional Spatial Trend Distribution Map
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {gridPoints.length} NASA MERRA-2 Grid Cells • {activeCount} ({((activeCount / gridPoints.length) * 100).toFixed(1)}%) {filterMode === "local" ? "Local Significant (p &lt; 0.05)" : "FDR Significant (q &lt; 0.05)"}
          </p>
        </div>

        {/* Filter Toggle & Legend */}
        <div className="flex items-center flex-wrap gap-3 text-[11px] text-slate-300">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setFilterMode("local")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                filterMode === "local" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Local (p &lt; 0.05)
            </button>
            <button
              onClick={() => setFilterMode("fdr")}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                filterMode === "fdr" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              FDR Adjusted (q &lt; 0.05)
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block ring-2 ring-white/50"></span>
            <span>Significant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-600 border border-dashed border-slate-400 inline-block"></span>
            <span>Inconclusive</span>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="h-[420px] w-full rounded-lg overflow-hidden border border-slate-800 relative z-10">
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
            const color = getMarkerColor(pt.sens_slope_per_decade);
            const isMarkedSig = filterMode === "local" ? pt.is_significant : (pt.is_fdr_significant ?? pt.is_significant);
            return (
              <CircleMarker
                key={`grid-${idx}`}
                center={[pt.latitude, pt.longitude]}
                radius={isMarkedSig ? 12 : 8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isMarkedSig ? 0.85 : 0.4,
                  color: isMarkedSig ? "#ffffff" : "#64748b",
                  weight: isMarkedSig ? 2 : 1,
                  dashArray: isMarkedSig ? undefined : "3, 3",
                }}
              >
                <Popup className="custom-popup">
                  <div className="text-xs text-slate-900 p-1 space-y-1">
                    <div className="font-bold border-b pb-1 text-slate-800">
                      Grid Cell: {pt.latitude.toFixed(2)}°N, {pt.longitude.toFixed(2)}°E
                    </div>
                    {pt.elevation_m !== null && pt.elevation_m !== undefined && (
                      <div className="text-[11px] text-slate-600">
                        Elevation: {pt.elevation_m} m
                      </div>
                    )}
                    <div className="flex justify-between gap-3">
                      <span>Sen's Rate:</span>
                      <span className="font-mono font-bold">
                        {pt.sens_slope_per_decade >= 0 ? `+${pt.sens_slope_per_decade}` : pt.sens_slope_per_decade} {meta.units}/dec
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Mann-Kendall p:</span>
                      <span className="font-mono font-bold">
                        {pt.mk_p_value.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Local α=0.05:</span>
                      <span className={`font-semibold ${pt.is_significant ? "text-emerald-700" : "text-slate-600"}`}>
                        {pt.is_significant ? "Significant" : "Not Significant"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>FDR q=0.05:</span>
                      <span className={`font-semibold ${pt.is_fdr_significant ? "text-emerald-700" : "text-amber-700"}`}>
                        {pt.is_fdr_significant ? "FDR Significant" : "Not Significant"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 border-t pt-1">
                      <span>Net Shift:</span>
                      <span className="font-mono font-bold">
                        {pt.total_change >= 0 ? `+${pt.total_change}` : pt.total_change} {meta.units}
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Regional Domain Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-slate-500 block">Domain Mean Rate:</span>
          <span className="font-mono font-bold text-slate-200">
            {summary.regional_mean_slope_per_decade >= 0 ? `+${summary.regional_mean_slope_per_decade}` : summary.regional_mean_slope_per_decade} {meta.units}/dec
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Min Rate (Western Ghats):</span>
          <span className="font-mono font-bold text-blue-400">
            {summary.min_slope_per_decade >= 0 ? `+${summary.min_slope_per_decade}` : summary.min_slope_per_decade} {meta.units}/dec
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Max Rate (Plains/Coast):</span>
          <span className="font-mono font-bold text-red-400">
            {summary.max_slope_per_decade >= 0 ? `+${summary.max_slope_per_decade}` : summary.max_slope_per_decade} {meta.units}/dec
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">FDR Corrected Significant:</span>
          <span className="font-mono font-bold text-emerald-400">
            {summary.fdr_significant_count ?? summary.significant_cells_count} Cells (Benjamini-Hochberg)
          </span>
        </div>
      </div>
    </div>
  );
};
