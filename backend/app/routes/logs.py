from fastapi import APIRouter
from app.services.log_service import read_logs
from app.services.detection_service import analyze_logs
from app.services.summary_service import generate_summary

router = APIRouter()

@router.get("/logs")
def get_logs():
    return {"logs": read_logs()}

@router.get("/analyze")
def get_analysis():
    return {"alerts": analyze_logs()}

@router.get("/summary")
def get_summary():
    return {"summary": generate_summary()}