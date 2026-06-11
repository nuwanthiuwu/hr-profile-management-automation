import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for HR Profile Management Automation
 * 
 * Key Settings:
 * - headless: false - Browser visible for local debugging
 * - trace: 'on-first-retry' - Capture traces only on failures
 * - screenshot: 'only-on-failure' - Capture screenshots on failure
 * - Browser: Chromium (Chrome-based)
 * - Sequential execution (not parallel)
 */

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

  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'test-results/reports' }],
    ['json', { outputFile: 'test-results/reports/results.json' }],
    ['junit', { outputFile: 'test-results/reports/junit.xml' }],
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
