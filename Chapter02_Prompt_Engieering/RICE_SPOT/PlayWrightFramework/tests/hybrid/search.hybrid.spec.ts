import { test, expect } from '../../src/fixtures/test-fixtures';

test('API-discovered product is available in the storefront UI @e2e @regression', async ({
  apiClient,
  homePage,
  page,
  searchResultsPage,
}) => {
  const { html } = await apiClient.searchProducts('iMac');
  expect(html).toContain('product_id=41');

  await homePage.goto();
  await homePage.searchBar.searchFor('iMac');
  await expect(searchResultsPage.productLink('iMac')).toBeVisible();
  await expect(page).toHaveURL(/search=iMac/);
});
