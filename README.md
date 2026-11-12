# Playwright E2E & API Test Automation (TypeScript)

![Playwright Tests](https://github.com/amelia-cmyk/playwright-e2e-ts/actions/workflows/playwright.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black)
![Browsers](https://img.shields.io/badge/browsers-Chromium%20%7C%20Firefox%20%7C%20WebKit-blue)

An end-to-end test automation framework built with **Playwright + TypeScript**. It covers both **UI** and **API** testing against public practice applications:

| Layer | Application under test                                                                                |
| ----- | ----------------------------------------------------------------------------------------------------- |
| UI    | [OrangeHRM demo](https://opensource-demo.orangehrmlive.com): an HR admin system with multiple modules |
| API   | [Restful-Booker](https://restful-booker.herokuapp.com/apidoc): a REST booking API                     |

📊 **Latest test report:** https://amelia-cmyk.github.io/playwright-e2e-ts/

---

## ✨ Highlights

- **Cross-browser & mobile**: Chromium, Firefox, WebKit (Safari), plus Pixel 7 and iPhone 14 viewports
- **Page Object Model** with a shared `BasePage` for common layout (menu, header, toast, loader)
- **Custom fixtures**: page objects and API clients are injected into tests, so there is no boilerplate
- **Authenticate once** with a `setup` project plus `storageState`, so UI tests start already logged in
- **Hybrid UI + API**: test data created through the UI is cleaned up through the app's REST API
- **Data-driven tests** (menu navigation, negative login cases)
- **Dynamic test data** with Faker, so there are no collisions on shared environments
- **Network-aware waits** (`waitForResponse`, `expect.poll`) instead of hard sleeps
- **Typed API client**: response bodies are typed, with no `any`
- **Code quality gates**: ESLint (`typescript-eslint` strict type-checked rules + `eslint-plugin-playwright`) and Prettier. Floating promises, hard waits and forgotten `test.only` fail the build
- **Environment config** with `.env` and GitHub Secrets/Variables
- **CI/CD** on GitHub Actions: type check → lint → format check → tests on push, PR and a nightly schedule, then the HTML report is published to GitHub Pages
- Trace, screenshot and video are kept on failure for fast debugging

## 📁 Project structure

```
├── .github/workflows/playwright.yml   # CI pipeline + report publishing
├── src/
│   ├── pages/            # Page Objects (BasePage, LoginPage, AdminUsersPage, PimPage, ...)
│   ├── fixtures/         # Custom Playwright fixtures
│   ├── utils/            # env config, data factory, API client
│   └── data/             # Static test data (menu modules)
├── tests/
│   ├── setup/            # Login once & save session
│   ├── ui/
│   │   ├── auth/         # Login / logout (runs logged-out)
│   │   ├── admin/        # Admin > User Management
│   │   ├── pim/          # PIM > Employee
│   │   └── navigation.spec.ts
│   └── api/              # Restful-Booker CRUD & negative tests
├── eslint.config.mjs     # Lint rules (TypeScript + Playwright best practices)
└── playwright.config.ts  # Projects generated per browser/device (see below)
```

### Test projects

| Project                                          | What runs                                         |
| ------------------------------------------------ | ------------------------------------------------- |
| `setup`                                          | Logs in once and saves the session                |
| `ui-chromium` / `ui-firefox` / `ui-webkit`       | Authenticated UI tests on each desktop browser    |
| `auth-chromium` / `auth-firefox` / `auth-webkit` | Login/logout tests from a clean, logged-out state |
| `mobile-chrome` / `mobile-safari`                | Login/logout tests on Pixel 7 and iPhone 14       |
| `api`                                            | Restful-Booker API tests (no browser)             |

## 🧪 Test coverage

| Area           | Scenarios                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| Authentication | Valid login, invalid credentials (data-driven), required-field validation, logout + protected route redirect |
| Navigation     | Every main-menu module opens correctly (data-driven), menu search                                            |
| Admin > Users  | List users, search by username, no-result search, filter by role, reset filters                              |
| PIM > Employee | Add employee, find new employee in list, required-field validation                                           |
| Booking API    | Full CRUD lifecycle, filter by name, 403 without token, 404 for unknown id                                   |

## 🚀 Getting started

```bash
npm ci
npx playwright install chromium firefox webkit
cp .env.example .env        # defaults already point to the public demo apps
```

| Command                                                  | Description                               |
| -------------------------------------------------------- | ----------------------------------------- |
| `npm test`                                               | Run all tests on every browser and device |
| `npm run test:chromium` / `test:firefox` / `test:webkit` | UI tests on a single desktop browser      |
| `npm run test:mobile`                                    | Mobile tests (Pixel 7, iPhone 14)         |
| `npm run test:api`                                       | API tests only                            |
| `npm run test:smoke`                                     | Tests tagged `@smoke`                     |
| `npm run test:headed`                                    | Chromium tests with a visible browser     |
| `npm run report`                                         | Open the last HTML report                 |
| `npm run check`                                          | Type check + lint + format check          |
| `npm run lint:fix` / `npm run format`                    | Auto-fix lint issues / format the code    |

## 🔐 Configuration

All settings come from environment variables (see `.env.example`). In CI, override them with repository **Variables** (`BASE_URL`, `API_BASE_URL`) and **Secrets** (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, ...). The real `.env` file is git-ignored.

> The credentials in `.env.example` are the **public demo credentials** published by OrangeHRM and Restful-Booker for practice.

## 📝 Notes

The demo applications are shared public servers and can be slow. The framework therefore uses modest parallelism, generous navigation timeouts and automatic retries in CI.
