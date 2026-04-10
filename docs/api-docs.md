# API Docs

## Endpoints

- `GET /` returns service metadata and available endpoints.
- `GET /logs` returns parsed log entries.
- `GET /alerts` returns rule-based alerts.
- `GET /analyze` returns alerts, AI prediction, and a summary in one response.
- `GET /summary` returns aggregate counts and top alert sources.

## Local Run

```bash
cd backend
uvicorn app.main:app --reload
```
