import type { Locator, Page } from '@playwright/test';

import { AlertBanner } from '../components/alert-banner.component';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly title: Locator;
  readonly alerts: AlertBanner;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole('heading', { level: 1 });
    this.alerts = new AlertBanner(page);
  }
}
