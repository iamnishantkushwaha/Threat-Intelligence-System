from fastapi import APIRouter

from app.models.log_model import LogsResponse
from app.services.log_service import read_logs

router = APIRouter(tags=["logs"])

@router.get("/logs")
def get_logs() -> LogsResponse:
    return LogsResponse(logs=read_logs())
