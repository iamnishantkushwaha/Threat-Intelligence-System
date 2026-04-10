from __future__ import annotations

import pickle
from pathlib import Path


ML_DIR = Path(__file__).resolve().parent
MODEL_PATH = ML_DIR / "model.pkl"
SCALER_PATH = ML_DIR / "scaler.pkl"


def build_artifacts() -> tuple[dict, dict]:
    scaler = {
        "total_logs": 100.0,
        "failed_logins": 20.0,
        "failed_login_ratio": 1.0,
        "unusual_logins": 10.0,
        "unique_ips": 25.0,
        "alert_count": 20.0,
        "high_alert_count": 10.0,
    }
    model = {
        "weights": {
            "failed_logins": 0.22,
            "failed_login_ratio": 0.22,
            "unusual_logins": 0.12,
            "unique_ips": 0.08,
            "alert_count": 0.18,
            "high_alert_count": 0.18,
        },
        "bands": {"low": 0.35, "medium": 0.65},
    }
    return model, scaler


def main() -> None:
    model, scaler = build_artifacts()
    with MODEL_PATH.open("wb") as model_file:
        pickle.dump(model, model_file)
    with SCALER_PATH.open("wb") as scaler_file:
        pickle.dump(scaler, scaler_file)
    print(f"Saved model artifacts to {MODEL_PATH} and {SCALER_PATH}")


if __name__ == "__main__":
    main()
