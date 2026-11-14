import React from "react";
import { Thermometer, CloudRain, Wind, Sun, Droplets, Info } from "lucide-react";
import { VariableMetadata } from "@/types";

interface VariableSelectorProps {
  variables: Record<string, VariableMetadata>;
  selectedVariable: string;
  onSelectVariable: (varId: string) => void;
  disabled?: boolean;
}

const getVariableIcon = (id: string) => {
  switch (id) {
    case "T2M":
    case "T2M_MAX":
    case "T2M_MIN":
      return <Thermometer className="w-4 h-4 text-orange-400" />;
    case "PRECTOTCORR":
      return <CloudRain className="w-4 h-4 text-blue-400" />;
    case "WS10M":
      return <Wind className="w-4 h-4 text-teal-400" />;
    case "ALLSKY_SFC_SW_DWN":
      return <Sun className="w-4 h-4 text-amber-400" />;
    case "RH2M":
      return <Droplets className="w-4 h-4 text-cyan-400" />;
    default:
      return <Thermometer className="w-4 h-4 text-orange-400" />;
  }
};

export const VariableSelector: React.FC<VariableSelectorProps> = ({
  variables,
  selectedVariable,
  onSelectVariable,
  disabled = false,
}) => {
  const currentMeta = variables[selectedVariable];

  return (
    <div className="bg-[#0b1320] border border-slate-800/80 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>1. NASA Earth-Science Variable</span>
        </label>
        {currentMeta && (
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
            Units: {currentMeta.units}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {Object.entries(variables).map(([id, meta]) => {
          const isSelected = selectedVariable === id;
          return (
            <button
              key={id}
              onClick={() => onSelectVariable(id)}
              disabled={disabled}
              className={`flex flex-col text-left p-2.5 rounded-lg border transition-all text-xs ${
                isSelected
                  ? "bg-cyan-950/40 border-cyan-500/80 text-white shadow-md shadow-cyan-900/20 ring-1 ring-cyan-500/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  {getVariableIcon(id)}
                  {id}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {meta.units}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-200 line-clamp-1">
                {meta.name}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                {meta.original_source.includes("MERRA-2") ? "MERRA-2 Reanalysis" : "CERES Solar"}
              </span>
            </button>
          );
        })}
      </div>

      {currentMeta && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="line-clamp-2">
            <span className="text-slate-300 font-medium">Definition:</span> {currentMeta.description}
          </p>
          <span className="shrink-0 text-[11px] text-slate-500">
            Grid: {currentMeta.spatial_resolution}
          </span>
        </div>
      )}
    </div>
  );
};
