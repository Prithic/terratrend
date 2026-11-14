# TerraTrend — System Architecture Specification

## 1. System Overview

TerraTrend is architected as an asynchronous, decoupled full-stack scientific platform. It provides high-throughput ingestion of multi-decade NASA Earth-observation grids, evaluates non-parametric statistical trends, and serves high-density interactive scientific visualizations.

```
                           ┌───────────────────────────────┐
                           │          USER CLIENT          │
                           │  Modern Web Browser (Desktop) │
                           └───────────────┬───────────────┘
                                           │ HTTP / JSON
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             PRESENTATION TIER                                    │
│   Next.js 14 (App Router) + TypeScript 5 + Tailwind CSS + Lucide Icons           │
│                                                                                  │
│   ┌───────────────────────────┐  ┌───────────────────────────┐                   │
│   │   Earth Data Explorer     │  │  4 Essential Questions    │                   │
│   │   • Variable Selector     │  │  • Evidence Cards (1..4)  │                   │
│   │   • Location / Presets    │  │  • Synthesis & Confidence │                   │
│   │   • Temporal Controls     │  │  • Limitations Drawer     │                   │
│   └───────────────────────────┘  └───────────────────────────┘                   │
│   ┌───────────────────────────┐  ┌───────────────────────────┐                   │
│   │   Visualization Suite     │  │  Governance & Export      │                   │
│   │   • Recharts Trend Lines  │  │  • CSV Dataset Exporter   │                   │
│   │   • Climatology Anomalies │  │  • Markdown Report Maker  │                   │
│   │   • Leaflet Spatial Map   │  │  • Methodology Drawer     │                   │
│   └───────────────────────────┘  └───────────────────────────┘                   │
└──────────────────────────────────────────┬───────────────────────────────────────┘
                                           │ Next.js Rewrite / Reverse Proxy
                                           │ /api/* ──► http://127.0.0.1:8000/api/*
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             APPLICATION TIER                                     │
│   FastAPI + Pydantic v2 + Uvicorn ASGI                                           │
│                                                                                  │
│   ┌───────────────────────────┐  ┌───────────────────────────┐                   │
│   │   API Routing Layer       │  │  Scientific Insight Engine│                   │
│   │   • /api/variables        │  │  • Grounded Explanations  │                   │
│   │   • /api/locations        │  │  • Confidence Scoring     │                   │
│   │   • /api/trend/point      │  │  • Physical Limitations   │                   │
│   │   • /api/trend/regional   │  └───────────────────────────┘                   │
│   └─────────────┬─────────────┘                                                  │
│                 │                                                                │
│                 ▼                                                                │
│   ┌───────────────────────────────────────────────────────────┐                  │
│   │               Statistical Analysis Engine                 │                  │
│   │   • SciPy linregress (OLS Slope, Intercept, SE, R²)       │                  │
│   │   • PyMannKendall (Score S, Var(S), Z, p-value)           │                  │
│   │   • Sen's Slope Estimator (Median Pairwise Differences)   │                  │
│   │   • Rank-based 95% Confidence Intervals                   │                  │
│   │   • Lag-1 Autocorrelation (r₁) + Modified MK Correction   │                  │
│   │   • Benjamini-Hochberg False Discovery Rate (FDR = 0.05)  │                  │
│   └───────────────────────────────────────────────────────────┘                  │
└──────────────────────────────────────────┬───────────────────────────────────────┘
                                           │ HTTPX Async/Sync Client
                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              DATA PERSISTENCE & INGESTION                        │
│                                                                                  │
│   ┌───────────────────────────┐  ┌───────────────────────────┐                   │
│   │   Local Cache Storage     │  │  External NASA APIs       │                   │
│   │   • SHA-256 Hashed JSON   │  │  • NASA POWER Point API   │                   │
│   │   • 7-Day TTL Expiration  │  │  • NASA POWER Regional    │                   │
│   │   • Zero Synthetic Mocks  │  │  • MERRA-2 Assimilation   │                   │
│   └───────────────────────────┘  │  • CERES Solar Radiation  │                   │
│                                  └───────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Specifications

### A. Presentation Tier (Next.js 14)
- **App Router:** Fully typed page architecture in `frontend/src/app/`.
- **Zero-SSR Dynamic Imports:** Leaflet map components are loaded client-side via Next.js `dynamic(..., { ssr: false })` to protect against server hydration mismatch.
- **Styling:** Tailwind CSS with a custom scientific palette (`#030712` background, cyan and emerald accents, slate borders).
- **Reverse Proxy Routing:** `next.config.mjs` proxies `/api/:path*` to `http://127.0.0.1:8000/api/:path*`, allowing cross-origin requests in development and single-origin serving in production.

### B. Application Tier (FastAPI & Python 3.11)
- **FastAPI Framework:** High-performance asynchronous REST API with automatic OpenAPI / Swagger generation (`/docs`).
- **Pydantic Validation:** Strict request/response schema validation ensuring all numerical outputs adhere to scientific types.
- **Scientific Computing Libraries:**
  - `pandas` for time-series aggregation and rolling averages.
  - `numpy` for vector math and matrix operations.
  - `scipy.stats` for linear regression and normal distributions.
  - `pymannkendall` for rank-based monotonic trend tests and variance tie corrections.

### C. Data Ingestion & Caching Layer
- **NASA Client:** Encapsulates parameter formatting, query throttling, and error detection.
- **Fill-Value Filter:** Automatically intercepts `-999.0` fill values, converting them to `None`/`np.nan`.
- **Disk Cache:** Cached files are keyed by SHA-256 hash of query parameters. Expiration is controlled by `CACHE_TTL_HOURS` (default: 168 hours / 7 days).
