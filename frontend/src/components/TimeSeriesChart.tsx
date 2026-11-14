import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { TimeSeriesPoint, VariableMetadata, TrendStatistics } from "@/types";
import { TrendingUp, Layers } from "lucide-react";

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  meta: VariableMetadata;
  stats: TrendStatistics;
  locationName: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  meta,
  stats,
  locationName,
}) => {
  const [showSensSlope, setShowSensSlope] = useState(true);
  const [showOLS, setShowOLS] = useState(true);
  const [show5YrAvg, setShow5YrAvg] = useState(true);
  const [showBaseline, setShowBaseline] = useState(true);

  const baselineMean = stats.diagnostics.baseline_mean;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload as TimeSeriesPoint;
      return (
        <div className="bg-[#0b1320] border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">
            {pData.date} ({locationName})
          </div>
          <div className="flex justify-between items-center text-cyan-400">
            <span>Observed:</span>
            <span className="font-mono font-bold">
              {pData.value !== null ? `${pData.value} ${meta.units}` : "N/A"}
            </span>
          </div>
          {pData.baseline_anomaly !== null && pData.baseline_anomaly !== undefined && (
            <div className="flex justify-between items-center text-slate-300">
              <span>Anomaly:</span>
              <span className={`font-mono font-medium ${pData.baseline_anomaly >= 0 ? "text-red-400" : "text-blue-400"}`}>
                {pData.baseline_anomaly >= 0 ? `+${pData.baseline_anomaly}` : pData.baseline_anomaly} {meta.units}
              </span>
            </div>
          )}
          {pData.sens_trend_value && showSensSlope && (
            <div className="flex justify-between items-center text-emerald-400">
              <span>Sen's Trend:</span>
              <span className="font-mono">{pData.sens_trend_value} {meta.units}</span>
            </div>
          )}
          {pData.ols_trend_value && showOLS && (
            <div className="flex justify-between items-center text-indigo-400">
              <span>OLS Fit:</span>
              <span className="font-mono">{pData.ols_trend_value} {meta.units}</span>
            </div>
          )}
          {pData.rolling_mean_5yr && show5YrAvg && (
            <div className="flex justify-between items-center text-amber-400">
              <span>5-Yr Mean:</span>
              <span className="font-mono">{pData.rolling_mean_5yr} {meta.units}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0b1320] border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Historical Time-Series & Statistical Trend Lines
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {meta.name} ({meta.units}) at {locationName} • Sen's Rate:{" "}
            <span className="text-cyan-300 font-mono font-bold">
              {stats.sens_slope_per_decade >= 0 ? `+${stats.sens_slope_per_decade}` : stats.sens_slope_per_decade} {meta.units}/dec
            </span>
          </p>
        </div>

        {/* Toggle Layers */}
        <div className="flex items-center flex-wrap gap-2 text-[11px]">
          <span className="text-slate-500 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3" />
            Layers:
          </span>
          <label className="flex items-center gap-1 text-emerald-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showSensSlope}
              onChange={(e) => setShowSensSlope(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span>Sen's Slope</span>
          </label>
          <label className="flex items-center gap-1 text-indigo-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showOLS}
              onChange={(e) => setShowOLS(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
            />
            <span>OLS Fit</span>
          </label>
          <label className="flex items-center gap-1 text-amber-400 cursor-pointer">
            <input
              type="checkbox"
              checked={show5YrAvg}
              onChange={(e) => setShow5YrAvg(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>5-Yr Mean</span>
          </label>
          <label className="flex items-center gap-1 text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showBaseline}
              onChange={(e) => setShowBaseline(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-slate-500 focus:ring-0"
            />
            <span>Baseline Mean</span>
          </label>
        </div>
      </div>

      {/* Recharts Plot */}
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickLine={{ stroke: "#334155" }}
              domain={["auto", "auto"]}
              unit={` ${meta.units}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              iconType="circle"
            />

            {/* Baseline Climatology Reference Line */}
            {showBaseline && (
              <ReferenceLine
                y={baselineMean}
                stroke="#64748b"
                strokeDasharray="4 4"
                label={{
                  value: `Mean: ${baselineMean} ${meta.units}`,
                  position: "insideTopRight",
                  fill: "#94a3b8",
                  fontSize: 10,
                }}
              />
            )}

            {/* Observed Observations */}
            <Line
              type="monotone"
              dataKey="value"
              name="NASA Observed"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{ r: 3, fill: "#38bdf8" }}
              activeDot={{ r: 5 }}
            />

            {/* Sen's Slope Trend */}
            {showSensSlope && (
              <Line
                type="linear"
                dataKey="sens_trend_value"
                name="Sen's Slope Trend"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
              />
            )}

            {/* OLS Linear Regression */}
            {showOLS && (
              <Line
                type="linear"
                dataKey="ols_trend_value"
                name="OLS Linear Regression"
                stroke="#818cf8"
                strokeWidth={1.8}
                strokeDasharray="5 5"
                dot={false}
              />
            )}

            {/* 5-Year Running Average */}
            {show5YrAvg && (
              <Line
                type="monotone"
                dataKey="rolling_mean_5yr"
                name="5-Yr Running Mean"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
