/**
 * Centralized Design Tokens & Scientific Visualization Configuration
 * Standards: Impeccable Design Guidelines & IBM Carbon Scientific Data Rules
 * WCAG 2.2 AA Contrast Compliant
 */

export const DESIGN_TOKENS = {
  // Scientific Surface Elevation Colors
  colors: {
    canvas: "#040810",         // Deep space canvas
    surface1: "#09111e",       // Elevated container background
    surface2: "#0f1c30",       // Interactive card background
    surface3: "#162742",       // Active / Hovered surface
    surfaceHighlight: "#1e3557",
    
    // Borders
    borderSubtle: "#162338",   // 1px structural dividing lines
    borderDefault: "#1e3352",  // Card borders
    borderFocus: "#38bdf8",    // 2px active focus ring
    
    // Typography Hierarchy
    textPrimary: "#f1f5f9",    // Slate 100: Headers & primary readouts (Contrast > 14:1)
    textSecondary: "#94a3b8",  // Slate 400: Metadata & explanations (Contrast > 6.8:1)
    textTertiary: "#64748b",   // Slate 500: Auxiliary units & micro-labels
    textMuted: "#475569",      // Slate 600: De-emphasized timestamps
    
    // Scientific Semantic Channels
    significant: {
      text: "#34d399",         // Emerald 400
      bg: "rgba(6, 78, 59, 0.4)",
      border: "rgba(16, 185, 129, 0.5)",
      solid: "#10b981",
    },
    inconclusive: {
      text: "#fbbf24",         // Amber 400
      bg: "rgba(120, 53, 15, 0.4)",
      border: "rgba(245, 158, 11, 0.5)",
      solid: "#f59e0b",
    },
    nonSignificant: {
      text: "#94a3b8",         // Slate 400
      bg: "rgba(30, 41, 59, 0.5)",
      border: "rgba(71, 85, 105, 0.5)",
      solid: "#64748b",
    },
    
    // Temperature & Flux Trends (Dual-Channel Color Scale)
    warming: {
      high: "#ef4444",         // > +0.25 °C/dec
      moderate: "#f97316",     // +0.15 to +0.25 °C/dec
      mild: "#f59e0b",         // +0.05 to +0.15 °C/dec
    },
    cooling: {
      mild: "#38bdf8",         // -0.05 to -0.15 °C/dec
      moderate: "#0284c7",     // -0.15 to -0.25 °C/dec
      strong: "#2563eb",       // < -0.25 °C/dec
    },
    neutral: "#10b981",        // -0.05 to +0.05 °C/dec
  },

  // Statistical & Scientific Thresholds
  scientific: {
    significanceAlpha: 0.05,
    fdrTargetQ: 0.05,
    minObservationYears: 5,
    defaultBaselineStart: 1981,
    defaultBaselineEnd: 2023,
    movingAverageWindowYears: 5,
  },

  // Numerical Display Precision Rules
  precision: {
    slopeDecadal: 3,           // e.g. +0.170 °C/decade
    slopeAnnual: 4,            // e.g. +0.0170 °C/year
    pvalue: 4,                 // e.g. 0.0279
    temperature: 2,            // e.g. 27.10 °C
    coordinates: 4,            // e.g. 11.0168° N
    anomaly: 2,                // e.g. +0.45 °C
    percentage: 1,             // e.g. 43.9%
  },

  // Dimensions & Accessibility Touch Targets
  dimensions: {
    minTouchTargetPx: 44,      // WCAG 2.2 AA target size minimum
    compactTargetPx: 36,       // Desktop compact control envelope
    chartHeightPx: 320,
    anomalyChartHeightPx: 180,
    mapHeightPx: 420,
  },
} as const;
