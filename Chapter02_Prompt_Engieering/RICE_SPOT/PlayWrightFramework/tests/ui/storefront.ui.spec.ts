import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('OpenCart storefront @smoke @regression', () => {
  test('searches for a product and opens its details', async ({
    page,
    homePage,
    searchResultsPage,
    productPage,
  }) => {
    await homePage.goto();
    await homePage.searchBar.searchFor('iMac');

    await expect(page).toHaveURL(/route=product\/search/);
    await expect(page.getByRole('heading', { name: 'Search - iMac' })).toBeVisible();
    await expect(searchResultsPage.productLink('iMac')).toBeVisible();

    await searchResultsPage.productLink('iMac').click();
    await expect(page).toHaveURL(/route=product\/product/);
    await expect(productPage.title).toHaveText('iMac');
  });
});
