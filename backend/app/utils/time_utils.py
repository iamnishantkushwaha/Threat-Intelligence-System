from __future__ import annotations

from datetime import datetime


def parse_timestamp(value: datetime | str) -> datetime:
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def is_unusual_login_time(
    value: datetime | str,
    business_start: int = 6,
    business_end: int = 22,
) -> bool:
    timestamp = parse_timestamp(value)
    return timestamp.hour < business_start or timestamp.hour >= business_end
