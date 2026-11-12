import { expect, Locator, Page } from '@playwright/test';

/** Shared layout elements (top bar, side menu, toasts) available on every authenticated page. */
export abstract class BasePage {
  readonly header: Locator;
  readonly sideMenu: Locator;
  readonly menuSearch: Locator;
  readonly userDropdown: Locator;
  readonly toast: Locator;
  readonly loader: Locator;

  constructor(protected readonly page: Page) {
    this.header = page.locator('.oxd-topbar-header-breadcrumb h6').first();
    this.sideMenu = page.locator('aside nav');
    this.menuSearch = this.sideMenu.getByPlaceholder('Search');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.toast = page.locator('.oxd-toast');
    this.loader = page.locator('.oxd-form-loader, .oxd-loading-spinner');
  }

  menuItem(name: string): Locator {
    return this.sideMenu.locator('a.oxd-main-menu-item', { hasText: new RegExp(`^${name}$`) });
  }

  async goToModule(name: string): Promise<void> {
    // Menu clicks trigger a full page load, which can be slow on the shared demo server
    await this.menuItem(name).click({ timeout: 45_000 });
    await this.waitForLoaded();
  }

  async searchMenu(keyword: string): Promise<void> {
    await this.menuSearch.fill(keyword);
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.loader).toHaveCount(0, { timeout: 20_000 });
  }

  async expectHeader(text: string): Promise<void> {
    await expect(this.header).toHaveText(text);
  }

  async expectSuccessToast(message = 'Successfully'): Promise<void> {
    await expect(this.toast.filter({ hasText: message })).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
  }
}
