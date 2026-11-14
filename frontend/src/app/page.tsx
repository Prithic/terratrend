"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ObservatoryConsole } from "@/components/ObservatoryConsole";
import { EssentialQuestionsCards } from "@/components/EssentialQuestionsCards";
import { TimeSeriesChart } from "@/components/TimeSeriesChart";
import { AnomalyChart } from "@/components/AnomalyChart";
import { StatisticsTable } from "@/components/StatisticsTable";
import { RegionalMap } from "@/components/RegionalMap";
import { MethodologyModal } from "@/components/MethodologyModal";
import { ExportReportModal } from "@/components/ExportReportModal";
import {
  VariableMetadata,
  LocationPreset,
  PointTrendResponse,
  RegionalTrendResponse,
} from "@/types";
import { AlertCircle } from "lucide-react";

export default function Home() {
  // Catalogs
  const [variables, setVariables] = useState<Record<string, VariableMetadata>>({});
  const [presets, setPresets] = useState<LocationPreset[]>([]);

  // Selection states
  const [selectedVariable, setSelectedVariable] = useState<string>("T2M");
  const [mode, setMode] = useState<"point" | "regional">("point");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("madurai");
  const [latitude, setLatitude] = useState<number>(9.9252);
  const [longitude, setLongitude] = useState<number>(78.1198);
  const [startYear, setStartYear] = useState<number>(1981);
  const [endYear, setEndYear] = useState<number>(2023);
  const [temporalAggregation, setTemporalAggregation] = useState<"annual" | "monthly">("annual");

  // Output data
  const [pointData, setPointData] = useState<PointTrendResponse | null>(null);
  const [regionalData, setRegionalData] = useState<RegionalTrendResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Fetch initial catalog on load
  useEffect(() => {
    async function initCatalog() {
      try {
        const [varRes, locRes] = await Promise.all([
          fetch("/api/variables"),
          fetch("/api/locations"),
        ]);
        if (varRes.ok && locRes.ok) {
          const varData = await varRes.json();
          const locData = await locRes.json();
          setVariables(varData);
          setPresets(locData.presets);

          // Find default Madurai preset
          const def = locData.presets.find((p: LocationPreset) => p.id === "madurai") || locData.presets[0];
          if (def) {
            setSelectedPresetId(def.id);
            setLatitude(def.latitude);
            setLongitude(def.longitude);
            // Auto run first analysis
            executePointAnalysis(def.latitude, def.longitude, "T2M", 1981, 2023, "annual");
          }
        }
      } catch (err: any) {
        console.error("Initialization error:", err);
      }
    }
    initCatalog();
  }, []);

  const handleSelectPreset = (preset: LocationPreset) => {
    setSelectedPresetId(preset.id);
    setLatitude(preset.latitude);
    setLongitude(preset.longitude);
    if (mode === "point") {
      executePointAnalysis(preset.latitude, preset.longitude, selectedVariable, startYear, endYear, temporalAggregation);
    }
  };

  const handleChangeCoordinates = (lat: number, lon: number) => {
    setLatitude(lat);
    setLongitude(lon);
    setSelectedPresetId("");
  };

  const handleSelectVariable = (varId: string) => {
    setSelectedVariable(varId);
    if (mode === "point") {
      executePointAnalysis(latitude, longitude, varId, startYear, endYear, temporalAggregation);
    } else {
      executeRegionalAnalysis(varId, startYear, endYear);
    }
  };

  const handleRunAnalysis = () => {
    if (mode === "point") {
      executePointAnalysis(latitude, longitude, selectedVariable, startYear, endYear, temporalAggregation);
    } else {
      executeRegionalAnalysis(selectedVariable, startYear, endYear);
    }
  };

  const executePointAnalysis = async (
    lat: number,
    lon: number,
    variable: string,
    sYear: number,
    eYear: number,
    agg: "annual" | "monthly"
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/trend/point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variable,
          latitude: lat,
          longitude: lon,
          start_year: sYear,
          end_year: eYear,
          temporal_aggregation: agg,
        }),
      });

      if (!resp.ok) {
        const errJson = await resp.json();
        throw new Error(errJson.detail || `Server error: ${resp.status}`);
      }

      const data = await resp.json();
      setPointData(data);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve NASA data and calculate statistical trend.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeRegionalAnalysis = async (
    variable: string,
    sYear: number,
    eYear: number
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/trend/regional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variable,
          lat_min: 8.5,
          lat_max: 13.5,
          lon_min: 76.5,
          lon_max: 80.5,
          start_year: sYear,
          end_year: eYear,
        }),
      });

      if (!resp.ok) {
        const errJson = await resp.json();
        throw new Error(errJson.detail || `Server error: ${resp.status}`);
      }

      const data = await resp.json();
      setRegionalData(data);
    } catch (err: any) {
      setError(err.message || "Failed to execute regional spatial analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-obs-canvas text-slate-100">
      <Header
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        cacheHit={pointData?.cache_hit}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Consolidated Scientific Observatory Console */}
        <ObservatoryConsole
          variables={variables}
          selectedVariable={selectedVariable}
          onSelectVariable={handleSelectVariable}
          mode={mode}
          onSelectMode={(newMode) => {
            setMode(newMode);
            if (newMode === "regional") {
              executeRegionalAnalysis(selectedVariable, startYear, endYear);
            }
          }}
          presets={presets}
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          latitude={latitude}
          longitude={longitude}
          onChangeCoordinates={handleChangeCoordinates}
          startYear={startYear}
          endYear={endYear}
          temporalAggregation={temporalAggregation}
          onStartYearChange={setStartYear}
          onEndYearChange={setEndYear}
          onAggregationChange={(agg) => {
            setTemporalAggregation(agg);
            if (mode === "point") {
              executePointAnalysis(latitude, longitude, selectedVariable, startYear, endYear, agg);
            }
          }}
          onRunAnalysis={handleRunAnalysis}
          isLoading={isLoading}
        />

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Scientific Pipeline Execution Error</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Point Station Results */}
        {mode === "point" && pointData && (
          <div className="space-y-6 animate-fadeIn">
            {/* The 4 Essential NASA Questions */}
            <EssentialQuestionsCards
              explanation={pointData.scientific_explanation}
              stats={pointData.statistics}
            />

            {/* Visualizations Grid */}
            <div className="grid grid-cols-1 gap-6">
              <TimeSeriesChart
                data={pointData.timeseries}
                meta={pointData.variable_metadata}
                stats={pointData.statistics}
                locationName={pointData.location.name}
              />

              <AnomalyChart
                data={pointData.timeseries}
                meta={pointData.variable_metadata}
                baselineMean={pointData.statistics.diagnostics.baseline_mean}
              />
            </div>

            {/* Statistics Matrix */}
            <StatisticsTable
              stats={pointData.statistics}
              meta={pointData.variable_metadata}
            />
          </div>
        )}

        {/* Regional Spatial Results */}
        {mode === "regional" && regionalData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Regional 4 Essential NASA Questions */}
            <EssentialQuestionsCards
              explanation={regionalData.scientific_explanation}
            />

            {/* Regional Map */}
            <RegionalMap
              gridPoints={regionalData.grid_points}
              meta={regionalData.variable_metadata}
              summary={regionalData.summary_statistics}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-obs-borderSubtle bg-obs-surface1 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            TerraTrend • Developed by CODEVERSE for the 2026 NASA Space Apps Challenge ("Be an Earth System Trend Detective")
          </p>
          <p className="text-[11px] text-slate-500">
            Powered by NASA Langley Research Center POWER Project & NASA GMAO MERRA-2 Atmospheric Reanalysis.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        pointData={pointData}
        regionalData={regionalData}
      />
    </div>
  );
}
