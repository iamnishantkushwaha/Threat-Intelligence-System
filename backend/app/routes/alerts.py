from fastapi import APIRouter

from app.models.alert_model import Alert
from app.services.detection_service import analyze_logs
from app.services.enrichment_service import enrich_alerts
from app.services.log_service import read_logs


router = APIRouter(tags=["alerts"])


@router.get("/alerts")
async def get_alerts() -> dict[str, list[Alert]]:
    logs = read_logs()
    alerts = analyze_logs(logs)
    return {"alerts": await enrich_alerts(alerts)}
