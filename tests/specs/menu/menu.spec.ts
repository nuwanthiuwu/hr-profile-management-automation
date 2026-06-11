import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { NavigationPage } from '../../pages/navigation.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('Left Menu Navigation - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let navPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    navPage = new NavigationPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await navPage.verifySidebarVisible();
  });

  test.describe('TC_MENU_01 - Dashboard Navigation', () => {
    test('TC_MENU_01.1 - Should navigate to Dashboard page', async ({ page }) => {
      await navPage.clickDashboard();

      expect(page.url()).toContain('/dashboard');
      await navPage.assertVisible(navPage.dashboardLink);

      console.log('✅ Dashboard page opened');
    });
  });

  test.describe('TC_MENU_02 - Employees Navigation', () => {
    test('TC_MENU_02.1 - Should navigate to Employees page', async ({ page }) => {
      await navPage.clickEmployees();

      expect(page.url()).toContain('/employees');

      console.log(`✅ Employees page opened: ${page.url()}`);
    });
  });

  test.describe('TC_MENU_03 - Wall, People and Opportunities Navigation', () => {
    test('TC_MENU_03.1 - Should navigate to Wall page', async ({ page }) => {
      await navPage.clickWall();

      expect(page.url()).toContain('/wall');

      console.log(`✅ Wall page opened: ${page.url()}`);
    });

    test('TC_MENU_03.2 - Should navigate to People page', async ({ page }) => {
      await navPage.clickPeople();

      // People menu routes to /directory
      expect(page.url()).toContain('/directory');

      console.log(`✅ People page opened: ${page.url()}`);
    });

    test('TC_MENU_03.3 - Should navigate to Opportunities page', async ({ page }) => {
      await navPage.clickOpportunities();

      expect(page.url()).toContain('/opportunities');

      console.log(`✅ Opportunities page opened: ${page.url()}`);
    });
  });

  test.describe('TC_MENU_04 - Designations Navigation', () => {
    test('TC_MENU_04.1 - Should navigate to Designation page', async ({ page }) => {
      await navPage.clickDesignations();

      expect(page.url()).toContain('/designations');

      console.log(`✅ Designations page opened: ${page.url()}`);
    });
  });

  test.describe('TC_MENU_05 - CV Templates Navigation', () => {
    test('TC_MENU_05.1 - Should navigate to CV Templates page', async ({ page }) => {
      await navPage.clickCVTemplates();

      expect(page.url()).toContain('/cv-templates');

      console.log(`✅ CV Templates page opened: ${page.url()}`);
    });
  });

  test.describe('TC_MENU_06 - My Profile Navigation', () => {
    test('TC_MENU_06.1 - Should navigate to My Profile page', async ({ page }) => {
      await navPage.clickMyProfile();

      expect(page.url()).toContain('/profile');

      console.log(`✅ My Profile page opened: ${page.url()}`);
    });
  });
});
