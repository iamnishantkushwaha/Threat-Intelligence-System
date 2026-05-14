import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.threatiq
    agent = await db.agents.find_one({"user_id": "5c1466b6-7acc-4472-9690-26aa7cc3a52d"})
    if agent:
        print(f"Agent ID: {agent['_id']}")
        print(f"API Key: {agent['api_key']}")
    else:
        print("No agent found for this user")

if __name__ == "__main__":
    asyncio.run(check())
