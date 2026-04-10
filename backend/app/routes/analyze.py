from fastapi import APIRouter

from app.models.threat_model import AnalysisResponse
from app.services.ai_service import predict_threats
from app.services.detection_service import analyze_logs
from app.services.enrichment_service import enrich_alerts
from app.services.log_service import read_logs
from app.services.summary_service import generate_summary


router = APIRouter(tags=["analysis"])


@router.get("/analyze")
async def get_analysis() -> AnalysisResponse:
    logs = read_logs()
    alerts = await enrich_alerts(analyze_logs(logs))
    prediction = predict_threats(logs, alerts)
    summary = generate_summary(logs, alerts)
    return AnalysisResponse(
        alerts=alerts,
        prediction=prediction,
        ai_prediction=prediction,
        summary=summary,
    )
