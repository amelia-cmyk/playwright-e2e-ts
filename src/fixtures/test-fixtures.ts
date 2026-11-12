import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { PimPage } from '../pages/PimPage';
import { BookingApi } from '../utils/booking-api';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  adminUsersPage: AdminUsersPage;
  pimPage: PimPage;
  bookingApi: BookingApi;
};

/** Custom test object: page objects & API clients are injected into tests, no manual `new` needed. */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  adminUsersPage: async ({ page }, use) => use(new AdminUsersPage(page)),
  pimPage: async ({ page }, use) => use(new PimPage(page)),
  bookingApi: async ({ request }, use) => use(new BookingApi(request)),
});

export { expect } from '@playwright/test';
