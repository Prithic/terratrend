"""
Configuration settings for TerraTrend Backend.
"""
import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent
CACHE_DIR = PROJECT_ROOT / "data_cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    app_name: str = "TerraTrend API"
    app_version: str = "1.0.0"
    nasa_power_base_url: str = os.getenv(
        "NASA_POWER_BASE_URL", "https://power.larc.nasa.gov/api/temporal/monthly"
    )
    cache_dir: Path = CACHE_DIR
    cache_ttl_hours: int = int(os.getenv("CACHE_TTL_HOURS", "168"))  # 7 days default
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "*"
    ]

settings = Settings()
