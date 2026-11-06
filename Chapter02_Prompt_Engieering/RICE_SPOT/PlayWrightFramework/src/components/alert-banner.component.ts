import type { Locator, Page } from '@playwright/test';

export class AlertBanner {
  readonly success: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.success = page.locator('.alert-success');
    this.error = page.locator('.alert-danger');
  }
}
