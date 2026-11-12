import { test, expect } from '../../../src/fixtures/test-fixtures';
import { env } from '../../../src/utils/env';

test.describe('Admin > User Management', () => {
  test.beforeEach(async ({ adminUsersPage }) => {
    await adminUsersPage.goto();
  });

  test('lists system users in the table @smoke', async ({ adminUsersPage }) => {
    await expect(adminUsersPage.tableRows.first()).toBeVisible();
    await expect(adminUsersPage.recordsFound).toContainText('Records Found');
  });

  test('search by existing username returns exactly that user', async ({ adminUsersPage }) => {
    await adminUsersPage.searchByUsername(env.admin.username);

    await expect(adminUsersPage.tableRows).toHaveCount(1);
    expect(await adminUsersPage.columnValues('Username')).toEqual([env.admin.username]);
  });

  test('search by unknown username shows "No Records Found"', async ({ adminUsersPage }) => {
    await adminUsersPage.searchByUsername(`nobody_${Date.now()}`);

    await expect(adminUsersPage.toast.filter({ hasText: 'No Records Found' })).toBeVisible();
    await expect(adminUsersPage.tableRows).toHaveCount(0);
  });

  test('filter by role "Admin" only shows admin users', async ({ adminUsersPage }) => {
    await adminUsersPage.filterByRole('Admin');

    // Poll until the table has re-rendered with the filtered result
    await expect.poll(async () => [...new Set(await adminUsersPage.columnValues('User Role'))]).toEqual(['Admin']);
  });

  test('reset clears the search filters', async ({ adminUsersPage }) => {
    await adminUsersPage.searchByUsername(env.admin.username);
    await adminUsersPage.resetButton.click();
    await adminUsersPage.waitForLoaded();

    await expect(adminUsersPage.usernameFilter).toHaveValue('');
    await expect.poll(() => adminUsersPage.tableRows.count()).toBeGreaterThan(1);
  });
});
