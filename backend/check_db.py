import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.threatiq
    
    print("--- AGENTS ---")
    agents = await db.agents.find().to_list(100)
    for a in agents:
        print(f"ID: {a['_id']}, User: {a['user_id']}, Device: {a['device_name']}")
    
    print("\n--- THREATS ---")
    threats = await db.threats.find().to_list(10)
    for t in threats:
        print(f"Title: {t['title']}, Device: {t['device_name']}")

if __name__ == "__main__":
    asyncio.run(check())
