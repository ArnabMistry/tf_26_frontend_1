import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://localhost:3100', channel: 'chrome', headless: true },
  webServer: {
    command: 'npm run dev -- --port 3100',
    url: 'http://localhost:3100/login',
    reuseExistingServer: !process.env.CI,
    env: { NEXT_BUILD_DIR: '.next-admin-test' },
    timeout: 120000,
  },
});
