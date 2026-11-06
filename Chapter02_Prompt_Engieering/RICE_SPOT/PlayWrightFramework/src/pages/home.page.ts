import type { Page } from '@playwright/test';

import { CartSummary } from '../components/cart-summary.component';
import { SearchBar } from '../components/search-bar.component';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly searchBar: SearchBar;
  readonly cartSummary: CartSummary;

  constructor(page: Page) {
    super(page);
    this.searchBar = new SearchBar(page);
    this.cartSummary = new CartSummary(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('.');
  }
}
