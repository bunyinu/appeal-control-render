# Appeal Control Backend

## Local Development

```bash
cd backend
npm install
npm run dev
```

Local development enables demo seeding automatically. Production does not.

## Production-Safe Commands

Validate production env:

```bash
cd backend
NODE_ENV=production npm run validate:prod
```

Bootstrap the first admin:

```bash
cd backend
BOOTSTRAP_ADMIN_EMAIL=admin@example.com \
BOOTSTRAP_ADMIN_PASSWORD='replace-me' \
npm run bootstrap:admin
```

Start the backend in a deployment environment:

```bash
cd backend
NODE_ENV=production npm run start:render
```

## Docs

- Swagger: `/api-docs/`
- Health: `/api/health`
- Readiness: `/api/health/ready`
- Runbook: `../docs/render-production-runbook.md`
