import type { Page } from '@playwright/test';

import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.gotoRoute('account/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('E-Mail Address').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }
}
