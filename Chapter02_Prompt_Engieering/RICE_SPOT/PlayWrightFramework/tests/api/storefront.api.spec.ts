import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Public OpenCart endpoints @api @smoke', () => {
  test('cart JSON route returns a schema-valid snapshot', async ({ apiClient }) => {
    const cart = await apiClient.getCartSnapshot();

    expect(cart.products).toEqual([]);
    expect(cart.totals.length).toBeGreaterThan(0);
    expect(cart.totals[0]?.title).toBe('Sub-Total');
  });

  test('storefront product search returns matching HTML', async ({ apiClient }) => {
    const { response, html } = await apiClient.searchProducts('iMac');

    expect(response.headers()['content-type']).toContain('text/html');
    expect(html).toContain('Search - iMac');
    expect(html).toContain('product_id=41');
  });
});
