import type { Page } from '@playwright/test';

import { env } from '../config/env';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected async gotoRoute(route: string, params: Record<string, string> = {}): Promise<void> {
    const url = new URL('index.php', env.baseURL);
    url.searchParams.set('route', route);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    await this.page.goto(url.toString());
  }
}
