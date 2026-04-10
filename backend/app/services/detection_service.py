from __future__ import annotations

from collections import defaultdict
from datetime import datetime

from app.core.config import settings
from app.models.alert_model import Alert
from app.models.log_model import LogEntry
from app.services.log_service import read_logs
from app.utils.time_utils import is_unusual_login_time


def _latest_timestamp(logs: list[LogEntry]) -> datetime | None:
    if not logs:
        return None
    return max(log.timestamp for log in logs)


def _base_risk_score(severity: str, confidence: float | None) -> float:
    severity_floor = {"High": 82.0, "Medium": 58.0, "Low": 35.0}
    confidence_score = round((confidence or 0.0) * 100, 1)
    return min(100.0, max(severity_floor.get(severity, 35.0), confidence_score))


def analyze_logs(logs: list[LogEntry] | None = None) -> list[Alert]:
    records = logs or read_logs()
    alerts: list[Alert] = []

    failed_login_events: dict[str, list[LogEntry]] = defaultdict(list)
    unknown_ip_events: dict[str, list[LogEntry]] = defaultdict(list)

    for log in records:
        if log.event_type == "login_attempt" and log.status.lower() == "failed":
            failed_login_events[log.ip].append(log)

        if log.ip not in settings.known_ips:
            unknown_ip_events[log.ip].append(log)

    for ip, events in failed_login_events.items():
        count = len(events)
        confidence = 0.94
        if count >= settings.brute_force_threshold:
            alerts.append(
                Alert(
                    type="Brute Force Attack",
                    ip=ip,
                    severity="High",
                    timestamp=_latest_timestamp(events),
                    count=count,
                    confidence=confidence,
                    ai_risk_score=_base_risk_score("High", confidence),
                    summary=f"{count} failed login attempts from {ip}",
                )
            )

    for log in records:
        confidence = 0.73
        if log.event_type == "login_attempt" and is_unusual_login_time(
            log.timestamp,
            settings.business_hours_start,
            settings.business_hours_end,
        ):
            alerts.append(
                Alert(
                    type="Unusual Login Time",
                    ip=log.ip,
                    severity="Medium",
                    timestamp=log.timestamp,
                    confidence=confidence,
                    ai_risk_score=_base_risk_score("Medium", confidence),
                    summary=f"Login at an unusual hour from {log.ip}",
                )
            )

    for ip, events in unknown_ip_events.items():
        count = len(events)
        confidence = 0.66
        alerts.append(
            Alert(
                type="Unknown IP Access",
                ip=ip,
                severity="Medium",
                timestamp=_latest_timestamp(events),
                count=count,
                confidence=confidence,
                ai_risk_score=_base_risk_score("Medium", confidence),
                summary=f"Observed {count} events from unknown IP {ip}",
            )
        )

    severity_order = {"High": 0, "Medium": 1, "Low": 2}
    return sorted(
        alerts,
        key=lambda alert: (
            severity_order[alert.severity],
            -(alert.timestamp.timestamp() if alert.timestamp else 0.0),
            alert.ip,
            alert.type,
        ),
    )
