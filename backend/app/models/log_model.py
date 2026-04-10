from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LogEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    timestamp: datetime
    ip: str
    event_type: str
    status: str
    username: str


class LogsResponse(BaseModel):
    logs: list[LogEntry]
