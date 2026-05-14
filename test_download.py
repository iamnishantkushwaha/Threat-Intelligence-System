import requests
import os

BASE_URL = "http://localhost:8000"

def test_download():
    # Login first to get token
    email = "admin@threatiq.io"
    password = "testpassword123"
    
    login_data = {"username": email, "password": password}
    login_res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.text}")
        return

    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Testing Agent Download Endpoint...")
    res = requests.get(f"{BASE_URL}/agents/download", headers=headers)
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        print(f"Success! Content length: {len(res.content)} bytes")
        with open("test_agent.zip", "wb") as f:
            f.write(res.content)
        print("File saved as test_agent.zip")
    else:
        print(f"Failed! Error: {res.text}")

if __name__ == "__main__":
    test_download()
