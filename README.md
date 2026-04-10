# Threat Intelligence System

Threat Intelligence System is a full-stack monitoring workspace with a FastAPI backend for detection and enrichment, plus a React + Tailwind frontend for analyst workflows.

## Architecture

```text
logs -> detection -> AI -> AbuseIPDB enrichment -> final alerts -> frontend
```

- `backend/app/routes` exposes `/logs`, `/alerts`, `/analyze`, and `/summary`
- `backend/app/services` contains detection, AI, summary, and AbuseIPDB enrichment logic
- `backend/app/models` defines API response models
- `frontend/src/pages` contains the Dashboard, Alerts, Logs, Analytics, and Settings views

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Set these in `backend/.env`:

```env
ABUSEIPDB_API_KEY=your_key_here
ABUSEIPDB_BASE_URL=https://api.abuseipdb.com/api/v2
```

Optional existing backend settings such as `BRUTE_FORCE_THRESHOLD`, `KNOWN_IPS`, and `THREAT_INTEL_TIMEOUT_SECONDS` still apply.

## AbuseIPDB Integration Flow

1. The backend reads logs and generates rule-based suspicious alerts.
2. Only unique public IPs from those alerts are selected for enrichment.
3. Private, loopback, localhost, reserved, and internal addresses are skipped.
4. AbuseIPDB `/check` is called asynchronously with runtime caching to avoid duplicate lookups.
5. Failures such as timeouts, rate limits, invalid responses, and missing API keys are handled gracefully.
6. Final alerts include enrichment fields when available:
   `abuse_confidence_score`, `country`, `isp`, `usage_type`, `domain`, `total_reports`, `last_reported_at`, and `is_malicious`.

## API Notes

- `/alerts` returns enriched alerts when AbuseIPDB data is available.
- `/analyze` returns `alerts`, `prediction`, `ai_prediction`, and `summary`.
- If AbuseIPDB is unavailable or not configured, the API still returns base alerts.

## Update Log

```text
[2026-04-09]
- Added async AbuseIPDB alert enrichment with public-IP validation and in-memory caching
- Extended alert payloads with timestamp, AI risk score, and reputation metadata
- Updated the Alerts page to display Abuse Score, Country, ISP, Total Reports, and Malicious badges
- Added a Top Malicious IPs widget to the dashboard
```
