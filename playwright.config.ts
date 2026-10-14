import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  timeout: 60000,
  expect: { timeout: 15000 },
  use: { baseURL: 'http://localhost:3100', channel: 'msedge', headless: true },
  webServer: {
    command: 'npm run dev -- --port 3100',
    url: 'http://localhost:3100/login',
    reuseExistingServer: !process.env.CI,
    env: { NEXT_BUILD_DIR: '.next-admin-test' },
    timeout: 120000,
  },
});
