"""Exploratory analysis of an existing NASA POWER regional monthly cache.

This script does not verify the origin of a cache file. It computes annual
accumulation from rounded monthly mean daily rates and exports cell-level results.
"""
import argparse
import calendar
import csv
import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from scipy import stats


def annual_precipitation(values, year, fill=-999.0):
    """Return mm for a complete calendar year, otherwise None."""
    total = 0.0
    for month in range(1, 13):
        value = values.get(f"{year}{month:02d}")
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            return None
        value = float(value)
        if not math.isfinite(value) or value == fill or value < 0:
            return None
        total += value * calendar.monthrange(year, month)[1]
    return total


def analyze(cache_path, output_path):
    raw = Path(cache_path).read_bytes()
    wrapper = json.loads(raw)
    payload = wrapper["payload"]
    variable = "PRECTOTCORR"
    if payload.get("parameters", {}).get(variable, {}).get("units") != "mm/day":
        raise ValueError("Expected PRECTOTCORR monthly rates in mm/day")
    header = payload["header"]
    start, end = int(header["start"][:4]), int(header["end"][:4])
    rows = []
    seen = set()
    for feature in payload.get("features", []):
        coords = feature["geometry"]["coordinates"]
        lon, lat = float(coords[0]), float(coords[1])
        if (lat, lon) in seen:
            raise ValueError(f"Duplicate coordinate: {lat}, {lon}")
        seen.add((lat, lon))
        monthly = feature["properties"]["parameter"][variable]
        pairs = [(year, annual_precipitation(monthly, year, float(header.get("fill_value", -999)))) for year in range(start, end + 1)]
        valid = [(year, value) for year, value in pairs if value is not None]
        if len(valid) < 5:
            continue
        years, values = map(np.array, zip(*valid))
        # Kendall tau-b and an independent S/variance calculation with tie correction.
        n = len(values)
        s = sum(int(np.sign(values[j] - values[i])) for i in range(n - 1) for j in range(i + 1, n))
        _, counts = np.unique(values, return_counts=True)
        var = (n * (n - 1) * (2 * n + 5) - sum(t * (t - 1) * (2 * t + 5) for t in counts)) / 18
        z = (s - np.sign(s)) / math.sqrt(var) if s and var > 0 else 0.0
        p = float(2 * stats.norm.sf(abs(z)))
        slope = stats.theilslopes(values, years, alpha=0.95)
        rows.append(dict(cell_id=f"{lat:.4f},{lon:.4f}", latitude=lat, longitude=lon,
                         valid_years=n, missing_years=(end-start+1)-n,
                         slope_mm_per_year_per_decade=float(slope.slope*10),
                         ci_low=float(slope.low_slope*10), ci_high=float(slope.high_slope*10),
                         mk_z=z, p_value=p, direction="positive" if slope.slope > 0 else "negative" if slope.slope < 0 else "zero"))
    if not rows:
        raise ValueError("No valid cells")
    p = np.array([row["p_value"] for row in rows])
    bh = stats.false_discovery_control(p, method="bh")
    by = stats.false_discovery_control(p, method="by")
    for row, q_bh, q_by in zip(rows, bh, by):
        row.update(q_bh=float(q_bh), q_by=float(q_by), local_significant=row["p_value"] < .05,
                   bh_significant=q_bh <= .05, by_significant=q_by <= .05)
    rows.sort(key=lambda row: (row["latitude"], row["longitude"]))
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps({"source_sha256": hashlib.sha256(raw).hexdigest(), "cached_at": wrapper.get("_cached_at_iso"),
                      "analysis_at": datetime.now(timezone.utc).isoformat(), "header": header,
                      "cells":len(rows), "coordinates_min_max": [min(r['latitude'] for r in rows),max(r['latitude'] for r in rows),min(r['longitude'] for r in rows),max(r['longitude'] for r in rows)],
                      "positive":sum(r['direction']=='positive' for r in rows), "negative":sum(r['direction']=='negative' for r in rows),
                      "bh_positive":sum(r['direction']=='positive' and r['bh_significant'] for r in rows),
                      "bh_negative":sum(r['direction']=='negative' and r['bh_significant'] for r in rows),
                      "by_positive":sum(r['direction']=='positive' and r['by_significant'] for r in rows),
                      "by_negative":sum(r['direction']=='negative' and r['by_significant'] for r in rows),
                      "minimum":min(r['slope_mm_per_year_per_decade'] for r in rows),
                      "maximum":max(r['slope_mm_per_year_per_decade'] for r in rows)}, indent=2, default=lambda value: value.item() if isinstance(value, np.generic) else str(value)))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("cache")
    parser.add_argument("output")
    args = parser.parse_args()
    analyze(args.cache, args.output)
