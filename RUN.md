# ThreatIQ Run Guide

This guide helps anyone run ThreatIQ quickly.

## 1) Prerequisites

Choose one run mode:

- Docker mode: Docker Desktop installed and running.
- Local mode: Python 3.10+, Node.js 20+, npm, and MongoDB.

## 2) Fastest Way (Docker)

From project root:

```bash
docker-compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- MongoDB: localhost:27017

Stop:

```bash
docker-compose down
```

Reset DB volume too (optional):

```bash
docker-compose down -v
```

## 3) Run Locally (Without Docker)

### 3.1 Start MongoDB

Make sure MongoDB is running on:

- mongodb://localhost:27017

### 3.2 Start Backend

Open terminal in `backend` folder:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend endpoints:

- Health: http://localhost:8000/health
- Docs: http://localhost:8000/docs

### 3.3 Start Frontend

Open another terminal in `frontend` folder:

```bash
npm install
npm run dev
```

Open:

- http://localhost:5173

Notes:

- Frontend API base URL is hardcoded to `http://localhost:8000`.
- WebSocket URL is `ws://localhost:8000/ws`.

## 4) First-Time App Usage

1. Open frontend login/register page.
2. Create account using Register.
3. Log in and open dashboard pages.

## 5) Run Windows Agent (Optional, Windows only)

The agent sends endpoint logs/malware alerts to backend.

### 5.1 Prepare agent credentials

1. Log in to frontend.
2. Go to Agents page.
3. Register/create an agent and copy:
   - Agent ID
   - API Key

### 5.2 Configure and run agent

In `windows-agent/config.json`, set:

- `backend_url`: `http://localhost:8000`
- `agent_id`: from dashboard
- `api_key`: from dashboard

Run from `windows-agent` folder:

```cmd
run_agent.bat
```

Or run directly:

```cmd
pip install -r requirements.txt
python agent.py
```

Verify:

- Agent appears as active on Agents page.
- New logs appear in Logs page.
- Malware alerts appear in Malware page if triggered.

## 6) Common Issues

- Port already in use:
  - Stop the conflicting service, or change ports in compose/commands.
- Frontend cannot reach backend:
  - Ensure backend is running on port 8000.
- Mongo connection error:
  - Ensure MongoDB is running on localhost:27017 (local mode).
- Agent 403 errors:
  - Recheck `agent_id` and `api_key` in `windows-agent/config.json`.

## 7) Useful Commands

From project root:

```bash
# Docker mode
docker-compose up --build
docker-compose down

# Show running containers
docker ps
```

From `backend`:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

From `frontend`:

```bash
npm run dev
```
