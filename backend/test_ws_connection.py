import asyncio
import websockets
import json
from jose import jwt
import os
from dotenv import load_dotenv

# Use the same secret key as the backend
load_dotenv()
SECRET_KEY = "supersecretkey_change_in_production"
ALGORITHM = "HS256"

async def test_ws():
    # Generate a fresh token for nishant1@gmail.com
    token = jwt.encode({"sub": "nishant1@gmail.com", "exp": 9999999999}, SECRET_KEY, algorithm=ALGORITHM)
    url = f"ws://localhost:8000/ws?token={token}"
    
    print(f"Connecting to {url}...")
    try:
        async with websockets.connect(url) as websocket:
            print("Successfully connected to WebSocket!")
            # We don't need to do anything else, just connecting proves it works
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ws())
