from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - optional local dependency
    load_dotenv = None


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

if load_dotenv:
    load_dotenv(ENV_FILE)


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "AI Threat Intelligence System")
    logs_file: Path = BASE_DIR / "data" / os.getenv("LOG_FILE_NAME", "logs.json")
    sample_csv_file: Path = BASE_DIR / "data" / os.getenv("SAMPLE_LOG_FILE_NAME", "sample_logs.csv")
    cors_origins: list[str] = None  # type: ignore[assignment]
    known_ips: list[str] = None  # type: ignore[assignment]
    brute_force_threshold: int = int(os.getenv("BRUTE_FORCE_THRESHOLD", "5"))
    business_hours_start: int = int(os.getenv("BUSINESS_HOURS_START", "6"))
    business_hours_end: int = int(os.getenv("BUSINESS_HOURS_END", "22"))
    abuseipdb_api_key: str = os.getenv("ABUSEIPDB_API_KEY", "")
    abuseipdb_base_url: str = os.getenv(
        "ABUSEIPDB_BASE_URL",
        "https://api.abuseipdb.com/api/v2",
    )
    abuseipdb_max_age_days: int = int(os.getenv("ABUSEIPDB_MAX_AGE_DAYS", "90"))
    abuseipdb_confidence_threshold: int = int(
        os.getenv("ABUSEIPDB_CONFIDENCE_THRESHOLD", "75")
    )
    abuseipdb_verbose: bool = os.getenv("ABUSEIPDB_VERBOSE", "true").lower() == "true"
    threat_intel_timeout_seconds: int = int(
        os.getenv("THREAT_INTEL_TIMEOUT_SECONDS", "5")
    )

    def __post_init__(self) -> None:
        object.__setattr__(
            self,
            "cors_origins",
            _split_csv(
                os.getenv(
                    "CORS_ORIGINS",
                    "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174",
                )
            ),
        )
        object.__setattr__(
            self,
            "known_ips",
            _split_csv(os.getenv("KNOWN_IPS", "192.168.1.10")),
        )


settings = Settings()
