import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Admin > User Management > Users */
export class AdminUsersPage extends BasePage {
  readonly usernameFilter: Locator;
  readonly userRoleFilter: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly addButton: Locator;
  readonly recordsFound: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    const filters = page.locator('.oxd-table-filter');
    this.usernameFilter = filters.locator('.oxd-input-group', { hasText: 'Username' }).locator('input');
    this.userRoleFilter = filters.locator('.oxd-input-group', { hasText: 'User Role' }).locator('.oxd-select-text');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.recordsFound = page.locator('.orangehrm-horizontal-padding span.oxd-text');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
  }

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/admin/viewSystemUsers');
    await this.waitForLoaded();
    await this.expectHeader('Admin');
  }

  async searchByUsername(username: string): Promise<void> {
    await this.usernameFilter.fill(username);
    await this.submitSearch();
  }

  async filterByRole(role: 'Admin' | 'ESS'): Promise<void> {
    await this.userRoleFilter.click();
    await this.page.getByRole('option', { name: role, exact: true }).click();
    await this.submitSearch();
  }

  /** Clicks Search and waits for the users API response, avoiding races with the old table data. */
  async submitSearch(): Promise<void> {
    const response = this.page.waitForResponse(
      (res) => res.url().includes('/api/v2/admin/users') && res.request().method() === 'GET',
    );
    await this.searchButton.click();
    await response;
    await this.waitForLoaded();
  }

  /** Returns the text of a given column (by header name) for every visible row. */
  async columnValues(columnName: string): Promise<string[]> {
    const headers = (await this.page.locator('.oxd-table-header .oxd-table-th').allInnerTexts()).map((h) => h.trim());
    const index = headers.indexOf(columnName);
    expect(index, `Column "${columnName}" should exist`).toBeGreaterThan(-1);
    const cells = this.tableRows.locator(`.oxd-table-cell:nth-child(${index + 1})`);
    return (await cells.allInnerTexts()).map((t) => t.trim());
  }
}
