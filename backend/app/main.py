from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.agents.router import router as agents_router
from app.logs.router import router as logs_router
from app.malware.router import router as malware_router
from app.threats.router import router as threats_router
from app.dashboard.router import router as dashboard_router
from app.reports.router import router as reports_router

app = FastAPI(title="ThreatIQ Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(agents_router, prefix="/agents", tags=["Agents"])
app.include_router(logs_router, prefix="/agent/logs", tags=["Agent Logs"])
app.include_router(malware_router, prefix="/agent/malware", tags=["Agent Malware"])
app.include_router(threats_router, prefix="/threats", tags=["Threats"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(reports_router, prefix="/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {"message": "ThreatIQ Backend is running"}
