from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LogEntry(BaseModel):
    source: str
    event_id: int
    event_type: str
    record_number: int
    log: str
    timestamp: datetime

class AgentLogs(BaseModel):
    logs: List[LogEntry]
