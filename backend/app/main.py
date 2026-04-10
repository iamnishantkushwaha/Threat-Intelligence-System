from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes.alerts import router as alerts_router
from app.routes.analyze import router as analyze_router
from app.routes.logs import router as logs_router
from app.routes.summary import router as summary_router

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="FastAPI backend for log ingestion, rule-based detections, and AI-assisted threat summaries.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs_router)
app.include_router(analyze_router)
app.include_router(alerts_router)
app.include_router(summary_router)

@app.get("/")
def home():
    return {
        "message": "Backend running successfully",
        "service": settings.app_name,
        "endpoints": ["/logs", "/alerts", "/analyze", "/summary"],
    }
