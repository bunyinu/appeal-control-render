# Render Production Runbook

## Pre-deploy

- Import [render.yaml](/home/lus/Downloads/yuop/render.yaml) into a HIPAA-enabled Render workspace.
- Confirm `ENABLE_DEMO_SEEDING=false`, `ENABLE_AI_PROXY=false`, and `NEXT_PUBLIC_ENABLE_DEMO_ACCOUNTS=false`.
- Set `APP_URL`, `CORS_ORIGIN`, `SECRET_KEY`, and email credentials.
- Run `cd backend && NODE_ENV=production node ./scripts/assert-production-readiness.js`.

## Release Flow

1. Run `npm run check:all` from the repo root.
2. Run `npm run check:smoke` against the live environment after deploy.
3. Review `api/health` and `api/health/ready`.
4. Verify login, dashboard, create/edit flows, and document upload in the target environment.

## Bootstrap Admin

Run once after the first production deploy:

```bash
cd backend
BOOTSTRAP_ADMIN_EMAIL=admin@example.com \
BOOTSTRAP_ADMIN_PASSWORD='replace-me' \
BOOTSTRAP_ADMIN_ORG_NAME='Primary Organization' \
NODE_ENV=production \
node ./scripts/bootstrap-admin.js
```

## Rollback

1. Roll back the Render deploy to the previous healthy release.
2. If a schema change is incompatible, restore the database from the last verified backup.
3. Re-run smoke checks and a login check before reopening traffic.

## Never Do In Production

- Run demo seeders.
- Enable AI routes without explicit vendor approval and env setup.
- Put PHI in logs, build artifacts, preview data, or static assets.
