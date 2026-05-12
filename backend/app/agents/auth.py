from fastapi import Header, HTTPException, Depends
from app.database import db

async def verify_agent_key(x_api_key: str = Header(...), agent_id: str = Header(...)):
    agent = await db.agents.find_one({"_id": agent_id, "api_key": x_api_key})
    if not agent:
        raise HTTPException(status_code=403, detail="Invalid Agent ID or API Key")
    return agent
