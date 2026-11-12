import { test, expect } from '../../../src/fixtures/test-fixtures';
import { env } from '../../../src/utils/env';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('admin can log in with valid credentials @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(env.admin.username, env.admin.password);
    await dashboardPage.expectLoaded();
    await expect(dashboardPage.widgets.first()).toBeVisible();
  });

  const invalidCases = [
    { title: 'wrong password', username: env.admin.username, password: 'wrong-password' },
    { title: 'unknown username', username: 'ghost.user', password: env.admin.password },
  ];

  for (const { title, username, password } of invalidCases) {
    test(`shows error for ${title}`, async ({ loginPage }) => {
      await loginPage.login(username, password);
      await expect(loginPage.errorAlert).toHaveText('Invalid credentials');
      await loginPage.expectOnLoginPage();
    });
  }

  test('shows "Required" validation when fields are empty', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.requiredMessages).toHaveCount(2);
    await expect(loginPage.requiredMessages.first()).toHaveText('Required');
  });

  test('user can log out and protected pages redirect to login', async ({ page, loginPage, dashboardPage }) => {
    await loginPage.login(env.admin.username, env.admin.password);
    await dashboardPage.expectLoaded();

    await dashboardPage.logout();
    await loginPage.expectOnLoginPage();

    await page.goto('/web/index.php/admin/viewSystemUsers');
    await loginPage.expectOnLoginPage();
  });
});
