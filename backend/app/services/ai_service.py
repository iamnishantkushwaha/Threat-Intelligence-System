from __future__ import annotations

from app.models.alert_model import Alert
from app.models.log_model import LogEntry
from app.models.threat_model import ThreatPrediction
from app.services.detection_service import analyze_logs
from app.services.log_service import read_logs
from app.utils.feature_extractor import extract_features
from ml.predict import predict_from_features


def predict_threats(
    logs: list[LogEntry] | None = None,
    alerts: list[Alert] | None = None,
) -> ThreatPrediction:
    records = logs or read_logs()
    detected_alerts = alerts or analyze_logs(records)
    features = extract_features(records, detected_alerts)
    prediction = predict_from_features(features)
    return ThreatPrediction(**prediction)
