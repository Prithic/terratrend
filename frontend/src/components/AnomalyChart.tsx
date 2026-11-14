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

interface AnomalyChartProps {
  data: TimeSeriesPoint[];
  meta: VariableMetadata;
  baselineMean: number;
}

export const AnomalyChart: React.FC<AnomalyChartProps> = ({
  data,
  meta,
  baselineMean,
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload as TimeSeriesPoint;
      const anom = p.baseline_anomaly ?? 0;
      return (
        <div className="bg-[#0b1320] border border-slate-700/80 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-200">{p.date}</div>
          <div className="flex justify-between gap-3 text-slate-300">
            <span>Observed:</span>
            <span className="font-mono font-bold">{p.value} {meta.units}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Deviation:</span>
            <span className={`font-mono font-bold ${anom >= 0 ? "text-red-400" : "text-cyan-400"}`}>
              {anom >= 0 ? `+${anom}` : anom} {meta.units}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0b1320] border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Climatological Anomaly Distribution
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Baseline Mean: {baselineMean} {meta.units}
        </span>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: "#334155" }}
              unit={` ${meta.units}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
            <Bar dataKey="baseline_anomaly" name="Anomaly">
              {data.map((entry, index) => {
                const val = entry.baseline_anomaly ?? 0;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={val >= 0 ? "#f87171" : "#38bdf8"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
