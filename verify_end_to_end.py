import requests
import time
import uuid

BASE_URL = "http://localhost:8000"

def test_end_to_end():
    print("=== ThreatIQ End-to-End Verification ===")
    
    # 1. Login as Admin
    login_res = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin@threatiq.io", "password": "testpassword123"})
    if login_res.status_code != 200:
        # Register if not exists
        requests.post(f"{BASE_URL}/auth/register", json={"name": "Admin", "email": "admin@threatiq.io", "password": "testpassword123"})
        login_res = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin@threatiq.io", "password": "testpassword123"})
    
    token = login_res.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {token}"}
    print("[1] Logged in as Admin.")

    # 2. Register a new Agent
    reg_res = requests.post(f"{BASE_URL}/agents/register", json={"device_name": "TEST-PC-01", "os": "Windows 11"}, headers=user_headers)
    agent_data = reg_res.json()
    agent_id = agent_data["id"]
    api_key = agent_data["api_key"]
    print(f"[2] Registered Agent: {agent_id}")

    agent_headers = {
        "X-API-KEY": api_key,
        "agent-id": agent_id,
        "Content-Type": "application/json"
    }

    # 3. Simulate Agent Heartbeat
    ping_res = requests.post(f"{BASE_URL}/agents/ping", headers=agent_headers)
    print(f"[3] Heartbeat sent: {ping_res.status_code}")

    # 4. Submit Mock Windows Logs
    mock_logs = {
        "logs": [
            {
                "source": "windows-security",
                "event_id": 4625,
                "event_type": "Audit Failure",
                "record_number": 1001,
                "log": "Failed login attempt from IP 192.168.1.50",
                "timestamp": "2026-05-13T12:00:00"
            }
        ]
    }
    log_res = requests.post(f"{BASE_URL}/agent/logs/submit", json=mock_logs, headers=agent_headers)
    print(f"[4] Logs submitted: {log_res.status_code}")

    # 5. Report Mock Malware Detection
    mock_malware = {
        "detection_type": "yara",
        "malware_name": "Test-Malware-Signature",
        "file_path": "C:\\Users\\Test\\Downloads\\suspicious.exe",
        "risk_score": 95,
        "severity": "Critical",
        "recommendation": "Delete immediately."
    }
    malware_res = requests.post(f"{BASE_URL}/agent/malware/report", json=mock_malware, headers=agent_headers)
    print(f"[5] Malware reported: {malware_res.status_code}")

    # 6. Verify data exists on the Dashboard
    print("\n--- Verifying Dashboard Data ---")
    
    # Check Logs
    get_logs = requests.get(f"{BASE_URL}/agent/logs", headers=user_headers)
    has_log = any(log["event_id"] == 4625 for log in get_logs.json())
    print(f"Log received on site: {'YES' if has_log else 'NO'}")

    # Check Malware
    get_malware = requests.get(f"{BASE_URL}/agent/malware", headers=user_headers)
    has_malware = any(m["malware_name"] == "Test-Malware-Signature" for m in get_malware.json())
    print(f"Malware showing on site: {'YES' if has_malware else 'NO'}")

    if has_log and has_malware:
        print("\nALL TESTS PASSED: Agent to Site communication is 100% Correct!")
    else:
        print("\nTEST FAILED: Some data did not reach the site.")

if __name__ == "__main__":
    test_end_to_end()
