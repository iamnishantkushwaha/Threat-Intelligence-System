import requests
import json

url = "http://localhost:8000/agent/malware/report"
headers = {
    "X-API-KEY": "TBDEnz8e41rWSXrVp1vBvmdfKB12J5L0h4imCOhLGTE",
    "agent-id": "10aa0964-521c-42ce-be96-a4aca698b295",
    "Content-Type": "application/json"
}
data = {
    "detection_type": "test",
    "malware_name": "Test-Malware",
    "file_path": "C:\\test.exe",
    "risk_score": 50,
    "severity": "Medium",
    "recommendation": "Test only"
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
