import 'dotenv/config';

import { defineConfig, devices } from '@playwright/test';

import { env } from './src/config/env';
import { AUTH_STATE_PATH } from './src/config/paths';

const authEnabled = Boolean(process.env.AUTH_EMAIL && process.env.AUTH_PASSWORD);

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: env.workers,
  timeout: env.testTimeoutMs,
  expect: { timeout: env.expectTimeoutMs },
  reporter: process.env.CI
    ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL: env.baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    ...(authEnabled ? { storageState: AUTH_STATE_PATH } : {}),
  },
  projects: [
    {
      name: 'api',
      testMatch: '**/*.api.spec.ts',
    },
    {
      name: 'ui-chromium',
      testMatch: '**/*.ui.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'ui-firefox',
      testMatch: '**/*.ui.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'ui-webkit',
      testMatch: '**/*.ui.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'hybrid-chromium',
      testMatch: '**/*.hybrid.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
