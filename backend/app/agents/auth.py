from fastapi import Header, HTTPException, Depends
from app.database import db

from datetime import datetime

async def verify_agent_key(
    x_api_key: str = Header(..., alias="X-API-KEY"), 
    agent_id: str = Header(..., alias="agent-id")
):
    print(f"DEBUG: Auth attempt - ID: {agent_id}, Key: {x_api_key[:5]}...")
    agent = await db.agents.find_one({"_id": agent_id, "api_key": x_api_key})
    if not agent:
        print(f"DEBUG: Auth FAILED for ID: {agent_id}")
        raise HTTPException(status_code=403, detail="Invalid Agent ID or API Key")

    
    # Update last seen timestamp
    await db.agents.update_one(
        {"_id": agent_id},
        {"$set": {"last_seen": datetime.utcnow(), "status": "active"}}
    )
    
    return agent
