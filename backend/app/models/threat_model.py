from __future__ import annotations

from pydantic import BaseModel

from app.models.alert_model import Alert


class ThreatPrediction(BaseModel):
    risk_score: float
    predicted_level: str
    indicators: list[str]
    recommendations: list[str]


class ThreatSummary(BaseModel):
    total_logs: int
    total_alerts: int
    high_threats: int
    medium_threats: int
    low_threats: int
    top_sources: list[str]
    message: str


class AnalysisResponse(BaseModel):
    alerts: list[Alert]
    prediction: ThreatPrediction
    ai_prediction: ThreatPrediction
    summary: ThreatSummary
