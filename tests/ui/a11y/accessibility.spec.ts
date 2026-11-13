import { test, expect } from '../../../src/fixtures/test-fixtures';
import { A11Y_KNOWN_ISSUES } from '../../../src/data/a11y-known-issues';
import { formatViolation, scanA11y } from '../../../src/utils/a11y';

/**
 * WCAG 2.1 AA scans with axe-core. Each test fails only on violations that are NOT in the
 * known-issues baseline, so existing app issues are tracked while new regressions are caught.
 * Runs on Chromium only: axe checks the DOM, so results don't depend on the browser engine.
 */
test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test.describe('logged out', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('login page has no new accessibility violations @a11y', async ({ page, loginPage }, testInfo) => {
      await loginPage.goto();

      const report = await scanA11y(page, testInfo, A11Y_KNOWN_ISSUES.login);
      expect(report.newViolations.map(formatViolation)).toEqual([]);
    });

    // A focused, strict check: the login form itself must stay usable with a screen reader
    test('login form fields and button have accessible names @a11y', async ({ loginPage }) => {
      await loginPage.goto();
      await expect(loginPage.loginButton).toHaveAccessibleName('Login');
      // Inputs are named only by their placeholder; a visible <label> link would be better
      await expect(loginPage.usernameInput).toHaveAccessibleName(/username/i);
      await expect(loginPage.passwordInput).toHaveAccessibleName(/password/i);
    });
  });

  test('dashboard has no new accessibility violations @a11y', async ({ page, dashboardPage }, testInfo) => {
    await dashboardPage.goto();
    await expect(dashboardPage.widgets.first()).toBeVisible();

    const report = await scanA11y(page, testInfo, [...A11Y_KNOWN_ISSUES.layout, ...A11Y_KNOWN_ISSUES.dashboard]);
    expect(report.newViolations.map(formatViolation)).toEqual([]);
  });

  test('admin users page has no new accessibility violations @a11y', async ({ page, adminUsersPage }, testInfo) => {
    await adminUsersPage.goto();
    await expect(adminUsersPage.tableRows.first()).toBeVisible();

    const report = await scanA11y(page, testInfo, [...A11Y_KNOWN_ISSUES.layout, ...A11Y_KNOWN_ISSUES.adminUsers]);
    expect(report.newViolations.map(formatViolation)).toEqual([]);
  });

  test('employee list has no new accessibility violations @a11y', async ({ page, pimPage }, testInfo) => {
    await pimPage.gotoEmployeeList();
    await expect(pimPage.tableRows.first()).toBeVisible();

    const report = await scanA11y(page, testInfo, [...A11Y_KNOWN_ISSUES.layout, ...A11Y_KNOWN_ISSUES.pimList]);
    expect(report.newViolations.map(formatViolation)).toEqual([]);
  });

  test('add employee form has no new accessibility violations @a11y', async ({ page, pimPage }, testInfo) => {
    await pimPage.gotoAddEmployee();

    const report = await scanA11y(page, testInfo, [...A11Y_KNOWN_ISSUES.layout, ...A11Y_KNOWN_ISSUES.pimAdd]);
    expect(report.newViolations.map(formatViolation)).toEqual([]);
  });
});
