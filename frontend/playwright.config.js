/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require('@playwright/test');

const frontendUrl = process.env.E2E_FRONTEND_URL || 'http://localhost:4003';

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  expect: {
    timeout: 15000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: frontendUrl,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath: '/usr/bin/chromium-browser',
      args: ['--disable-dev-shm-usage'],
    },
  },
});
