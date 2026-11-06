import type { Locator, Page } from '@playwright/test';

import { BasePage } from './base.page';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productLink(name: string): Locator {
    const productCard = this.page
      .locator('.product-thumb')
      .filter({ has: this.page.getByRole('heading', { name, exact: true }) });
    return productCard.getByRole('link', { name, exact: true }).first();
  }
}
