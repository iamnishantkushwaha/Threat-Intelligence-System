from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

client = AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.DATABASE_NAME]

def get_db():
    return db

async def init_db():
    # Create indexes for performance
    await db.agents.create_index("user_id")
    await db.agents.create_index("api_key", unique=True)
    await db.threats.create_index([("agent_id", 1), ("created_at", -1)])
    await db.system_logs.create_index([("agent_id", 1), ("created_at", -1)])
    await db.malware_alerts.create_index([("agent_id", 1), ("created_at", -1)])
    await db.email_analysis.create_index([("user_id", 1), ("created_at", -1)])
    await db.breach_checks.create_index([("user_id", 1), ("created_at", -1)])
    await db.intel_lookups.create_index([("user_id", 1), ("created_at", -1)])
    print("Database indexes initialized.")
