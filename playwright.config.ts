import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { env, STORAGE_STATE } from './src/utils/env';


export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 20_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Public demo servers are shared & slow: keep parallelism modest to avoid overloading them
  workers: process.env.CI ? 2 : 3,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ...(process.env.CI ? ([['github']] as const) : []),
  ],
  use: {
    baseURL: env.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },
  projects: [
    // 1. Log in once and save the session for all authenticated UI tests
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // 2. UI tests that need a logged-in admin (reuse saved session)
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      testIgnore: /auth\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
    },

    // 3. Authentication tests start from a clean, logged-out browser
    {
      name: 'ui-auth',
      testDir: './tests/ui/auth',
      use: { ...devices['Desktop Chrome'] },
    },

    // 4. API tests (no browser)
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: env.apiBaseUrl },
    },
  ],
});
