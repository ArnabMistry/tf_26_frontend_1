import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  timeout: 60000,
  expect: { timeout: 15000 },
  // msedge by default, as on the machines this suite was written against.
  // PLAYWRIGHT_CHANNEL=chromium runs it on Playwright's bundled browser instead.
  use: {
    baseURL: 'http://localhost:3100',
    ...(process.env.PLAYWRIGHT_CHANNEL === 'chromium' ? {} : { channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' }),
    headless: true,
  },
  webServer: {
    command: 'npm run dev -- --port 3100',
    url: 'http://localhost:3100/login',
    reuseExistingServer: !process.env.CI,
    env: { NEXT_BUILD_DIR: '.next-admin-test' },
    timeout: 120000,
  },
});
