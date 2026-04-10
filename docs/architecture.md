# Architecture

The system is split into a React frontend and a FastAPI backend.

Backend layers:
- `routes/` exposes API endpoints.
- `services/` contains log ingestion, detection, AI prediction, and summary logic.
- `models/` defines Pydantic contracts shared across the API.
- `utils/` holds parsing, time handling, and feature extraction helpers.
- `ml/` stores lightweight model artifacts used by the AI service.

Data flows from `backend/data/logs.json` into rule-based analysis first, then into the AI prediction layer for a higher-level threat assessment.
