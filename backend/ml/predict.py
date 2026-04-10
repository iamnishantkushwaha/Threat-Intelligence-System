from __future__ import annotations

import pickle
from pathlib import Path


ML_DIR = Path(__file__).resolve().parent
MODEL_PATH = ML_DIR / "model.pkl"
SCALER_PATH = ML_DIR / "scaler.pkl"


def _load_pickle(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        with path.open("rb") as file:
            payload = pickle.load(file)
    except (OSError, pickle.PickleError, EOFError):
        return None
    return payload if isinstance(payload, dict) else None


def _safe_scale(features: dict[str, float], scaler: dict[str, float] | None) -> dict[str, float]:
    if not scaler:
        return features
    scaled: dict[str, float] = {}
    for key, value in features.items():
        denominator = float(scaler.get(key, 1.0) or 1.0)
        scaled[key] = min(float(value) / denominator, 1.0)
    return scaled


def _score(features: dict[str, float], model: dict | None) -> float:
    default_weights = {
        "failed_logins": 0.22,
        "failed_login_ratio": 0.22,
        "unusual_logins": 0.12,
        "unique_ips": 0.08,
        "alert_count": 0.18,
        "high_alert_count": 0.18,
    }
    weights = default_weights
    if model and isinstance(model.get("weights"), dict):
        weights = {key: float(value) for key, value in model["weights"].items()}
    raw_score = sum(features.get(key, 0.0) * weight for key, weight in weights.items())
    return round(max(0.0, min(raw_score, 1.0)), 2)


def _label(score: float, model: dict | None) -> str:
    bands = {"low": 0.35, "medium": 0.65}
    if model and isinstance(model.get("bands"), dict):
        bands.update({key: float(value) for key, value in model["bands"].items()})
    if score < bands["low"]:
        return "Low"
    if score < bands["medium"]:
        return "Medium"
    return "High"


def predict_from_features(features: dict[str, float]) -> dict[str, object]:
    model = _load_pickle(MODEL_PATH)
    scaler = _load_pickle(SCALER_PATH)
    scaled_features = _safe_scale(features, scaler)
    score = _score(scaled_features, model)
    predicted_level = _label(score, model)

    indicators = []
    if features.get("failed_logins", 0.0) >= 5:
        indicators.append("repeated failed login attempts")
    if features.get("unusual_logins", 0.0) >= 1:
        indicators.append("activity outside business hours")
    if features.get("unique_ips", 0.0) >= 3:
        indicators.append("multiple unique IP sources")
    if not indicators:
        indicators.append("normal baseline activity")

    recommendations = [
        "Review source IP reputation and authentication logs.",
        "Reset credentials for affected accounts if the activity is confirmed malicious.",
        "Tighten alert thresholds or MFA requirements for repeated failed logins.",
    ]

    return {
        "risk_score": score,
        "predicted_level": predicted_level,
        "indicators": indicators,
        "recommendations": recommendations,
    }
