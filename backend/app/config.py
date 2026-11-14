"""
Configuration settings for TerraTrend Backend.
"""
import os
from pathlib import Path
from typing import List
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent

# Resolve CACHE_DIR from environment variable if provided, else default to project_root/data_cache
_env_cache = os.getenv("CACHE_DIR")
if _env_cache:
    CACHE_DIR = Path(_env_cache).resolve()
else:
    CACHE_DIR = (PROJECT_ROOT / "data_cache").resolve()
CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Parse CORS_ORIGINS from environment variable (comma-separated), or default to explicit trusted origins
_env_cors = os.getenv("CORS_ORIGINS")
if _env_cors:
    DEFAULT_CORS_ORIGINS = [o.strip() for o in _env_cors.split(",") if o.strip()]
else:
    DEFAULT_CORS_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

class Settings(BaseModel):
    app_name: str = "TerraTrend API"
    app_version: str = "1.0.0"
    nasa_power_base_url: str = os.getenv(
        "NASA_POWER_BASE_URL", "https://power.larc.nasa.gov/api/temporal/monthly"
    )
    cache_dir: Path = CACHE_DIR
    cache_ttl_hours: int = int(os.getenv("CACHE_TTL_HOURS", "168"))  # 7 days default
    request_timeout_seconds: float = float(os.getenv("NASA_REQUEST_TIMEOUT", "45.0"))
    request_max_retries: int = int(os.getenv("NASA_MAX_RETRIES", "3"))
    cors_origins: List[str] = DEFAULT_CORS_ORIGINS

settings = Settings()
