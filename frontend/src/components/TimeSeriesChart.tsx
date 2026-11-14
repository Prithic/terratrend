"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { TimeSeriesPoint, VariableMetadata, TrendStatistics } from "@/types";
import { TrendingUp, Layers } from "lucide-react";
import { formatSlope, formatAnomaly } from "@/utils/formatters";

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

  // Custom Accessible Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload as TimeSeriesPoint;
      return (
        <div
          role="region"
          aria-label={`Observations for ${pData.date}`}
          className="bg-obs-surface2 border border-obs-borderSubtle p-3 rounded-lg shadow-2xl text-xs space-y-1.5 min-w-[210px]"
        >
          <div className="font-bold text-slate-200 border-b border-obs-borderSubtle pb-1">
            {pData.date} ({locationName})
          </div>
          <div className="flex justify-between items-center text-cyan-400">
            <span>Observed:</span>
            <span className="font-mono font-bold tabular-nums">
              {pData.value !== null && pData.value !== undefined ? `${pData.value.toFixed(2)} ${meta.units}` : "N/A"}
            </span>
          </div>
          {pData.baseline_anomaly !== null && pData.baseline_anomaly !== undefined && (
            <div className="flex justify-between items-center text-slate-300">
              <span>Anomaly:</span>
              <span
                className={`font-mono font-medium tabular-nums ${
                  pData.baseline_anomaly >= 0 ? "text-red-400" : "text-blue-400"
                }`}
              >
                {formatAnomaly(pData.baseline_anomaly, meta.units)}
              </span>
            </div>
          )}
          {pData.sens_trend_value != null && showSensSlope && (
            <div className="flex justify-between items-center text-emerald-400">
              <span>Sen's Trend:</span>
              <span className="font-mono tabular-nums">{pData.sens_trend_value.toFixed(2)} {meta.units}</span>
            </div>
          )}
          {pData.ols_trend_value != null && showOLS && (
            <div className="flex justify-between items-center text-indigo-400">
              <span>OLS Fit:</span>
              <span className="font-mono tabular-nums">{pData.ols_trend_value.toFixed(2)} {meta.units}</span>
            </div>
          )}
          {pData.rolling_mean_5yr != null && show5YrAvg && (
            <div className="flex justify-between items-center text-amber-400">
              <span>5-Yr Mean:</span>
              <span className="font-mono tabular-nums">{pData.rolling_mean_5yr.toFixed(2)} {meta.units}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section
      aria-label="Historical Time-Series and Trend Line Chart"
      className="bg-obs-surface1 border border-obs-borderSubtle rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
    >
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
            <span className="text-cyan-300 font-mono font-bold tabular-nums">
              {formatSlope(stats.sens_slope_per_decade, meta.units, "decade")}
            </span>
          </p>
        </div>

        {/* Toggle Layers */}
        <div className="flex items-center flex-wrap gap-2 text-[11px]">
          <span className="text-slate-500 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3" />
            Layers:
          </span>
          <label className="flex items-center gap-1.5 text-emerald-400 cursor-pointer min-h-[30px] px-1.5 py-0.5 rounded hover:bg-slate-800/50">
            <input
              type="checkbox"
              checked={showSensSlope}
              onChange={(e) => setShowSensSlope(e.target.checked)}
              className="rounded bg-obs-canvas border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Sen's Slope</span>
          </label>
          <label className="flex items-center gap-1.5 text-indigo-400 cursor-pointer min-h-[30px] px-1.5 py-0.5 rounded hover:bg-slate-800/50">
            <input
              type="checkbox"
              checked={showOLS}
              onChange={(e) => setShowOLS(e.target.checked)}
              className="rounded bg-obs-canvas border-slate-700 text-indigo-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>OLS Fit</span>
          </label>
          <label className="flex items-center gap-1.5 text-amber-400 cursor-pointer min-h-[30px] px-1.5 py-0.5 rounded hover:bg-slate-800/50">
            <input
              type="checkbox"
              checked={show5YrAvg}
              onChange={(e) => setShow5YrAvg(e.target.checked)}
              className="rounded bg-obs-canvas border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>5-Yr Mean</span>
          </label>
          <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer min-h-[30px] px-1.5 py-0.5 rounded hover:bg-slate-800/50">
            <input
              type="checkbox"
              checked={showBaseline}
              onChange={(e) => setShowBaseline(e.target.checked)}
              className="rounded bg-obs-canvas border-slate-700 text-slate-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Baseline</span>
          </label>
        </div>
      </div>

      {/* Screen reader data table for accessibility */}
      <div className="sr-only">
        <table>
          <caption>
            Annual observations and trend values for {meta.name} at {locationName}
          </caption>
          <thead>
            <tr>
              <th>Year</th>
              <th>Observed ({meta.units})</th>
              <th>Sen's Trend ({meta.units})</th>
              <th>OLS Trend ({meta.units})</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pt) => (
              <tr key={pt.date}>
                <td>{pt.date}</td>
                <td>{pt.value}</td>
                <td>{pt.sens_trend_value ?? "N/A"}</td>
                <td>{pt.ols_trend_value ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recharts Plot */}
      <div className="h-[340px] w-full" aria-hidden="true">
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
                  value: `Mean: ${baselineMean.toFixed(2)} ${meta.units}`,
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
    </section>
  );
};
