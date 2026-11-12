import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly widgets: Locator;

  constructor(page: Page) {
    super(page);
    this.widgets = page.locator('.orangehrm-dashboard-widget');
  }

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/dashboard/index');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard\/index/);
    await this.expectHeader('Dashboard');
  }
}
