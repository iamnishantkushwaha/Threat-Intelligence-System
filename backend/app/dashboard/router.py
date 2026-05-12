from fastapi import APIRouter, Depends
from app.database import db
from app.auth.utils import get_current_user
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    user_agents = []
    async for agent in db.agents.find({"user_id": current_user["_id"]}):
        user_agents.append(agent["_id"])
    
    total_logs = await db.system_logs.count_documents({"agent_id": {"$in": user_agents}})
    active_agents = await db.agents.count_documents({"user_id": current_user["_id"], "status": "active"})
    critical_threats = await db.threats.count_documents({"agent_id": {"$in": user_agents}, "severity": "Critical", "status": "open"})
    malware_detected = await db.malware_alerts.count_documents({"agent_id": {"$in": user_agents}})
    
    # Recent alerts for the list
    recent_alerts = []
    async for threat in db.threats.find({"agent_id": {"$in": user_agents}}).sort("created_at", -1).limit(5):
        threat["id"] = threat["_id"]
        recent_alerts.append(threat)
        
    # Generate trend data for the last 7 days
    trends = []
    for i in range(6, -1, -1):
        date = datetime.utcnow().date() - timedelta(days=i)
        start_dt = datetime.combine(date, datetime.min.time())
        end_dt = datetime.combine(date, datetime.max.time())
        
        day_threats = await db.threats.count_documents({
            "agent_id": {"$in": user_agents},
            "created_at": {"$gte": start_dt, "$lte": end_dt}
        })
        
        day_logs = await db.system_logs.count_documents({
            "agent_id": {"$in": user_agents},
            "created_at": {"$gte": start_dt, "$lte": end_dt}
        })
        
        trends.append({
            "name": date.strftime("%a"),
            "threats": day_threats,
            "logs": day_logs
        })
        
    return {
        "stats": {
            "total_logs": total_logs,
            "active_agents": active_agents,
            "critical_threats": critical_threats,
            "malware_detected": malware_detected
        },
        "recent_alerts": recent_alerts,
        "trends": trends
    }
