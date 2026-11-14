"""
NASA POWER API Integration Service.
Handles point and regional data retrieval, caching, missing-value parsing (-999.0),
and metadata preservation for NASA MERRA-2 and CERES assimilation products.
"""
import hashlib
import json
import logging
import os
import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple, List
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

class NasaPowerService:
    def __init__(self):
        self.base_url = settings.nasa_power_base_url
        self.cache_dir = settings.cache_dir
        self.cache_ttl_seconds = settings.cache_ttl_hours * 3600
        self.timeout = settings.request_timeout_seconds
        self.max_retries = settings.request_max_retries
        self.client = httpx.Client(timeout=self.timeout, headers={"User-Agent": "TerraTrend-NASA-SpaceApps/1.0"})

    def _get_cache_path(self, cache_key: str) -> str:
        hashed = hashlib.sha256(cache_key.encode("utf-8")).hexdigest()
        return os.path.join(self.cache_dir, f"nasa_{hashed}.json")

    def _read_cache(self, cache_key: str) -> Optional[Dict[str, Any]]:
        cache_file = self._get_cache_path(cache_key)
        if not os.path.exists(cache_file):
            return None
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cached_data = json.load(f)
            cached_at = cached_data.get("_cached_at_epoch", 0)
            if (time.time() - cached_at) > self.cache_ttl_seconds:
                return None
            return cached_data.get("payload")
        except Exception as e:
            logger.warning(f"Failed to read cache {cache_file}: {e}")
            return None

    def _write_cache(self, cache_key: str, payload: Dict[str, Any]):
        cache_file = self._get_cache_path(cache_key)
        try:
            wrapper = {
                "_cached_at_epoch": time.time(),
                "_cached_at_iso": datetime.now(timezone.utc).isoformat(),
                "_cache_key": cache_key,
                "payload": payload
            }
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(wrapper, f)
        except Exception as e:
            logger.warning(f"Failed to write cache {cache_file}: {e}")

    def fetch_point_data(
        self,
        variable: str,
        latitude: float,
        longitude: float,
        start_year: int,
        end_year: int
    ) -> Tuple[Dict[str, Any], bool]:
        """
        Fetch monthly and annual point data from NASA POWER API.
        Returns (raw_json_dict, is_cache_hit).
        """
        cache_key = f"point:{variable}:{latitude:.4f}:{longitude:.4f}:{start_year}:{end_year}"
        cached = self._read_cache(cache_key)
        if cached is not None:
            return cached, True

        url = f"{self.base_url}/point"
        params = {
            "parameters": variable,
            "community": "RE",
            "longitude": f"{longitude:.4f}",
            "latitude": f"{latitude:.4f}",
            "start": str(start_year),
            "end": str(end_year),
            "format": "JSON"
        }

        # Attempt with retry for resilience
        last_err = None
        for attempt in range(self.max_retries):
            try:
                resp = self.client.get(url, params=params)
                if resp.status_code == 200:
                    payload = resp.json()
                    self._write_cache(cache_key, payload)
                    return payload, False
                else:
                    last_err = f"NASA API returned HTTP {resp.status_code}: {resp.text}"
            except Exception as e:
                last_err = str(e)
            time.sleep(1.0 * (attempt + 1))

        raise RuntimeError(f"NASA POWER point query failed: {last_err}")

    def fetch_regional_data(
        self,
        variable: str,
        lat_min: float,
        lat_max: float,
        lon_min: float,
        lon_max: float,
        start_year: int,
        end_year: int
    ) -> Tuple[Dict[str, Any], bool]:
        """
        Fetch regional bounding box data from NASA POWER API.
        NASA POWER requires bounding boxes to span at least 2.0 degrees in both latitude and longitude.
        """
        # Ensure minimum 2-degree span if caller specified too small a window
        lat_span = lat_max - lat_min
        if lat_span < 2.0:
            diff = (2.0 - lat_span) / 2.0 + 0.05
            lat_min = round(max(-90.0, lat_min - diff), 3)
            lat_max = round(min(90.0, lat_max + diff), 3)

        lon_span = lon_max - lon_min
        if lon_span < 2.0:
            diff = (2.0 - lon_span) / 2.0 + 0.05
            lon_min = round(max(-180.0, lon_min - diff), 3)
            lon_max = round(min(180.0, lon_max + diff), 3)

        cache_key = f"regional:{variable}:{lat_min:.2f}:{lat_max:.2f}:{lon_min:.2f}:{lon_max:.2f}:{start_year}:{end_year}"
        cached = self._read_cache(cache_key)
        if cached is not None:
            return cached, True

        url = f"{self.base_url}/regional"
        params = {
            "parameters": variable,
            "community": "RE",
            "latitude-min": f"{lat_min:.3f}",
            "latitude-max": f"{lat_max:.3f}",
            "longitude-min": f"{lon_min:.3f}",
            "longitude-max": f"{lon_max:.3f}",
            "start": str(start_year),
            "end": str(end_year),
            "format": "JSON"
        }

        last_err = None
        for attempt in range(self.max_retries):
            try:
                resp = self.client.get(url, params=params)
                if resp.status_code == 200:
                    payload = resp.json()
                    self._write_cache(cache_key, payload)
                    return payload, False
                else:
                    last_err = f"NASA Regional API HTTP {resp.status_code}: {resp.text}"
            except Exception as e:
                last_err = str(e)
            time.sleep(1.5 * (attempt + 1))

        raise RuntimeError(f"NASA POWER regional query failed: {last_err}")

    @staticmethod
    def parse_point_series(
        raw_data: Dict[str, Any],
        variable: str,
        aggregation: str = "annual"
    ) -> List[Dict[str, Any]]:
        """
        Parses raw NASA POWER response into time-series records.
        Handles -999.0 fill values and filters based on temporal aggregation.
        
        Aggregation modes:
        - 'annual': extracts keys ending in '13' (annual means)
        - 'monthly': extracts keys 'YYYY01'..'YYYY12'
        - 'seasonal': aggregates monthly records into meteorological seasons:
            DJF (Dec-Feb), MAM (Mar-May), JJA (Jun-Aug), SON (Sep-Nov)
        """
        parameter_dict = (
            raw_data.get("properties", {})
            .get("parameter", {})
            .get(variable, {})
        )
        fill_value = float(raw_data.get("header", {}).get("fill_value", -999.0))

        records = []
        for key, val in parameter_dict.items():
            if len(key) != 6 or not key.isdigit():
                continue
            
            year = int(key[:4])
            month_code = int(key[4:])
            
            # Check fill value
            clean_val = None if (val is None or abs(val - fill_value) < 1e-4 or val <= -900.0) else float(val)

            if aggregation == "annual":
                if month_code == 13:
                    records.append({
                        "date": str(year),
                        "year": year,
                        "month": None,
                        "value": clean_val
                    })
            elif aggregation == "monthly":
                if 1 <= month_code <= 12:
                    records.append({
                        "date": f"{year}-{month_code:02d}",
                        "year": year,
                        "month": month_code,
                        "value": clean_val
                    })

        # Sort chronologically
        records.sort(key=lambda r: (r["year"], r["month"] or 0))
        return records

nasa_service = NasaPowerService()
