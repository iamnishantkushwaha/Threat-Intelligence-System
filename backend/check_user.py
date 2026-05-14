import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.threatiq
    user = await db.users.find_one({"email": "nishant1@gmail.com"})
    if user:
        print(f"User ID for nishant1@gmail.com: {user['_id']}")
    else:
        print("User not found")

if __name__ == "__main__":
    asyncio.run(check())
