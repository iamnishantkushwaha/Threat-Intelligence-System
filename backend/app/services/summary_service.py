from __future__ import annotations

from collections import Counter

from app.models.alert_model import Alert
from app.models.log_model import LogEntry
from app.models.threat_model import ThreatSummary
from app.services.detection_service import analyze_logs
from app.services.log_service import read_logs


def generate_summary(
    logs: list[LogEntry] | None = None,
    alerts: list[Alert] | None = None,
) -> ThreatSummary:
    records = logs or read_logs()
    detected_alerts = alerts or analyze_logs(records)

    high = sum(1 for alert in detected_alerts if alert.severity == "High")
    medium = sum(1 for alert in detected_alerts if alert.severity == "Medium")
    low = sum(1 for alert in detected_alerts if alert.severity == "Low")
    top_sources = [
        ip
        for ip, _count in Counter(alert.ip for alert in detected_alerts).most_common(3)
    ]

    return ThreatSummary(
        total_logs=len(records),
        total_alerts=len(detected_alerts),
        high_threats=high,
        medium_threats=medium,
        low_threats=low,
        top_sources=top_sources,
        message="System analyzed recent logs and generated a threat overview.",
    )
