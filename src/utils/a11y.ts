import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';

/** WCAG 2.1 level A + AA: the standard most accessibility regulations refer to. */
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;
export type A11yViolation = AxeResults['violations'][number];

export interface A11yReport {
  /** Violations that are not in the known-issues baseline → these fail the test. */
  newViolations: A11yViolation[];
  /** Known issues that still exist (tracked, not failing). */
  stillPresent: string[];
  /** Known issues that no longer occur → the baseline can be cleaned up. */
  resolved: string[];
}

/**
 * Runs an axe-core WCAG scan on the current page, attaches the full result to the HTML report
 * and compares it against a baseline of already-known issues.
 */
export async function scanA11y(page: Page, testInfo: TestInfo, knownIssues: readonly string[]): Promise<A11yReport> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

  await testInfo.attach('a11y-violations.json', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const foundIds = results.violations.map((v) => v.id);
  const report: A11yReport = {
    newViolations: results.violations.filter((v) => !knownIssues.includes(v.id)),
    stillPresent: knownIssues.filter((id) => foundIds.includes(id)),
    resolved: knownIssues.filter((id) => !foundIds.includes(id)),
  };

  if (report.stillPresent.length) {
    testInfo.annotations.push({ type: 'known a11y issues', description: report.stillPresent.join(', ') });
  }
  if (report.resolved.length) {
    testInfo.annotations.push({
      type: 'a11y issues resolved',
      description: `${report.resolved.join(', ')} no longer occur; remove them from the baseline`,
    });
  }
  return report;
}

/** One readable line per violation, used as the assertion message. */
export function formatViolation(v: A11yViolation): string {
  const targets = v.nodes
    .slice(0, 3)
    .map((n) => n.target.join(' '))
    .join(' | ');
  return `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} element(s), e.g. ${targets})`;
}
