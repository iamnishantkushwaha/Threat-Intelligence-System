from __future__ import annotations

from app.models.alert_model import Alert
from app.models.log_model import LogEntry
from app.utils.time_utils import is_unusual_login_time


def extract_features(logs: list[LogEntry], alerts: list[Alert]) -> dict[str, float]:
    total_logs = len(logs) or 1
    failed_logins = sum(
        1
        for log in logs
        if log.event_type == "login_attempt" and log.status.lower() == "failed"
    )
    unusual_logins = sum(
        1
        for log in logs
        if log.event_type == "login_attempt" and is_unusual_login_time(log.timestamp)
    )
    unique_ips = len({log.ip for log in logs})
    high_alerts = sum(1 for alert in alerts if alert.severity == "High")

    return {
        "total_logs": float(total_logs),
        "failed_logins": float(failed_logins),
        "failed_login_ratio": round(failed_logins / total_logs, 4),
        "unusual_logins": float(unusual_logins),
        "unique_ips": float(unique_ips),
        "alert_count": float(len(alerts)),
        "high_alert_count": float(high_alerts),
    }
