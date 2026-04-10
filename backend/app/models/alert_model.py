from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class Alert(BaseModel):
    type: str
    ip: str
    severity: Literal["High", "Medium", "Low"]
    timestamp: datetime | None = None
    summary: str
    count: int | None = None
    confidence: float | None = None
    ai_risk_score: float | None = None
    abuse_confidence_score: int | None = None
    country: str | None = None
    country_code: str | None = None
    country_name: str | None = None
    isp: str | None = None
    domain: str | None = None
    usage_type: str | None = None
    total_reports: int | None = None
    last_reported_at: datetime | None = None
    is_public: bool | None = None
    is_whitelisted: bool | None = None
    is_malicious: bool | None = None
    intel_source: str | None = None
    intel_summary: str | None = None
