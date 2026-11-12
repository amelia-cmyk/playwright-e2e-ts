import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly requiredMessages: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.requiredMessages = page.locator('.oxd-input-field-error-message');
  }

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/auth\/login/);
    await expect(this.loginButton).toBeVisible();
  }
}
