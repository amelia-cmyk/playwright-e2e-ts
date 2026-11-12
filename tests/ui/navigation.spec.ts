import { test, expect } from '../../src/fixtures/test-fixtures';
import { MENU_MODULES } from '../../src/data/menu';

test.describe('Main menu navigation', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  // Data-driven: one test per module
  for (const { menu, header, path } of MENU_MODULES) {
    test(`opens "${menu}" module`, async ({ page, dashboardPage }) => {
      await dashboardPage.goToModule(menu);
      await expect(page).toHaveURL(new RegExp(path));
      await dashboardPage.expectHeader(header);
    });
  }

  test('menu search filters the module list @smoke', async ({ dashboardPage }) => {
    await dashboardPage.searchMenu('adm');
    await expect(dashboardPage.sideMenu.locator('a.oxd-main-menu-item')).toHaveText(['Admin']);
  });
});
