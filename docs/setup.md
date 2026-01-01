# Metron 2.0 Setup Guide

## 🛡️ CORE PROTOCOL: CONTINUOUS DOCUMENTATION SYNC
> **STRICT RULE:** Any task status change (to **"100% DONE"** OR **"In Progress"**) **MUST** trigger an immediate update to users' documentation.
> - **Update:** `README.md`, `docs/setup.md`, `docs/ARCHITECTURE_RULES.md`, and `docs/ULTIMATE_METRON_BLUEPRINT.md`.
> - **Constraint:** No logic left behind. Sync before moving to next phase.

## Prerequisites
- Node.js & pnpm
- Python 3.10+
- Docker Desktop

## Quick Start

### 1. Database Infrastructure (Docker)
We use Docker for databases only to keep development fast.
```bash
# Start TimescaleDB and Redis
docker-compose up -d
```

### 2. Backend (FastAPI)
The backend is located in `apps/api`.
```bash
# Install dependencies
pip install -r requirements.txt

# Run the API server (Auto-reloads)
cd apps/api
uvicorn main:app --reload --port 8000
```
Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
API Root: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)

### 3. Frontend (React)
The frontend is located in `apps/web`.
```bash
# Run via Turborepo from root
pnpm turbo dev --filter=web
```
Dashboard: [http://localhost:4700](http://localhost:4700)

## Configuration
- Environment variables are in `.env`.
- Database host is dynamic (`localhost` for local, `db` for docker).

## Automation (In Progress)
- [🚧] Windows Task Scheduler (.bat startup)
- [🚧] Startup Timeout (90s)
- [🚧] Holiday Check Logic
