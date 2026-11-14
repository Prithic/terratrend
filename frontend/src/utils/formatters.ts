/**
 * Centralized Scientific Numerical Formatters
 * Enforces consistent precision, signed deltas, and tabular numerical rendering.
 */
import { DESIGN_TOKENS } from "@/constants/design-tokens";

/**
 * Format a trend rate with explicit sign (+ or -) and units.
 */
export function formatSlope(
  rate: number,
  units: string,
  timeframe: "decade" | "year" = "decade"
): string {
  if (rate === null || rate === undefined || isNaN(rate)) return "N/A";
  const digits =
    timeframe === "decade"
      ? DESIGN_TOKENS.precision.slopeDecadal
      : DESIGN_TOKENS.precision.slopeAnnual;
  const sign = rate > 0 ? "+" : "";
  const unitSuffix = timeframe === "decade" ? `${units}/decade` : `${units}/yr`;
  return `${sign}${rate.toFixed(digits)} ${unitSuffix}`;
}

/**
 * Format non-parametric confidence intervals: e.g. [+0.023, +0.313] °C/decade
 */
export function formatConfidenceInterval(
  lower: number,
  upper: number,
  units: string
): string {
  if (isNaN(lower) || isNaN(upper)) return "[N/A, N/A]";
  const digits = DESIGN_TOKENS.precision.slopeDecadal;
  const fmt = (v: number) => (v > 0 ? `+${v.toFixed(digits)}` : v.toFixed(digits));
  return `[${fmt(lower)}, ${fmt(upper)}] ${units}/decade`;
}

/**
 * Format p-values with scientific notation thresholding: e.g. "< 0.0001" or "0.0279"
 */
export function formatPValue(p: number): string {
  if (p === null || p === undefined || isNaN(p)) return "N/A";
  if (p < 0.0001) return "< 0.0001";
  return p.toFixed(DESIGN_TOKENS.precision.pvalue);
}

/**
 * Format signed anomalies relative to baseline mean.
 */
export function formatAnomaly(anomaly: number | null | undefined, units: string): string {
  if (anomaly === null || anomaly === undefined || isNaN(anomaly)) return "N/A";
  const sign = anomaly > 0 ? "+" : "";
  return `${sign}${anomaly.toFixed(DESIGN_TOKENS.precision.anomaly)} ${units}`;
}

/**
 * Format coordinates: e.g. "13.0827° N, 80.2707° E"
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  const digits = DESIGN_TOKENS.precision.coordinates;
  return `${Math.abs(lat).toFixed(digits)}° ${latDir}, ${Math.abs(lon).toFixed(digits)}° ${lonDir}`;
}

/**
 * Maps a trend slope to the dual-channel qualitative color scale.
 */
export function getTrendColor(slopeDecadal: number, variableId: string): string {
  if (variableId.includes("T2M")) {
    if (slopeDecadal > 0.25) return DESIGN_TOKENS.colors.warming.high;
    if (slopeDecadal > 0.15) return DESIGN_TOKENS.colors.warming.moderate;
    if (slopeDecadal > 0.05) return DESIGN_TOKENS.colors.warming.mild;
    if (slopeDecadal > -0.05) return DESIGN_TOKENS.colors.neutral;
    if (slopeDecadal > -0.15) return DESIGN_TOKENS.colors.cooling.mild;
    if (slopeDecadal > -0.25) return DESIGN_TOKENS.colors.cooling.moderate;
    return DESIGN_TOKENS.colors.cooling.strong;
  }
  // Precipitation & other surface fluxes:
  if (slopeDecadal > 0.1) return "#06b6d4";
  if (slopeDecadal > 0.0) return "#38bdf8";
  if (slopeDecadal > -0.1) return "#f59e0b";
  return "#ef4444";
}
