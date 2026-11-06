import 'dotenv/config';

import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { env } from './src/config/env';
import { AUTH_STATE_PATH } from './src/config/paths';
import { LoginPage } from './src/pages/login.page';

export default async function globalSetup(): Promise<void> {
  const email = process.env.AUTH_EMAIL;
  const password = process.env.AUTH_PASSWORD;

  if (!email && !password) {
    return;
  }

  if (!email || !password) {
    throw new Error('Set both AUTH_EMAIL and AUTH_PASSWORD to enable authenticated storageState.');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: env.baseURL });

  try {
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);
    await page.waitForURL(/route=account\/account/, { timeout: env.testTimeoutMs });
    await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });
    await context.storageState({ path: AUTH_STATE_PATH });
  } finally {
    await browser.close();
  }
}
