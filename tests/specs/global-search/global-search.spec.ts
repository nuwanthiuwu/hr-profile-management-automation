import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { GlobalSearchPage } from '../../pages/global-search.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('Global Search Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let searchPage: GlobalSearchPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    searchPage = new GlobalSearchPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await searchPage.openSearch();
  });

  // ────────────────────────────────────────────────────────
  // TC_SEARCH_01 – Search employee by name
  // ────────────────────────────────────────────────────────

  test.describe('TC_SEARCH_01 – Search employee by name', () => {
    test('TC_SEARCH_01.1 - Should display matching employees when searched by name', async ({ page }) => {
      await searchPage.search(testData.globalSearch.searchByName);

      const count = await searchPage.getResultCount();
      expect(count).toBeGreaterThan(0);

      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).toContain(testData.globalSearch.expectedNameResult);

      console.log(`✅ Name search "${testData.globalSearch.searchByName}" → ${count} result(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_SEARCH_02 – Search by email
  // ────────────────────────────────────────────────────────

  test.describe('TC_SEARCH_02 – Search by email', () => {
    test('TC_SEARCH_02.1 - Should display exact employee when searched by email', async ({ page }) => {
      await searchPage.search(testData.globalSearch.searchByEmail);

      const count = await searchPage.getResultCount();
      expect(count).toBeGreaterThan(0);

      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).toContain(testData.globalSearch.expectedEmailResult);

      console.log(`✅ Email search "${testData.globalSearch.searchByEmail}" → ${count} result(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_SEARCH_03 – Search by employee ID
  // ────────────────────────────────────────────────────────

  test.describe('TC_SEARCH_03 – Search by employee ID', () => {
    test('TC_SEARCH_03.1 - Should display exact matching employee when searched by employee ID', async ({ page }) => {
      await searchPage.search(testData.globalSearch.searchByEmployeeId);

      const count = await searchPage.getResultCount();
      expect(count).toBeGreaterThan(0);

      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).toContain(testData.globalSearch.expectedIdResult);

      console.log(`✅ Employee ID search "${testData.globalSearch.searchByEmployeeId}" → ${count} result(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_SEARCH_04 – Search by designation
  // ────────────────────────────────────────────────────────

  test.describe('TC_SEARCH_04 – Search by designation', () => {
    test('TC_SEARCH_04.1 - Should display employees matching the searched designation', async ({ page }) => {
      await searchPage.search(testData.globalSearch.searchByDesignation);

      const count = await searchPage.getResultCount();
      expect(count).toBeGreaterThan(0);

      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).toContain(testData.globalSearch.searchByDesignation);

      console.log(`✅ Designation search "${testData.globalSearch.searchByDesignation}" → ${count} result(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_SEARCH_05 – Search an invalid keyword
  // ────────────────────────────────────────────────────────

  test.describe('TC_SEARCH_05 – Search an invalid keyword', () => {
    test('TC_SEARCH_05.1 - Should display no results message for an invalid search term', async ({ page }) => {
      await searchPage.search(testData.globalSearch.invalidSearchTerm);

      await expect(searchPage.noResultsHeading).toBeVisible({ timeout: 5000 });
      await expect(searchPage.noResultsMessage).toBeVisible({ timeout: 5000 });

      const count = await searchPage.getResultCount();
      expect(count).toBe(0);

      console.log(`✅ Invalid search "${testData.globalSearch.invalidSearchTerm}" → "No results found" displayed`);
    });
  });
});
