import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

async def verify():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017/threatiq"))
    db = client.get_database()
    
    agent_id = "10aa0964-521c-42ce-be96-a4aca698b295"
    agent = await db.agents.find_one({"_id": agent_id})
    
    if agent:
        print(f"Agent found: {agent['_id']}")
        print(f"Expected API Key: {agent['api_key']}")
        print(f"Device Name: {agent['device_name']}")
    else:
        print("Agent not found")

asyncio.run(verify())
