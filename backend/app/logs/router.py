from fastapi import APIRouter, Depends, BackgroundTasks
from app.logs.schemas import AgentLogs
from app.agents.auth import verify_agent_key
from app.auth.utils import get_current_user
from app.database import db
from datetime import datetime
import uuid

router = APIRouter()

EVENT_RISK_MAPPING = {
    4625: {"score": 40, "reason": "Failed Login", "severity": "Medium"},
    4672: {"score": 40, "reason": "Admin Privilege Login", "severity": "Medium"},
    4720: {"score": 60, "reason": "New User Created", "severity": "High"},
    4732: {"score": 70, "reason": "Added To Admin Group", "severity": "High"},
    1102: {"score": 90, "reason": "Audit Log Cleared", "severity": "Critical"},
    4688: {"score": 50, "reason": "New Process Created (Suspicious)", "severity": "High"},
}

def calculate_severity(score: int):
    if score <= 30: return "Low"
    if score <= 60: return "Medium"
    if score <= 80: return "High"
    return "Critical"

async def process_logs(agent_id: str, device_name: str, logs: list):
    for entry in logs:
        risk_info = EVENT_RISK_MAPPING.get(entry.event_id, {"score": 0, "reason": "Regular Activity", "severity": "Low"})
        
        # Check for multiple failed logins (simulated logic for now)
        # In a real scenario, you'd aggregate over a window.
        
        risk_score = risk_info["score"]
        severity = risk_info["severity"]
        
        log_doc = {
            "_id": str(uuid.uuid4()),
            "agent_id": agent_id,
            "device_name": device_name,
            "source": entry.source,
            "event_id": entry.event_id,
            "event_type": entry.event_type,
            "record_number": entry.record_number,
            "log": entry.log,
            "timestamp": entry.timestamp,
            "risk_score": risk_score,
            "severity": severity,
            "reasons": [risk_info["reason"]],
            "created_at": datetime.utcnow()
        }
        
        await db.system_logs.insert_one(log_doc)
        
        # Create a threat alert if risk is high
        if risk_score >= 60:
            threat_doc = {
                "_id": str(uuid.uuid4()),
                "agent_id": agent_id,
                "device_name": device_name,
                "title": f"Suspicious Activity: {risk_info['reason']}",
                "description": f"Event ID {entry.event_id} detected on {device_name}. Log: {entry.log[:200]}...",
                "severity": severity,
                "risk_score": risk_score,
                "status": "open",
                "recommendation": "Investigate the source of this event and verify user permissions.",
                "created_at": datetime.utcnow()
            }
            await db.threats.insert_one(threat_doc)

@router.post("/submit")
async def submit_logs(
    data: AgentLogs, 
    background_tasks: BackgroundTasks,
    agent: dict = Depends(verify_agent_key)
):
    # Update last seen
    await db.agents.update_one(
        {"_id": agent["_id"]},
        {"$set": {"last_seen": datetime.utcnow()}}
    )
    
    background_tasks.add_task(process_logs, agent["_id"], agent["device_name"], data.logs)
    
    return {"message": f"Successfully received {len(data.logs)} logs"}

@router.get("/")
async def get_logs(current_user: dict = Depends(get_current_user)):
    user_agents = []
    async for agent in db.agents.find({"user_id": current_user["_id"]}):
        user_agents.append(agent["_id"])
    
    logs = []
    async for log in db.system_logs.find({"agent_id": {"$in": user_agents}}).sort("timestamp", -1).limit(100):
        log["id"] = log["_id"]
        logs.append(log)
    return logs
