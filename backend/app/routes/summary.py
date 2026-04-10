from fastapi import APIRouter

from app.models.threat_model import ThreatSummary
from app.services.detection_service import analyze_logs
from app.services.log_service import read_logs
from app.services.summary_service import generate_summary


router = APIRouter(tags=["summary"])


@router.get("/summary")
def get_summary() -> ThreatSummary:
    logs = read_logs()
    return generate_summary(logs, analyze_logs(logs))
