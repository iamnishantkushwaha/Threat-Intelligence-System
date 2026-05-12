from fastapi import APIRouter, Depends, HTTPException, status
from app.agents.schemas import AgentCreate, AgentResponse
from app.auth.utils import get_current_user
from app.database import db
from datetime import datetime
import uuid
import secrets
from typing import List

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
