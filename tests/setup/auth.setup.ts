import { test as setup } from '../../src/fixtures/test-fixtures';
import { env, STORAGE_STATE } from '../../src/utils/env';

/**
 * Logs in once via the UI and stores the session (cookies) to a file.
 * Every test in the `ui-chromium` project starts already authenticated → faster & less flaky.
 */
setup('authenticate as admin', async ({ page, loginPage, dashboardPage }) => {
  await loginPage.goto();
  await loginPage.login(env.admin.username, env.admin.password);
  await dashboardPage.expectLoaded();
  await page.context().storageState({ path: STORAGE_STATE });
});
