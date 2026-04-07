from app.services.detection_service import analyze_logs

def generate_summary():
    alerts = analyze_logs()

    total_alerts = len(alerts)

    high = sum(1 for a in alerts if a["severity"] == "High")
    medium = sum(1 for a in alerts if a["severity"] == "Medium")
    low = sum(1 for a in alerts if a["severity"] == "Low")

    summary = {
        "total_alerts": total_alerts,
        "high_threats": high,
        "medium_threats": medium,
        "low_threats": low,
        "message": "System analyzed logs and detected potential threats"
    }

    return summary