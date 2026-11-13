/**
 * Accessibility baseline: axe-core rule IDs that already fail on each page of the OrangeHRM demo.
 *
 * These are real issues in the application under test that we cannot fix ourselves.
 * They are tracked here (and shown in the report) instead of failing every run, so the suite
 * catches NEW regressions. Remove an entry once the issue is fixed; the test tells you when.
 *
 * Rule reference: https://dequeuniversity.com/rules/axe/
 */
export const A11Y_KNOWN_ISSUES = {
  // Login page has its own layout (no side menu)
  login: [
    'color-contrast',
    'html-has-lang',
    'link-name', // social media icon links in the footer have no accessible name
  ],
  // Shared layout issues (present on every authenticated page)
  layout: [
    'button-name', // icon-only buttons (menu toggle, help) have no accessible name
    'color-contrast', // grey text / orange labels below the 4.5:1 ratio
    'html-has-lang', // <html> has no lang attribute
    'list', // side menu <ul> contains non-<li> children
  ],
  dashboard: ['scrollable-region-focusable'], // widget scroll areas cannot be reached by keyboard
  adminUsers: ['label'], // filter inputs and table checkboxes have no label
  pimList: ['label'],
  pimAdd: ['label'],
} as const;
