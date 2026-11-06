import type { Locator, Page } from '@playwright/test';

export class CartSummary {
  readonly summary: Locator;

  constructor(page: Page) {
    this.summary = page.locator('#cart-total');
  }
}
