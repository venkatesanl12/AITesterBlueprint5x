import type { APIRequestContext, APIResponse } from '@playwright/test';

import { CartSnapshotSchema, type CartSnapshot } from './schemas/cart.schema';

export class OpenCartApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getCartSnapshot(): Promise<CartSnapshot> {
    const response = await this.request.get('index.php', {
      params: { route: 'api/cart/products' },
    });
    await this.assertOk(response, 'Read public cart JSON endpoint');

    const payload: unknown = await response.json();
    const parsed = CartSnapshotSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Cart response did not match the expected schema: ${parsed.error.message}`);
    }
    return parsed.data;
  }

  async searchProducts(query: string): Promise<{ response: APIResponse; html: string }> {
    const response = await this.request.get('index.php', {
      params: { route: 'product/search', search: query },
    });
    await this.assertOk(response, `Search storefront for "${query}"`);
    return { response, html: await response.text() };
  }

  private async assertOk(response: APIResponse, operation: string): Promise<void> {
    if (!response.ok()) {
      throw new Error(
        `${operation} failed with HTTP ${response.status()} ${response.statusText()}.`,
      );
    }
  }
}
