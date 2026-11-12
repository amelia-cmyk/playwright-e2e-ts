import 'dotenv/config';

/** Centralised, typed access to environment variables with safe defaults for the public demo apps. */
export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
  admin: {
    username: process.env.ADMIN_USERNAME ?? 'Admin',
    password: process.env.ADMIN_PASSWORD ?? 'admin123',
  },
  api: {
    username: process.env.API_USERNAME ?? 'admin',
    password: process.env.API_PASSWORD ?? 'password123',
  },
};

/** Where the logged-in admin session is saved by tests/setup/auth.setup.ts */
export const STORAGE_STATE = '.auth/admin.json';
