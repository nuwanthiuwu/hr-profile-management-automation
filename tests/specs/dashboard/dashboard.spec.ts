import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboard.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('Dashboard - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await dashboardPage.waitForVisible(dashboardPage.pageHeading);
  });

  test.describe('TC_DASH_01 - Total Employees', () => {
    test('TC_DASH_01.1 - Should display total employee count', async () => {
      await dashboardPage.assertVisible(dashboardPage.totalEmployeesLabel);
      await dashboardPage.assertVisible(dashboardPage.totalEmployeesValue);

      const value = await dashboardPage.getStatValue(dashboardPage.totalEmployeesValue);
      expect(Number(value)).toBeGreaterThan(0);

      console.log(`✅ Total employees displayed: ${value}`);
    });
  });

  test.describe('TC_DASH_02 - Active Employees', () => {
    test('TC_DASH_02.1 - Should display active employee count', async () => {
      await dashboardPage.assertVisible(dashboardPage.activeEmployeesLabel);
      await dashboardPage.assertVisible(dashboardPage.activeEmployeesValue);

      const value = await dashboardPage.getStatValue(dashboardPage.activeEmployeesValue);
      expect(Number(value)).toBeGreaterThanOrEqual(0);

      console.log(`✅ Active employees displayed: ${value}`);
    });
  });

  test.describe('TC_DASH_03 - Inactive Employees', () => {
    test('TC_DASH_03.1 - Should display inactive employee count', async () => {
      await dashboardPage.assertVisible(dashboardPage.inactiveEmployeesLabel);
      await dashboardPage.assertVisible(dashboardPage.inactiveEmployeesValue);

      const value = await dashboardPage.getStatValue(dashboardPage.inactiveEmployeesValue);
      expect(Number(value)).toBeGreaterThanOrEqual(0);

      console.log(`✅ Inactive employees displayed: ${value}`);
    });
  });

  test.describe('TC_DASH_04 - Average Profile Completion', () => {
    test('TC_DASH_04.1 - Should display average profile completion percentage', async () => {
      await dashboardPage.assertVisible(dashboardPage.avgCompletionLabel);
      await dashboardPage.assertVisible(dashboardPage.avgCompletionValue);

      const value = await dashboardPage.getStatValue(dashboardPage.avgCompletionValue);
      expect(value).toMatch(/\d+%/);

      console.log(`✅ Average profile completion displayed: ${value}`);
    });
  });

  test.describe('TC_DASH_05 - Manage Designations', () => {
    test('TC_DASH_05.1 - Should navigate to Designation page when Manage Designation is clicked', async ({ page }) => {
      await dashboardPage.assertVisible(dashboardPage.manageDesignationsButton);
      await dashboardPage.clickManageDesignations();

      expect(page.url()).toContain('/designations');

      console.log(`✅ Navigated to Designations: ${page.url()}`);
    });
  });

  test.describe('TC_DASH_06 - Create Employee', () => {
    test('TC_DASH_06.1 - Should open employee creation form when Create Employee is clicked', async ({ page }) => {
      await dashboardPage.assertVisible(dashboardPage.createEmployeeButton);
      await dashboardPage.clickCreateEmployee();

      expect(page.url()).toContain('/employees/new');
      // Create Employee opens a drawer panel — heading is h2, not h1
      await dashboardPage.assertVisible(dashboardPage.page.locator('h2:has-text("Create Employee")'));

      console.log(`✅ Employee creation form opened: ${page.url()}`);
    });
  });

  test.describe('TC_DASH_07 - Recent Employees', () => {
    test('TC_DASH_07.1 - Should display recent employees section with employee records', async () => {
      await dashboardPage.assertVisible(dashboardPage.recentEmployeesHeading);

      const count = await dashboardPage.recentEmployeeNames.count();
      expect(count).toBeGreaterThan(0);

      const firstName = await dashboardPage.recentEmployeeNames.first().textContent();
      expect(firstName?.trim().length).toBeGreaterThan(0);

      console.log(`✅ Recent employees section visible with ${count} record(s). First: ${firstName?.trim()}`);
    });
  });

  test.describe('TC_DASH_08 - Needs Attention', () => {
    test('TC_DASH_08.1 - Should display needs attention section with employee records', async () => {
      await dashboardPage.assertVisible(dashboardPage.needsAttentionHeading);

      const count = await dashboardPage.needsAttentionItems.count();
      expect(count).toBeGreaterThan(0);

      // Each item has a progress indicator showing low profile completion
      const progressBars = dashboardPage.page.locator('[role="progressbar"]');
      await dashboardPage.assertVisible(progressBars.first());

      console.log(`✅ Needs Attention section visible with ${count} profile(s)`);
    });
  });

  test.describe('TC_DASH_09 - View All', () => {
    test('TC_DASH_09.1 - Should navigate to Employees page when View All is clicked', async ({ page }) => {
      await dashboardPage.assertVisible(dashboardPage.viewAllButton);
      await dashboardPage.clickViewAll();

      expect(page.url()).toContain('/employees');

      console.log(`✅ Employees page opened via View All: ${page.url()}`);
    });
  });
});
