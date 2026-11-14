"""
TerraTrend - NASA Earth System Trend Discovery and Intelligence Platform
Main FastAPI Application Entrypoint.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import router as api_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "TerraTrend provides rigorous Earth system trend discovery and intelligence "
        "leveraging official NASA MERRA-2 and CERES reanalysis assimilation data. "
        "Built for the 2026 NASA Space Apps Challenge ('Be an Earth System Trend Detective')."
    ),
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration with secure credential semantics
allow_credentials = "*" not in settings.cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": "TerraTrend",
        "description": "NASA Earth System Trend Discovery & Intelligence Platform",
        "challenge": "NASA Space Apps 2026 - Be an Earth System Trend Detective",
        "version": settings.app_version,
        "docs": "/docs",
        "endpoints": {
            "variables": "/api/variables",
            "locations": "/api/locations",
            "point_trend": "/api/trend/point",
            "regional_trend": "/api/trend/regional"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "TerraTrend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
