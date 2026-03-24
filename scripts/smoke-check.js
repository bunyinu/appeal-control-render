#!/usr/bin/env node

const checks = [
  {
    name: 'backend health',
    url: `${process.env.BACKEND_URL || 'http://localhost:9000'}/api/health`,
  },
  {
    name: 'backend readiness',
    url: `${process.env.BACKEND_URL || 'http://localhost:9000'}/api/health/ready`,
  },
  {
    name: 'swagger',
    url: `${process.env.BACKEND_URL || 'http://localhost:9000'}/api-docs/`,
  },
  {
    name: 'frontend login',
    url: `${process.env.FRONTEND_URL || 'http://localhost:4003'}/login/`,
  },
];

async function run() {
  let failed = false;

  for (const check of checks) {
    try {
      const response = await fetch(check.url, {
        redirect: 'follow',
      });

      console.log(`${check.name}: ${response.status} ${check.url}`);

      if (!response.ok) {
        failed = true;
      }
    } catch (error) {
      failed = true;
      console.log(`${check.name}: ERROR ${check.url}`);
    }
  }

  if (failed) {
    process.exit(1);
  }
}

run();
