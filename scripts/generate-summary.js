#!/usr/bin/env node
// Usage: node scripts/generate-summary.js <session-dir> <module> <git-hash> <duration-s>
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const [,, sessionDir, module, gitHash, durationSec] = process.argv;

const resultsPath = join(sessionDir, 'reports', 'results.json');
const r = JSON.parse(readFileSync(resultsPath, 'utf8'));
const s = r.stats;

const total    = s.expected;
const failed   = s.unexpected;
const skipped  = s.skipped;
const passed   = total - failed - skipped;
const duration = durationSec || (s.duration / 1000).toFixed(1);

// Collect all tests by walking the suite tree
function collectTests(suites, out = []) {
  for (const suite of suites || []) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const ok = test.status === 'expected';
        const err = test.results?.[0]?.error?.message?.split('\n')[0] || null;
        out.push({ name: spec.title, ok, err });
      }
    }
    collectTests(suite.suites, out);
  }
  return out;
}
const tests = collectTests(r.suites);

const now = new Date().toLocaleString('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit'
});

const testRows = tests
  .map((t, i) => `| ${i + 1} | ${t.name} | ${t.ok ? '✅ Passed' : '❌ Failed'} |`)
  .join('\n');

const failedTests = tests.filter(t => !t.ok);
const failSection = failedTests.length
  ? '---\n\n## Failed Tests\n\n' +
    failedTests.map(t => `### ${t.name}\n**Error:** ${t.err || 'unknown error'}`).join('\n\n') +
    '\n\n'
  : '';

const evidenceCount = readdirSync(join(sessionDir, 'evidence')).length;

const summary = [
  '# Test Session Report',
  '',
  `**Date/Time:** ${now}`,
  `**Module:** ${module || 'all'}`,
  `**Git Commit:** ${gitHash || 'n/a'}`,
  `**Duration:** ${duration} seconds`,
  '',
  '---',
  '',
  '## Results Summary',
  '',
  '| Metric | Count |',
  '|--------|-------|',
  `| Total  | ${total} |`,
  `| Passed | ${passed} |`,
  `| Failed | ${failed} |`,
  `| Skipped | ${skipped} |`,
  '',
  '---',
  '',
  '## Test Results',
  '',
  '| # | Test Name | Status |',
  '|---|-----------|--------|',
  testRows,
  '',
  failSection +
  '---',
  '',
  '## Evidence',
  '',
  '- **HTML Report:** `reports/index.html`',
  `  Open with: \`npx playwright show-report ${sessionDir}/reports\``,
  '- **JSON Results:** `reports/results.json`',
  '- **JUnit XML:** `reports/junit.xml`',
  `- **Screenshots & Videos:** \`evidence/\` (${evidenceCount} files)`,
].join('\n');

writeFileSync(join(sessionDir, 'session-summary.md'), summary);
console.log(`Written: ${sessionDir}/session-summary.md`);
console.log(`Results: ${passed} passed, ${failed} failed, ${skipped} skipped (${duration}s)`);
