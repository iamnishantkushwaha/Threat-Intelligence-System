import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    print("Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}, Body: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_auth():
    print("\nTesting Auth Flow...")
    email = f"test_{int(time.time())}@threatiq.io"
    password = "testpassword123"
    
    # Register
    reg_data = {"name": "Test User", "email": email, "password": password}
    reg_res = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    print(f"Register Status: {reg_res.status_code}")
    
    # Login
    login_data = {"username": email, "password": password}
    login_res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    print(f"Login Status: {login_res.status_code}")
    
    if login_res.status_code == 200:
        return login_res.json()["access_token"]
    return None

def test_email_analyzer(token):
    print("\nTesting Email Analyzer...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "sender": "urgent@bank-verify.link",
        "subject": "Action Required: Account Suspended",
        "text": "Your account has been suspended. Please click here to verify: http://secure-login.xyz/verify"
    }
    res = requests.post(f"{BASE_URL}/email/analyze", json=data, headers=headers)
    print(f"Analyze Status: {res.status_code}, Risk: {res.json().get('risk_score')}%")
    return res.status_code == 200

def test_breach_checker(token):
    print("\nTesting Breach Checker...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Email check
    email_res = requests.post(f"{BASE_URL}/breach/check-email", json={"email": "admin@threatiq.io"}, headers=headers)
    print(f"Email Breach Status: {email_res.status_code}, Found: {email_res.json().get('breach_count')}")
    
    # Password check
    pass_res = requests.post(f"{BASE_URL}/breach/check-password", json={"password": "password123"}, headers=headers)
    print(f"Password Breach Status: {pass_res.status_code}, Is Breached: {pass_res.json().get('is_breached')}")
    
    return email_res.status_code == 200 and pass_res.status_code == 200

def test_threat_intel(token):
    print("\nTesting Threat Intel...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # VT Hash
    vt_res = requests.post(f"{BASE_URL}/intel/virustotal/hash", json={"hash": "44d88612fea8a8f36de82e1278abb02f"}, headers=headers)
    print(f"VT Hash Status: {vt_res.status_code}, Malicious: {vt_res.json().get('result', {}).get('malicious')}")
    
    # AbuseIPDB
    ip_res = requests.post(f"{BASE_URL}/intel/abuseipdb/check-ip", json={"ip": "1.1.1.1"}, headers=headers)
    print(f"AbuseIPDB Status: {ip_res.status_code}, Score: {ip_res.json().get('result', {}).get('abuseConfidenceScore')}%")
    
    return vt_res.status_code == 200 and ip_res.status_code == 200

if __name__ == "__main__":
    if test_health():
        token = test_auth()
        if token:
            test_email_analyzer(token)
            test_breach_checker(token)
            test_threat_intel(token)
        else:
            print("Auth test failed, skipping further tests.")
    else:
        print("Backend is not running or unreachable.")
