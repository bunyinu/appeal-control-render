# Appeal Control

Appeal Control is a healthcare operations app for managing payer denials and appeal workflows across cases, tasks, documents, drafts, notes, and activity history.

## Stack

- Frontend: Next.js + React
- Backend: Express + Sequelize
- Database: PostgreSQL

## Local Ports

- Frontend: `4003`
- Backend: `9000`

## Run Locally

### Backend

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
PORT=9000 FRONT_PORT=4003 node ./src/index.js
```

### Frontend

```bash
cd frontend
npm install
FRONT_PORT=4003 npm run dev
```

## Health Checks

- Backend health: `http://localhost:9000/api/health`
- Backend readiness: `http://localhost:9000/api/health/ready`
- Swagger: `http://localhost:9000/api-docs/`
- Frontend login: `http://localhost:4003/login/`

## Quality Gates

From the repo root:

```bash
npm run check:backend
npm run check:frontend
npm run check:smoke
npm run check:all
```

Backend lint now includes a generated-code normalizer, so recurring scaffold-style lint debt is cleaned before ESLint runs:

```bash
cd backend
npm run normalize:generated
npm run lint
```

## CI

GitHub Actions CI is defined in `.github/workflows/ci.yml` and runs:

- backend lint
- frontend lint
- frontend production build

## Maintenance Notes

- `backend/scripts/normalize-generated-backend.js` is the supported post-generation cleanup step for backend scaffold noise.
- Root `patch_*.js` files are legacy one-off migration helpers. They are not part of the production workflow, CI, or deployment path.
- Playwright coverage lives in `frontend/e2e/`.

## Production Baseline

Before treating the app as production-ready, keep these green:

- backend lint
- frontend lint
- frontend build
- smoke checks against live health endpoints
- Playwright regression suite for core user flows

## Render Deployment

This repo is configured for a Render deployment with:

- frontend as a public web service
- backend as a private service
- Render Postgres as the primary database
- private-network proxying from frontend `/api` and `/api-docs` to the backend

Production notes:

- Do not run demo seeders in production.
- Keep `ENABLE_SQL_CONSOLE=false`, `ENABLE_PEXELS_PROXY=false`, and `ENABLE_AI_PROXY=false` unless separately approved.
- Provide a real frontend `APP_URL`, a generated `SECRET_KEY`, and managed email credentials.
- Keep PHI out of logs, build artifacts, static assets, preview data, and resource names.
- Use `cd backend && npm run bootstrap:admin` for the first real admin account instead of demo seeding.
- See `docs/render-production-runbook.md` for rollout, rollback, and bootstrap steps.
