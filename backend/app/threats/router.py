from fastapi import APIRouter, Depends, HTTPException
from app.database import db
from app.auth.utils import get_current_user
from typing import List
import uuid

router = APIRouter()

@router.get("/")
async def get_threats(current_user: dict = Depends(get_current_user)):
    threats = []
    # Only get threats for agents owned by this user
    user_agents = []
    async for agent in db.agents.find({"user_id": current_user["_id"]}):
        user_agents.append(agent["_id"])
    
    async for threat in db.threats.find({"agent_id": {"$in": user_agents}}).sort("created_at", -1):
        threat["id"] = threat["_id"]
        threats.append(threat)
    return threats

@router.patch("/{threat_id}/status")
async def update_threat_status(threat_id: str, status: str, current_user: dict = Depends(get_current_user)):
    result = await db.threats.update_one(
        {"_id": threat_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Threat not found")
    return {"message": "Status updated"}
