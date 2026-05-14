from fastapi import APIRouter, Depends, HTTPException, status
from app.agents.schemas import AgentCreate, AgentResponse
from app.auth.utils import get_current_user
from app.database import db
from datetime import datetime
import uuid
import secrets
from typing import List
from app.agents.auth import verify_agent_key
import asyncio
import zipfile
import io
import os
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.post("/register", response_model=AgentResponse)
async def register_agent(agent: AgentCreate, current_user: dict = Depends(get_current_user)):
    agent_id = str(uuid.uuid4())
    api_key = secrets.token_urlsafe(32)
    
    agent_dict = {
        "_id": agent_id,
        "user_id": current_user["_id"],
        "device_name": agent.device_name,
        "api_key": api_key,
        "os": agent.os,
        "status": "active",
        "last_seen": None,
        "created_at": datetime.utcnow()
    }
    
    await db.agents.insert_one(agent_dict)
    
    return {
        "id": agent_id,
        "device_name": agent.device_name,
        "api_key": api_key,
        "os": agent.os,
        "status": "active",
        "last_seen": None,
        "created_at": agent_dict["created_at"]
    }

@router.get("/", response_model=List[AgentResponse])
async def get_agents(current_user: dict = Depends(get_current_user)):
    agents = []
    async for agent in db.agents.find({"user_id": current_user["_id"]}):
        agent["id"] = agent["_id"]
        agents.append(agent)
    return agents

@router.get("/download")
async def download_agent_package(current_user: dict = Depends(get_current_user)):
    """Generates a ZIP package of the Windows Agent for deployment."""
    agent_dir = os.path.abspath(os.path.join(os.getcwd(), "..", "windows-agent"))
    
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk(agent_dir):
            for file in files:
                if "__pycache__" in root or ".git" in root or "dist" in root or "build" in root:
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, agent_dir)
                zip_file.write(file_path, rel_path)
                
    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer, 
        media_type="application/x-zip-compressed",
        headers={"Content-Disposition": "attachment; filename=ThreatIQ-Agent-v1.zip"}
    )

@router.get("/package/exe")
async def download_agent_exe(current_user: dict = Depends(get_current_user)):
    """Serves the pre-compiled Windows Agent executable."""
    from fastapi.responses import FileResponse
    exe_path = os.path.abspath(os.path.join(os.getcwd(), "..", "windows-agent", "dist", "ThreatIQAgent.exe"))
    
    if not os.path.exists(exe_path):
        raise HTTPException(status_code=404, detail="Agent executable not found. Please build it first.")
        
    return FileResponse(
        path=exe_path,
        filename="ThreatIQAgent.exe",
        media_type="application/octet-stream"
    )

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str, current_user: dict = Depends(get_current_user)):
    agent = await db.agents.find_one({"_id": agent_id, "user_id": current_user["_id"]})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent["id"] = agent["_id"]
    return agent


@router.delete("/{agent_id}")
async def delete_agent(agent_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.agents.delete_one({"_id": agent_id, "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Agent deleted successfully"}
@router.post("/ping")
async def ping_agent(agent: dict = Depends(verify_agent_key)):
    return {"status": "ok", "timestamp": datetime.utcnow()}

async def monitor_agent_health():
    """Background task to mark agents as offline after 5 minutes of inactivity"""
    while True:
        try:
            threshold = datetime.utcnow().timestamp() - 300 # 5 minutes
            from datetime import datetime as dt
            threshold_dt = dt.utcfromtimestamp(threshold)
            
            await db.agents.update_many(
                {"last_seen": {"$lt": threshold_dt}, "status": "active"},
                {"$set": {"status": "offline"}}
            )
        except Exception as e:
            print(f"Health Monitor Error: {e}")
        await asyncio.sleep(60) # Check every minute
