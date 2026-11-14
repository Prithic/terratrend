"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";
import { TimeSeriesPoint, VariableMetadata } from "@/types";
import { BarChart3 } from "lucide-react";
import { formatAnomaly } from "@/utils/formatters";
import { AppAudienceMode, AppTheme } from "@/constants/design-tokens";

interface AnomalyChartProps {
  data: TimeSeriesPoint[];
  meta: VariableMetadata;
  baselineMean: number;
  theme?: AppTheme;
  audienceMode?: AppAudienceMode;
}

export const AnomalyChart: React.FC<AnomalyChartProps> = ({
  data,
  meta,
  baselineMean,
  theme = "editorial",
  audienceMode = "explore",
}) => {
  const isEditorial = theme === "editorial";

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload as TimeSeriesPoint;
      const anom = p.baseline_anomaly ?? 0;
      return (
        <div
          role="region"
          aria-label={`Anomaly for ${p.date}`}
          className={`border p-2.5 rounded-xl shadow-xl text-xs space-y-1 min-w-[190px] ${
            isEditorial
              ? "bg-white border-[#dedad2] text-stone-900 shadow-stone-300/40"
              : "bg-obs-surface2 border-obs-borderSubtle text-slate-100 shadow-xl"
          }`}
        >
          <div className={`font-bold border-b pb-1 ${isEditorial ? "border-stone-200 text-stone-900" : "border-obs-borderSubtle text-slate-200"}`}>
            {p.date}
          </div>
          <div className={`flex justify-between gap-3 ${isEditorial ? "text-stone-600" : "text-slate-300"}`}>
            <span>Observed:</span>
            <span className="font-mono font-bold tabular-nums">
              {p.value !== null && p.value !== undefined ? `${p.value.toFixed(2)} ${meta.units}` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Deviation:</span>
            <span
              className={`font-mono font-bold tabular-nums ${
                anom >= 0 ? "text-red-600" : "text-blue-600"
              }`}
            >
              {formatAnomaly(anom, meta.units)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      aria-label="Climatological Anomaly Distribution Chart"
      className={`rounded-2xl p-4 sm:p-5 shadow-sm border transition-colors space-y-3 ${
        isEditorial
          ? "bg-white border-[#e6e4df] text-stone-900 shadow-stone-200/50"
          : "bg-obs-surface1 border-obs-borderSubtle text-slate-100 shadow-black/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className={`w-4 h-4 ${isEditorial ? "text-blue-700" : "text-cyan-400"}`} />
          <h3 className={`text-sm font-bold ${isEditorial ? "text-stone-900" : "text-slate-100"}`}>
            Climatological Anomaly Distribution (Departures from Mean)
          </h3>
        </div>
        <span className={`text-[11px] font-mono tabular-nums ${isEditorial ? "text-stone-500" : "text-slate-400"}`}>
          Baseline Mean: {baselineMean.toFixed(2)} {meta.units}
        </span>
      </div>

      {/* Screen reader summary */}
      <div className="sr-only">
        <table>
          <caption>Anomalies relative to baseline climatology ({baselineMean.toFixed(2)} {meta.units})</caption>
          <thead>
            <tr>
              <th>Year</th>
              <th>Observed</th>
              <th>Anomaly</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.date}>
                <td>{entry.date}</td>
                <td>{entry.value}</td>
                <td>{entry.baseline_anomaly ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-[200px] w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isEditorial ? "#eceae5" : "#1e293b"} />
            <XAxis
              dataKey="date"
              stroke={isEditorial ? "#78716c" : "#64748b"}
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: isEditorial ? "#d6d3d1" : "#334155" }}
            />
            <YAxis
              stroke={isEditorial ? "#78716c" : "#64748b"}
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: isEditorial ? "#d6d3d1" : "#334155" }}
              unit={` ${meta.units}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke={isEditorial ? "#a8a29e" : "#475569"} strokeWidth={1.5} />
            <Bar dataKey="baseline_anomaly" name="Anomaly">
              {data.map((entry, index) => {
                const val = entry.baseline_anomaly ?? 0;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={val >= 0 ? "#ef4444" : "#0284c7"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
