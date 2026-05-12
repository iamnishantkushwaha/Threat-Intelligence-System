from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AgentBase(BaseModel):
    device_name: str
    os: str = "windows"

class AgentCreate(AgentBase):
    pass

class AgentResponse(AgentBase):
    id: str
    api_key: str
    status: str
    last_seen: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
