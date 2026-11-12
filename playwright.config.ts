import { defineConfig, devices, type Project } from '@playwright/test';
import 'dotenv/config';
import { env, STORAGE_STATE } from './src/utils/env';

/** Desktop browsers every UI test runs against. */
const desktopBrowsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

/** Mobile devices: the login flow is verified on small screens. */
const mobileDevices = [
  { name: 'mobile-chrome', device: devices['Pixel 7'] },
  { name: 'mobile-safari', device: devices['iPhone 14'] },
];

const uiProjects: Project[] = desktopBrowsers.flatMap(({ name, device }) => [
  // Authenticated UI tests (reuse the session saved by the setup project)
  {
    name: `ui-${name}`,
    testDir: './tests/ui',
    testIgnore: /auth\/.*\.spec\.ts/,
    dependencies: ['setup'],
    use: { ...device, storageState: STORAGE_STATE },
  },
  // Authentication tests start from a clean, logged-out browser
  {
    name: `auth-${name}`,
    testDir: './tests/ui/auth',
    use: { ...device },
  },
]);

const mobileProjects: Project[] = mobileDevices.map(({ name, device }) => ({
  name,
  testDir: './tests/ui/auth',
  use: { ...device },
}));

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 20_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Public demo servers are shared & slow: keep parallelism modest to avoid overloading them
  workers: process.env.CI ? 2 : 3,
  reporter: [['list'], ['html', { open: 'never' }], ...(process.env.CI ? ([['github']] as const) : [])],
  use: {
    baseURL: env.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },
  projects: [
    // Log in once (Chromium) and save the session; cookies are reused by every browser
    { name: 'setup', testMatch: /.*\.setup\.ts/, use: { ...devices['Desktop Chrome'] } },
    ...uiProjects,
    ...mobileProjects,
    // API tests (no browser)
    { name: 'api', testDir: './tests/api', use: { baseURL: env.apiBaseUrl } },
  ],
});
