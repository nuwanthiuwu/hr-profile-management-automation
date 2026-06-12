import { defineConfig, devices } from '@playwright/test';

// When run via the /run-tests skill, REPORT_DIR is set to the timestamped
// module folder (e.g. test-results/wall/run_2026-06-12_14-30-00/reports).
// Falls back to test-results/reports for ad-hoc runs.
const reportDir = process.env.REPORT_DIR ?? 'test-results/reports';

export default defineConfig({
  testDir: './tests/specs',
  testMatch: '**/*.spec.ts',

  /* Run tests sequentially */
  fullyParallel: false,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Sequential workers */
  workers: 1,

  /* Reporters — all output paths driven by REPORT_DIR */
  reporter: [
    ['html', { outputFolder: reportDir, open: 'never' }],
    ['json', { outputFile: `${reportDir}/results.json` }],
    ['junit', { outputFile: `${reportDir}/junit.xml` }],
    ['list'],
  ],

  /* Shared settings for all the projects */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.APP_URL || 'https://smart-hr-fe.vercel.app',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on every test */
    screenshot: 'on',

    /* Video on every test */
    video: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS !== 'false',
      },
    },
  ],

  /* Global timeout for each test */
  timeout: 30000,

  /* Timeout for each action like click, fill */
  actionTimeout: 10000,

  /* Timeout for navigation */
  navigationTimeout: 30000,

  /* Expect timeout */
  expect: {
    timeout: 5000,
  },
});
