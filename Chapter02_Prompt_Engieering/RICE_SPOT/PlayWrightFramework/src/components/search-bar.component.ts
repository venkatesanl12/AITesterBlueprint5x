import type { Locator, Page } from '@playwright/test';

export class SearchBar {
  readonly input: Locator;

  constructor(page: Page) {
    this.input = page.getByPlaceholder('Search');
  }

  async searchFor(query: string): Promise<void> {
    await this.input.fill(query);
    await this.input.press('Enter');
  }
}
