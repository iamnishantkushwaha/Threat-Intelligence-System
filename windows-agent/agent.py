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
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("agent.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load configuration
def load_config():
    if getattr(sys, 'frozen', False):
        application_path = os.path.dirname(sys.executable)
    else:
        application_path = os.path.dirname(os.path.abspath(__file__))
    
    config_path = os.path.join(application_path, 'config.json')
    
    config = {}
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            config = json.load(f)
    
    # Check if credentials are missing or placeholders
    needs_setup = False
    if not config.get('agent_id') or config.get('agent_id') == "YOUR_AGENT_ID":
        needs_setup = True
    if not config.get('api_key') or config.get('api_key') == "YOUR_API_KEY":
        needs_setup = True
        
    if needs_setup:
        config = prompt_for_creds(config, config_path)
    else:
        # Verify existing credentials
        try:
            url = config.get('backend_url', "http://localhost:8000")
            headers = {
                "X-API-KEY": config['api_key'],
                "agent-id": config['agent_id']
            }
            res = requests.post(f"{url}/agents/ping", headers=headers, timeout=5)
            if res.status_code == 403:
                print("\n[!] Invalid Agent Credentials detected (403 Forbidden).")
                config = prompt_for_creds(config, config_path)
        except Exception as e:
            print(f"[!] Could not reach backend to verify credentials: {e}")
        
    return config

def prompt_for_creds(config, config_path):
    print("\n" + "="*50)
    print("          ThreatIQ Agent Setup")
    print("="*50)
    print("Please find your credentials in the 'Agents' page of your dashboard.")
    
    config['agent_id'] = input("Enter Agent ID: ").strip()
    config['api_key'] = input("Enter API Key: ").strip()
    
    # Defaults
    if not config.get('backend_url'):
        config['backend_url'] = "http://localhost:8000"
    if not config.get('device_name'):
        config['device_name'] = socket.gethostname()
    if not config.get('scan_interval'):
        config['scan_interval'] = 30
        
    # Save updated config
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=4)
    print("Configuration saved successfully!\n")
    return config



# Persistence logic
STATE_FILE = 'state.json'

def load_state():
    if getattr(sys, 'frozen', False):
        application_path = os.path.dirname(sys.executable)
    else:
        application_path = os.path.dirname(os.path.abspath(__file__))
    
    state_path = os.path.join(application_path, STATE_FILE)
    
    if os.path.exists(state_path):
        try:
            with open(state_path, 'r') as f:
                return json.load(f)
        except:
            pass
    return {"last_record_number": 0}

def save_state(state):
    if getattr(sys, 'frozen', False):
        application_path = os.path.dirname(sys.executable)
    else:
        application_path = os.path.dirname(os.path.abspath(__file__))
    
    state_path = os.path.join(application_path, STATE_FILE)
    
    try:
        with open(state_path, 'w') as f:
            json.dump(state, f)
    except Exception as e:
        print(f"Error saving state: {e}")

CONFIG = load_config()
AGENT_STATE = load_state()
last_record_number = AGENT_STATE.get("last_record_number", 0)


# Load YARA rules
def load_yara():
    if getattr(sys, 'frozen', False):
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        application_path = getattr(sys, '_MEIPASS', os.path.dirname(sys.executable))
    else:
        application_path = os.path.dirname(os.path.abspath(__file__))

    rules_path = os.path.join(application_path, 'rules', 'malware_rules.yar')
    
    if os.path.exists(rules_path):
        try:
            return yara.compile(filepath=rules_path)
        except Exception as e:
            logger.error(f"Error compiling YARA rules: {e}")
    return None
# Load YARA rules
YARA_RULES = load_yara()


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
        os.path.join(os.environ.get('TEMP', 'C:\\Temp')),
        os.path.abspath(os.path.join(os.getcwd(), "..")) # Project Root
    ]
    
    for path in scan_paths:
        if not os.path.exists(path):
            continue
            
        logger.info(f"YARA scanning: {path}...")
        try:
            for root, dirs, files in os.walk(path):
                # Limit depth to avoid infinite loops or extreme performance hit
                depth = root[len(path):].count(os.sep)
                if depth > 2: 
                    del dirs[:] # Don't go deeper than 2 subdirectories
                    continue

                for file in files:
                    if file.endswith(('.exe', '.dll', '.ps1', '.bat', '.vbs', '.js')):
                        file_path = os.path.join(root, file)
                        try:
                            matches = YARA_RULES.match(file_path)
                            if matches:
                                for match in matches:
                                    logger.warning(f"YARA Match found: {match.rule} in {file_path}")
                                    alerts.append({
                                        "detection_type": "yara",
                                        "malware_name": f"YARA Match: {match.rule}",
                                        "file_path": file_path,
                                        "risk_score": 85,
                                        "severity": "High",
                                        "recommendation": "File matched known suspicious patterns. Quarantine or delete the file."
                                    })
                        except Exception:
                            continue
        except Exception as e:
            logger.error(f"Error walking path {path}: {e}")
            
    return alerts

def main():
    print("\n" + "!"*60)
    print("   THREATIQ INTELLIGENCE AGENT - SYSTEM SCAN INITIATED")
    print("!"*60)
    logger.info(f"Connected to {BACKEND_URL}")
    logger.info(f"Agent ID: {CONFIG['agent_id']}")
    
    first_run = True
    
    while True:
        if first_run:
            print("\n[>] Performing Deep System Analysis...")
            first_run = False

        try:
            logs = get_windows_logs()
            if logs:
                logger.info(f"Sending {len(logs)} logs to backend...")
                requests.post(f"{BACKEND_URL}/agent/logs/submit", json={"logs": logs}, headers=HEADERS, timeout=10)
            
            proc_alerts = scan_processes()
            for alert in proc_alerts:
                logger.warning(f"Reporting suspicious process: {alert['malware_name']}")
                requests.post(f"{BACKEND_URL}/agent/malware/report", json=alert, headers=HEADERS, timeout=10)
            
            defender_alerts = get_defender_detections()
            for alert in defender_alerts:
                logger.warning(f"Reporting Defender detection: {alert['malware_name']}")
                requests.post(f"{BACKEND_URL}/agent/malware/report", json=alert, headers=HEADERS, timeout=10)

            yara_alerts = scan_yara_folders()
            for alert in yara_alerts:
                logger.warning(f"Reporting YARA detection: {alert['malware_name']}")
                requests.post(f"{BACKEND_URL}/agent/malware/report", json=alert, headers=HEADERS, timeout=10)
            
            # Send heartbeat if no other data was sent (or always, to be safe)
            if not (logs or proc_alerts or defender_alerts or yara_alerts):
                logger.debug("Sending heartbeat...")
                requests.post(f"{BACKEND_URL}/agents/ping", headers=HEADERS, timeout=10)
                
        except Exception as e:
            logger.error(f"Agent Loop Error: {e}")
            
        time.sleep(CONFIG['scan_interval'])

if __name__ == "__main__":
    main()
