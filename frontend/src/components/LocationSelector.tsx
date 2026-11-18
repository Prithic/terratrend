import React from "react";
import { MapPin, Navigation, Grid } from "lucide-react";
import { LocationPreset } from "@/types";

interface LocationSelectorProps {
  mode: "point" | "regional";
  onSelectMode: (mode: "point" | "regional") => void;
  presets: LocationPreset[];
  selectedPresetId: string;
  onSelectPreset: (preset: LocationPreset) => void;
  latitude: number;
  longitude: number;
  onChangeCoordinates: (lat: number, lon: number) => void;
  disabled?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  mode,
  onSelectMode,
  presets,
  selectedPresetId,
  onSelectPreset,
  latitude,
  longitude,
  onChangeCoordinates,
  disabled = false,
}) => {
  return (
    <div className="bg-[#0b1320] border border-slate-800/80 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>2. Geographic Region</span>
        </label>

        {/* Mode Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => onSelectMode("point")}
            disabled={disabled}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              mode === "point"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Point Station</span>
          </button>
          <button
            onClick={() => onSelectMode("regional")}
            disabled={disabled}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              mode === "regional"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>Regional Grid</span>
          </button>
        </div>
      </div>

      {mode === "point" ? (
        <div className="space-y-3">
          {/* Global Climate Benchmarks */}
          {presets.filter((p) => p.category === "global").length > 0 && (
            <div>
              <div className="text-[11px] text-cyan-400 font-semibold mb-1.5 flex items-center gap-1">
                <span>Global Climate Benchmarks:</span>
                <span className="text-[10px] text-slate-400 font-normal">(Iconic Planetary Climate Signals)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
                {presets
                  .filter((p) => p.category === "global")
                  .map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => onSelectPreset(preset)}
                        disabled={disabled}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "bg-cyan-950/60 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50"
                            : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="text-xs font-semibold">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5" title={preset.state_or_country}>
                          {preset.state_or_country}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          {preset.latitude.toFixed(2)}°, {preset.longitude.toFixed(2)}°
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Regional Peninsular India Study */}
          <div>
            <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex items-center justify-between">
              <span>Regional Study (Southern Peninsular India):</span>
              <span className="text-[10px] text-slate-500 font-mono">7 Station Network</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
              {presets
                .filter((p) => p.category !== "global")
                .map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onSelectPreset(preset)}
                      disabled={disabled}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "bg-cyan-950/50 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/40"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="text-xs font-semibold">{preset.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {preset.latitude.toFixed(2)}°, {preset.longitude.toFixed(2)}°
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Coordinate Manual Overrides */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
            <div>
              <label className="text-[11px] font-medium text-slate-400">
                Latitude (°N)
              </label>
              <input
                type="number"
                step="0.01"
                min="-90"
                max="90"
                value={latitude}
                disabled={disabled}
                onChange={(e) => onChangeCoordinates(parseFloat(e.target.value) || 0, longitude)}
                className="mt-1 w-full bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400">
                Longitude (°E)
              </label>
              <input
                type="number"
                step="0.01"
                min="-180"
                max="180"
                value={longitude}
                disabled={disabled}
                onChange={(e) => onChangeCoordinates(latitude, parseFloat(e.target.value) || 0)}
                className="mt-1 w-full bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-cyan-300">
              Regional Grid: Tamil Nadu area bounding box
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              NASA MERRA-2 Native Grid (0.5° × 0.625°)
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            A rectangular selection that may include neighbouring regions and offshore cells.
          </p>
        </div>
      )}
    </div>
  );
};
