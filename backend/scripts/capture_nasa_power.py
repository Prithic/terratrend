"""Capture an uncached NASA POWER response and its provenance locally.

Run point first, then regional. Output directories must be new so captures are
never silently overwritten. No cached response is consulted.
"""
import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

import httpx

BASE = "https://power.larc.nasa.gov/api/temporal/monthly"


def capture(kind, output, variable, start, end):
    if kind == "point":
        params = {"parameters": variable, "community": "RE", "longitude": "78.1198",
                  "latitude": "9.9252", "start": str(start), "end": str(end), "format": "JSON"}
    else:
        params = {"parameters": variable, "community": "RE", "latitude-min": "8.500",
                  "latitude-max": "13.500", "longitude-min": "76.500", "longitude-max": "80.500",
                  "start": str(start), "end": str(end), "format": "JSON"}
    request = httpx.Request("GET", f"{BASE}/{kind}", params=params)
    print(f"Request: {request.url}", flush=True)
    with httpx.Client(timeout=120.0, headers={"User-Agent": "TerraTrend-scientific-verification/1.0"}) as client:
        response = client.send(request)
    retrieved = datetime.now(timezone.utc).isoformat()
    response.raise_for_status()
    payload = response.json()
    metadata = payload.get("parameters", {}).get(variable)
    if not metadata or "header" not in payload:
        raise ValueError("Response does not contain expected parameter and header metadata")
    path = Path(output)
    path.mkdir(parents=True, exist_ok=False)
    body = response.content
    (path / "response.json").write_bytes(body)
    manifest = {"retrieved_at_utc": retrieved, "request_url": str(request.url), "request_parameters": params,
                "http_status": response.status_code, "response_sha256": hashlib.sha256(body).hexdigest(),
                "response_bytes": len(body), "api_header": payload["header"], "parameter_metadata": metadata}
    (path / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("kind", choices=["point", "regional"])
    p.add_argument("output", help="new output directory; do not commit raw data")
    p.add_argument("--variable", default="PRECTOTCORR")
    p.add_argument("--start", type=int, default=1981)
    p.add_argument("--end", type=int, default=2023)
    a = p.parse_args()
    capture(a.kind, a.output, a.variable, a.start, a.end)
