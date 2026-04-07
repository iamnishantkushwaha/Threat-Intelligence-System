from collections import Counter
from datetime import datetime
from app.services.log_service import read_logs

def analyze_logs():
    logs = read_logs()

    alerts = []

    failed_login_ips = []
    login_times = []

    for log in logs:
        # Failed login tracking
        if log["event_type"] == "login_attempt" and log["status"] == "failed":
            failed_login_ips.append(log["ip"])

        # Time tracking
        if log["event_type"] == "login_attempt":
            login_times.append((log["ip"], log["timestamp"]))

    # Rule 1: Brute Force Detection
    ip_count = Counter(failed_login_ips)

    for ip, count in ip_count.items():
        if count >= 5:
            alerts.append({
                "type": "Brute Force Attack",
                "ip": ip,
                "severity": "High",
                "count": count,
                "summary": f"{count} failed login attempts from {ip}"
            })

    # Rule 2: Suspicious Login Time (night login)
    for ip, time in login_times:
        hour = datetime.strptime(time, "%Y-%m-%d %H:%M:%S").hour

        if hour < 5 or hour > 23:
            alerts.append({
                "type": "Unusual Login Time",
                "ip": ip,
                "severity": "Medium",
                "summary": f"Login at unusual time from {ip}"
            })

    # Rule 3: Unknown IP Access (basic assumption)
    known_ips = ["192.168.1.10"]

    for log in logs:
        if log["ip"] not in known_ips:
            alerts.append({
                "type": "Unknown IP Access",
                "ip": log["ip"],
                "severity": "Medium",
                "summary": f"Access from unknown IP {log['ip']}"
            })

    return alerts