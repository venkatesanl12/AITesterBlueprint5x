import { test as base, expect } from '@playwright/test';

import { OpenCartApiClient } from '../api/opencart-api.client';
import { HomePage } from '../pages/home.page';
import { ProductPage } from '../pages/product.page';
import { SearchResultsPage } from '../pages/search-results.page';

type FrameworkFixtures = {
  apiClient: OpenCartApiClient;
  homePage: HomePage;
  productPage: ProductPage;
  searchResultsPage: SearchResultsPage;
};

export const test = base.extend<FrameworkFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new OpenCartApiClient(request));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
});

export { expect };
