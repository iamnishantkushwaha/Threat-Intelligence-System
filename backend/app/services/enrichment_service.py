from __future__ import annotations

import asyncio
import ipaddress
from datetime import datetime
from typing import Any

from app.core.config import settings
from app.models.alert_model import Alert

try:
    import httpx
except ImportError:  # pragma: no cover - optional local dependency
    httpx = None


ABUSEIPDB_CHECK_PATH = "/check"
MALICIOUS_SCORE_THRESHOLD = 50
IP_REPUTATION_CACHE: dict[str, dict[str, Any]] = {}


def _can_enrich() -> bool:
    return bool(settings.abuseipdb_api_key and httpx)


def is_public_ip(value: str) -> bool:
    candidate = value.strip().lower()
    if candidate == "localhost":
        return False

    try:
        address = ipaddress.ip_address(candidate)
    except ValueError:
        return False

    return bool(
        address.is_global
        and not address.is_loopback
        and not address.is_private
        and not address.is_reserved
        and not address.is_link_local
        and not address.is_multicast
        and not address.is_unspecified
    )


def _request_params(ip_address: str) -> dict[str, str | int]:
    return {
        "ipAddress": ip_address,
        "maxAgeInDays": 90,
        "verbose": "true",
    }


def _request_headers() -> dict[str, str]:
    return {
        "Accept": "application/json",
        "Key": settings.abuseipdb_api_key,
    }


def _parse_datetime(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def _to_int(value: Any) -> int:
    try:
        return int(value or 0)
    except (TypeError, ValueError):
        return 0


def _blend_ai_risk_score(base_score: float | None, abuse_score: int | None) -> float | None:
    if base_score is None and abuse_score is None:
        return None
    if abuse_score is None:
        return base_score
    if base_score is None:
        return float(abuse_score)
    return round(min(100.0, (base_score * 0.55) + (abuse_score * 0.45)), 1)


def _build_intel_summary(payload: dict[str, Any]) -> str:
    abuse_score = payload.get("abuse_confidence_score", 0) or 0
    country = payload.get("country") or "Unknown country"
    total_reports = payload.get("total_reports", 0) or 0
    if payload.get("is_malicious"):
        disposition = "flagged as malicious"
    else:
        disposition = "returned a lower-confidence reputation signal"
    return (
        f"AbuseIPDB {disposition}: score {abuse_score}, "
        f"{total_reports} reports, source country {country}."
    )


def _normalize_response(ip_address: str, payload: dict[str, Any]) -> dict[str, Any]:
    data = payload.get("data")
    if not isinstance(data, dict):
        return {}

    abuse_score = _to_int(data.get("abuseConfidenceScore"))
    normalized = {
        "ip": ip_address,
        "abuse_confidence_score": abuse_score,
        "country": data.get("countryName") or data.get("countryCode"),
        "country_code": data.get("countryCode"),
        "country_name": data.get("countryName"),
        "isp": data.get("isp"),
        "usage_type": data.get("usageType"),
        "domain": data.get("domain"),
        "total_reports": _to_int(data.get("totalReports")),
        "last_reported_at": _parse_datetime(data.get("lastReportedAt")),
        "is_public": data.get("isPublic"),
        "is_whitelisted": data.get("isWhitelisted"),
        "is_malicious": abuse_score >= MALICIOUS_SCORE_THRESHOLD,
        "intel_source": "AbuseIPDB",
    }
    normalized["intel_summary"] = _build_intel_summary(normalized)
    return normalized


async def check_ip_reputation(ip: str) -> dict[str, Any]:
    if not _can_enrich() or not is_public_ip(ip):
        return {}

    cached = IP_REPUTATION_CACHE.get(ip)
    if cached is not None:
        return cached

    request_url = f"{settings.abuseipdb_base_url.rstrip('/')}{ABUSEIPDB_CHECK_PATH}"
    try:
        async with httpx.AsyncClient(timeout=settings.threat_intel_timeout_seconds) as client:
            response = await client.get(
                request_url,
                headers=_request_headers(),
                params=_request_params(ip),
            )
            response.raise_for_status()
            payload = response.json()
    except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError, ValueError):
        IP_REPUTATION_CACHE[ip] = {}
        return {}

    normalized = _normalize_response(ip, payload if isinstance(payload, dict) else {})
    IP_REPUTATION_CACHE[ip] = normalized
    return normalized


async def enrich_alerts(alerts: list[Alert]) -> list[Alert]:
    if not alerts:
        return alerts

    enrichments: dict[str, dict[str, Any]] = {}
    if _can_enrich():
        suspicious_ips = sorted({alert.ip for alert in alerts if is_public_ip(alert.ip)})
        if suspicious_ips:
            results = await asyncio.gather(
                *(check_ip_reputation(ip) for ip in suspicious_ips),
                return_exceptions=False,
            )
            enrichments = {
                ip_address: result
                for ip_address, result in zip(suspicious_ips, results)
                if result
            }

    enriched_alerts: list[Alert] = []
    for alert in alerts:
        intel = enrichments.get(alert.ip)
        if not intel:
            enriched_alerts.append(alert)
            continue

        payload = alert.model_dump()
        payload.update(
            {
                **intel,
                "ai_risk_score": _blend_ai_risk_score(
                    alert.ai_risk_score,
                    intel.get("abuse_confidence_score"),
                ),
            }
        )
        enriched_alerts.append(Alert(**payload))

    return enriched_alerts
