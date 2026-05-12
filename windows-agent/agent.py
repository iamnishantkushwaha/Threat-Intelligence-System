import os
import json
import time
import requests
import psutil
import win32evtlog
import subprocess
from datetime import datetime
import socket
import yara

# Load configuration
def load_config():
    with open('config.json', 'r') as f:
        return json.load(f)

# Persistence logic
STATE_FILE = 'state.json'

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return {"last_record_number": 0}

def save_state(state):
    try:
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f)
    except Exception as e:
        print(f"Error saving state: {e}")

CONFIG = load_config()
AGENT_STATE = load_state()
last_record_number = AGENT_STATE.get("last_record_number", 0)

# Load YARA rules
RULES_PATH = os.path.join('rules', 'malware_rules.yar')
YARA_RULES = None
if os.path.exists(RULES_PATH):
    try:
        YARA_RULES = yara.compile(filepath=RULES_PATH)
    except Exception as e:
        print(f"Error compiling YARA rules: {e}")

BACKEND_URL = CONFIG['backend_url']
HEADERS = {
    "X-API-KEY": CONFIG['api_key'],
    "agent-id": CONFIG['agent_id'],
    "Content-Type": "application/json"
}

def get_windows_logs():
    global last_record_number
    server = 'localhost'
    log_type = 'Security'
    
    TARGET_EVENT_IDS = [4624, 4625, 4672, 4720, 4726, 4732, 1102, 4688]
    logs_to_send = []
    
    try:
        hand = win32evtlog.OpenEventLog(server, log_type)
        flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
        
        while True:
            events = win32evtlog.ReadEventLog(hand, flags, 0)
            if not events:
                break
            
            for event in events:
                if event.RecordNumber <= last_record_number:
                    continue
                
                if event.EventID in TARGET_EVENT_IDS:
                    logs_to_send.append({
                        "source": "windows-security",
                        "event_id": event.EventID,
                        "event_type": str(event.EventType),
                        "record_number": event.RecordNumber,
                        "log": str(event.StringInserts) if event.StringInserts else "No details available",
                        "timestamp": event.TimeGenerated.isoformat()
                    })
                
                if event.RecordNumber > last_record_number:
                    last_record_number = event.RecordNumber
                    save_state({"last_record_number": last_record_number})
            
            break 
            
    except Exception as e:
        print(f"Error reading logs: {e}")
    
    return logs_to_send

def scan_processes():
    suspicious_alerts = []
    for proc in psutil.process_iter(['pid', 'name', 'exe', 'cmdline']):
        try:
            info = proc.info
            cmdline = " ".join(info['cmdline']) if info['cmdline'] else ""
            
            if "powershell" in info['name'].lower() and ("-enc" in cmdline.lower() or "encodedcommand" in cmdline.lower()):
                suspicious_alerts.append({
                    "detection_type": "process",
                    "malware_name": "Suspicious PowerShell (Encoded)",
                    "process_name": info['name'],
                    "file_path": info['exe'],
                    "risk_score": 80,
                    "severity": "High",
                    "recommendation": "Investigate the encoded command and the parent process."
                })
            
            if info['exe'] and ("\\temp\\" in info['exe'].lower() or "\\appdata\\" in info['exe'].lower()):
                if info['name'].endswith('.exe'):
                    suspicious_alerts.append({
                        "detection_type": "process",
                        "malware_name": "Executable in Temp/AppData",
                        "process_name": info['name'],
                        "file_path": info['exe'],
                        "risk_score": 60,
                        "severity": "Medium",
                        "recommendation": "Verify if this executable is legitimate. Malware often runs from Temp."
                    })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return suspicious_alerts

def get_defender_detections():
    alerts = []
    try:
        cmd = "Get-MpThreatDetection | Select-Object ThreatName, Resources, SeverityID | ConvertTo-Json"
        result = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True)
        
        if result.stdout:
            data = json.loads(result.stdout)
            if isinstance(data, dict): data = [data]
            
            for threat in data:
                alerts.append({
                    "detection_type": "defender",
                    "malware_name": threat.get("ThreatName", "Unknown"),
                    "file_path": str(threat.get("Resources", ["N/A"])[0]),
                    "risk_score": 90,
                    "severity": "Critical",
                    "recommendation": "Windows Defender flagged this file. Quarantine or delete immediately."
                })
    except Exception as e:
        print(f"Error checking Defender: {e}")
    return alerts

def scan_yara_folders():
    if not YARA_RULES:
        return []
        
    alerts = []
    user_profile = os.environ.get('USERPROFILE', 'C:\\')
    scan_paths = [
        os.path.join(user_profile, 'Downloads'),
        os.path.join(user_profile, 'Desktop'),
        os.path.join(os.environ.get('TEMP', 'C:\\Temp'))
    ]
    
    for path in scan_paths:
        if not os.path.exists(path):
            continue
            
        print(f"YARA scanning: {path}...")
        try:
            for root, dirs, files in os.walk(path):
                for file in files:
                    if file.endswith(('.exe', '.dll', '.ps1', '.bat')):
                        file_path = os.path.join(root, file)
                        try:
                            matches = YARA_RULES.match(file_path)
                            if matches:
                                for match in matches:
                                    alerts.append({
                                        "detection_type": "yara",
                                        "malware_name": f"YARA Match: {match.rule}",
                                        "file_path": file_path,
                                        "risk_score": 85,
                                        "severity": "High",
                                        "recommendation": "File matched known suspicious patterns. Quarantine or delete the file."
                                    })
                        except:
                            continue
                break 
        except Exception as e:
            print(f"Error walking path {path}: {e}")
            
    return alerts

def main():
    print(f"ThreatIQ Agent started on {socket.gethostname()}...")
    print(f"Monitoring logs and processes every {CONFIG['scan_interval']} seconds.")
    
    while True:
        try:
            logs = get_windows_logs()
            if logs:
                print(f"Sending {len(logs)} logs to backend...")
                requests.post(f"{BACKEND_URL}/agent/logs/submit", json={"logs": logs}, headers=HEADERS)
            
            proc_alerts = scan_processes()
            for alert in proc_alerts:
                print(f"Reporting suspicious process: {alert['malware_name']}")
                requests.post(f"{BACKEND_URL}/agent/malware/report", json=alert, headers=HEADERS)
            
            defender_alerts = get_defender_detections()
            for alert in defender_alerts:
                print(f"Reporting Defender detection: {alert['malware_name']}")
                requests.post(f"{BACKEND_URL}/agent/malware/report", json=alert, headers=HEADERS)

            yara_alerts = scan_yara_folders()
            for alert in yara_alerts:
                print(f"Reporting YARA detection: {alert['malware_name']}")
                requests.post(f"{BACKEND_URL}/agent/malware/report", json=alert, headers=HEADERS)
                
        except Exception as e:
            print(f"Agent Loop Error: {e}")
            
        time.sleep(CONFIG['scan_interval'])

if __name__ == "__main__":
    main()
