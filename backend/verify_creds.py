import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.threatiq
    agent_id = "10aa0964-521c-42ce-be96-a4aca698b295"
    api_key = "TBDEnz8e41rWSXrVp1vBvmdfKB12J5L0h4imCOhLGTE"
    agent = await db.agents.find_one({"_id": agent_id, "api_key": api_key})
    if agent:
        print("Agent found!")
    else:
        print("Agent NOT found!")
        # Let's see what's actually in there
        a = await db.agents.find_one({"_id": agent_id})
        if a:
            print(f"Found agent by ID, but API Key mismatch. Key in DB: {a['api_key']}")
        else:
            print("Agent ID not found at all.")

if __name__ == "__main__":
    asyncio.run(check())
