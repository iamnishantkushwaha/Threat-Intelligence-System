from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.agents.router import router as agents_router
from app.logs.router import router as logs_router
from app.malware.router import router as malware_router
from app.threats.router import router as threats_router
from app.dashboard.router import router as dashboard_router
from app.reports.router import router as reports_router
from app.email.router import router as email_router
from app.breach.router import router as breach_router
from app.intel.router import router as intel_router
from app.websockets import manager
from fastapi import WebSocket, WebSocketDisconnect
from app.auth.utils import get_current_user
import json
from app.database import init_db
from app.agents.router import monitor_agent_health
import asyncio
from datetime import datetime
from jose import jwt
from app.config import get_settings

app = FastAPI(title="ThreatIQ Backend")

@app.on_event("startup")
async def startup_db_client():
    await init_db()
    asyncio.create_task(monitor_agent_health())

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
app.include_router(email_router, prefix="/email", tags=["Email Analyzer"])
app.include_router(breach_router, prefix="/breach", tags=["Breach Checker"])
app.include_router(intel_router, prefix="/intel", tags=["Threat Intelligence"])

@app.get("/")
async def root():
    return {"message": "ThreatIQ Backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.websocket("/ws")
@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    # Handle token from query params if not in path
    if not token:
        token = websocket.query_params.get("token")
        
    print(f"DEBUG: WS Connection attempt with token: {token[:10] if token else 'None'}...")
    
    if not token:
        await websocket.close(code=4003)
        return

    try:
        settings = get_settings()
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"leeway": 60})


        user_email = payload.get("sub")
        if not user_email:
            await websocket.close(code=4003)
            return
            
        from app.database import db
        user = await db.users.find_one({"email": user_email})
        if not user:
            await websocket.close(code=4003)
            return
            
        user_id = user["_id"]
        await manager.connect(websocket, user_id)

        try:
            while True:
                data = await websocket.receive_text()
                # Keep alive or handle client messages
        except WebSocketDisconnect:
            manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"WS Error: {e}")
        await websocket.close(code=4000)
