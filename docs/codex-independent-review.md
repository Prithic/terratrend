# TerraTrend independent review — 14 November 2026

## Executive summary

**Release status: NOT READY.** This is a partial independent audit, not a scientific reproduction. The previous 66-cell precipitation, wind and city-temperature findings remain unverified. The production build succeeds and deterministic statistics/catalog tests pass, but a live NASA run, complete scientific audit, browser review, container smoke test and public deployment have not been completed. Historic scientific documents carry warnings because they contain claims that have not been checked.

## Scientific verification and precipitation

The implementation extracts POWER `YYYY13` annual values and labels PRECTOTCORR in mm/day. This is an annual rate, not annual accumulation. A previous UI multiplied a fitted slope by 365.25 and presented it as an annual accumulation slope; this was removed. A defensible accumulation calculation requires each complete year's 12 monthly mean daily rates multiplied by calendar days in each month, with leap years, missing and fill values handled explicitly. It then needs an independent comparison to NASA data. This calculation is **not implemented or validated**; the prior +120.3 and -159.8 mm/year/decade, and 55/11 and 14/4 counts, are not independently reproduced. No cell-level reproduction table or BY sensitivity run exists yet. Do not publish the previous dipole or wind-stilling claims as verified findings.

NASA says monthly and annual service output includes average, maximum and minimum values, and its processing derives monthly values from daily and annual from monthly. Parameter-specific metadata and a real API response still need verification before deriving totals. Sources: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/ and https://power.larc.nasa.gov/docs/methodology/data/processing/ . NASA describes distinct meteorological and solar sources: https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/ and https://power.larc.nasa.gov/docs/methodology/data/sources_fluxes/ . Existing metadata must be audited for all seven variables, particularly solar coverage and resolution; do not infer all seven are one instrument.

## Geography and statistics

The study used a rectangle, not an administrative boundary. The selected NASA features may include adjacent states and sea; no independently checked boundary mask or cell inventory was obtained. The application now labels the regional preset as a bounding box. Counts and cell coordinates still require independent verification.

Point and regional Sen slopes now use actual calendar years via SciPy Theil–Sen, including gaps; point confidence intervals use SciPy. Estimated period change now uses elapsed years. A synthetic gap-year test checks this. The modified Mann–Kendall, confidence intervals under serial dependence, spatial dependence, missing years, tie handling and independent benchmarks still require fuller validation. Regional BH is per request and variable across accepted cells; it does not control discoveries across variables. Neighbouring-cell dependence and post-selection limit interpretation; BY sensitivity and q-values are outstanding. The regional code uses unadjusted MK while point significance can use a modified test; results are not interchangeable. Rounding before some presentation and unverified minimum data requirements remain risks.

Monthly point trend analysis was disabled because the implementation used repeated calendar years as regression x values and did not account for seasonality. Seasonal mode was not implemented. UI and API now restrict analysis to annual data. Regional failure no longer silently invents a zero slope. More work is required on missing-year autocorrelation, full temporal completeness, regional CI/q-values and robust error handling. Auto-generated geographical and causal claims were reduced but the remaining insight text and metadata require review.

## Engineering and experience

Initial Git state was clean on `master`, HEAD `2b5eeb6`, ten commits, no configured remote. No history was rewritten. This review leaves local changes uncommitted for inspection. A root-level `python -m pytest backend/tests -q` failed collection because `app` was not on PYTHONPATH; CI sets PYTHONPATH. The full suite with PYTHONPATH reached live network tests and did not complete in the available audit; it was interrupted. Live tests are not separated from CI, and historical tests assert fixed discoveries. Run deterministic tests with:

```powershell
$env:PYTHONPATH='backend'
python -m pytest backend/tests/test_statistics.py backend/tests/test_catalog_metadata.py -q
```

Result after changes: **9 passed**. Synthetic cases are explicitly test data. Frontend `npm run build` passed (installed Next.js 14.2.35). `npm run lint` opened an interactive configuration prompt and exited unsuccessfully: ESLint is not configured. Docker CLI is installed but its Linux engine was unavailable; `docker compose config --quiet` succeeded with an obsolete version warning. Container build/start, networking, health and shutdown were not tested. Compose supplies CACHE_DIR and CORS_ORIGINS but backend config currently ignores them, and wildcard CORS is configured with credentials. Live endpoint and cache/uncached paths, all seven variables and earlier failed health/precipitation logs remain to be investigated.

The existing light/dark and Explore/Research implementations and prior screenshots were identified, but browser interactions, responsive states, accessibility and WCAG conformance were not independently tested. A production build is not an accessibility audit.

## Deployment and submission

No configured Git remote or verified public demo URL was found. No deployment, public link, demo video, team credits verification, AI disclosure or final submission package was completed. No public availability is claimed. Hosting choice, credentials and real repository URL are needed for publication.

## Acceptance checklist

| Criterion | Status | Evidence or blocker |
|---|---|---|
| Challenge objectives | BLOCKED | Functional workflow needs live end-to-end review |
| Production outputs backed by NASA | BLOCKED | Live retrieval and every variable not independently verified |
| Precipitation aggregation | FAIL | Annual accumulation calculation and independent comparison missing |
| Spatial boundary and cell counts | FAIL | Rectangle only; inventory and independent count missing |
| Trend classifications | BLOCKED | Corrections made; regional completeness and significance need verification |
| FDR scope and adjusted significance | FAIL | Per-variable scope identified; q-values and dependence sensitivity missing |
| Trend magnitudes and units | FAIL | Removed invalid UI conversion; full reproduction missing |
| Natural-language insights | FAIL | Some unsupported text removed; comprehensive review remains |
| Explore and Research modes | BLOCKED | Browser verification pending |
| Intuitive and accessible UI | BLOCKED | Responsive and WCAG audit pending |
| Backend tests | BLOCKED | 9 deterministic tests passed; full live suite interrupted |
| Frontend build | PASS | `npm run build` succeeded after changes |
| API and Docker smoke | BLOCKED | Docker daemon unavailable; live API checks incomplete |
| README and methodology | FAIL | Warnings added; substantive source and method rewrite needed |
| Repository history | PASS | Existing commits preserved |
| Public demo or exact blocker | PASS | No configured remote or tested deployment; hosting and credentials required |
| Submission package | FAIL | Materials and verified URLs not prepared |

## Next actions

1. Obtain NASA responses and archive request metadata and retrieval times; implement and test complete-year precipitation accumulation, independently compare results, and reproduce the entire rectangle including cell-level BH/BY and confidence intervals.
2. Audit each variable against NASA parameter metadata and fix inconsistent source, resolution and temporal claims. Independently reproduce temperature and wind analyses.
3. Separate live tests from deterministic CI, configure lint, review remaining insights, and test missing data and API errors. Fix container configuration and smoke test when Docker is running.
4. Test both modes, themes, maps and responsive accessibility in a browser; replace unverified documentation with reproducible evidence.
5. Configure a real Git remote and select a hosting provider; public deployment and submission require the user's credentials and final publication decisions.


## Follow-up: cached precipitation analysis

A separate exploratory script now calculates calendar-year precipitation accumulation from the 12 monthly rates: sum of rate × actual month length. It rejects incomplete years and invalid, negative or fill values. Synthetic tests cover leap and common years, missing months and invalid values. The production API still reports NASA's annual mean precipitation rate in mm/day; it has not been changed to report these accumulation results.

A cached regional payload, timestamped 2026-11-14T15:10:43Z and declaring POWER Monthly and Annual API v2.10.0, MERRA2, 1981–2023 and mm/day, was analysed. SHA-256 of the cache wrapper: `32f4bf5bb3b088e59fea5fd7f3ab36aeaf13c7f6eb3211c40df5c6c7c6c5b13c`. The cache was generated before this audit and its original request and provenance were not independently established. A fresh point request failed DNS resolution (`getaddrinfo failed`). These are preliminary cache-based results, not independent NASA verification.

The payload contains 66 unique coordinates spanning 8.5–13.5° latitude and 76.875–80.0° longitude. No administrative boundary mask was applied. With per-cell two-sided Mann–Kendall tests and per-variable FDR at 0.05, 55 estimated slopes are positive and 11 negative; BH flags 14 positive and 4 negative, while the more conservative Benjamini–Yekutieli procedure flags 2 positive and 0 negative. Extremes are approximately -161.6 and +119.9 mm/year per decade. These results differ from the old conversion-based extrema. Inference uses ordinary MK and unadjusted Theil–Sen confidence intervals; it does not correct serial correlation. Rounded monthly input rates also limit precision. Spatial dependence and selection after exploring several variables limit the interpretation of significance.

The cell table is [precipitation_cached_exploratory_cells.csv](precipitation_cached_exploratory_cells.csv). It includes valid-year counts, estimates, intervals, Z, p, BH and BY adjusted values and flags. Reproduce using the same locally available cache:

```powershell
python backend/scripts/analyze_cached_precipitation.py data_cache/nasa_97fb8f2f52b01a55957e2daab82ab4306036331f0db385bc9509febe43cb7c1a.json docs/precipitation_cached_exploratory_cells.csv
$env:PYTHONPATH='backend'
python -m pytest backend/tests/test_precipitation_aggregation.py backend/tests/test_statistics.py backend/tests/test_catalog_metadata.py -q
```

The cache is ignored by Git, so another researcher must retrieve and verify the input independently. Fresh NASA monthly and daily/annual comparisons, an independently verified regional selection, uncertainty and missingness review, wind and temperature reproduction remain outstanding. The 17 deterministic tests passed; the scientific and release checklist above remains unresolved.


## Sprint 3 — fresh retrieval attempt

An uncached point request was attempted on 14 November 2026. URL: `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=PRECTOTCORR&community=RE&longitude=78.1198&latitude=9.9252&start=2020&end=2020&format=JSON`. The Python HTTP client failed DNS resolution (`httpx.ConnectError: [Errno 11001] getaddrinfo failed`); `Resolve-DnsName` reported access denied. No HTTP response, retrieval timestamp, response hash or fresh NASA metadata exists. This does not establish a NASA outage. The regional call was not attempted because the required small point request did not succeed. Fresh-versus-cache comparison, fresh wind and temperature reproduction and independent boundary validation are blocked.

The cached payload declares MERRA2, POWER Monthly and Annual API v2.10.0, PRECTOTCORR in mm/day, local solar time, 1981–2023. Its canonical sorted JSON payload SHA-256 is `3ee443dafe0098429291ac02c07a0e494680fc5dce45f06d0fb551caa6d3f4f1`; this is not a hash of original HTTP bytes. In all 2,838 cached cell-years (66 × 43), every month was present and nonnegative; day-weighted monthly means differed from the same cached annual rate by a mean 0.002490 mm/day and maximum 0.004986 mm/day. This is an internal consistency check, not an independent NASA comparison. No fresh provenance or scientific sign-off is claimed.

A fresh-capture helper does not use cache and writes the exact response bytes and a manifest including URL, parameters, UTC time, response hash and NASA metadata to a new directory. Once network access is available, run point first, then regional:

```powershell
python backend/scripts/capture_nasa_power.py point data_cache/fresh_point --start 2020 --end 2020
python backend/scripts/capture_nasa_power.py regional data_cache/fresh_regional --start 1981 --end 2023
```

The helper saves raw data separately from the historical cache-wrapper format, so adaptation/comparison and provenance checks are still required before passing fresh data into the existing analysis script. Raw data is ignored by Git. Do not run the regional request until point retrieval succeeds. No administrative boundary mask was verified. The existing result remains an exploratory rectangular regional analysis; BY results do not support claiming an FDR-significant negative trend at 0.05.
