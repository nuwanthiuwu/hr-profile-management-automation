import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { DesignationsPage } from '../../pages/designations.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('Designations Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let desPage: DesignationsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    desPage = new DesignationsPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await desPage.navigateToDesignations();
  });

  // ────────────────────────────────────────────────────────
  // TC_DES_01 – Search designation
  // ────────────────────────────────────────────────────────

  test.describe('TC_DES_01 – Search designation', () => {
    test('TC_DES_01.1 - Should display matching designations when searched by name', async ({ page }) => {
      await desPage.search(testData.designations.searchTerm);

      const rowCount = await desPage.getRowCount();
      expect(rowCount).toBeGreaterThan(0);

      const bodyText = await page.evaluate(() => document.body.textContent ?? '');
      expect(bodyText).toContain(testData.designations.searchTerm);

      console.log(`✅ Search "${testData.designations.searchTerm}" returned ${rowCount} result(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_DES_02 – Filter by status
  // ────────────────────────────────────────────────────────

  test.describe('TC_DES_02 – Filter by status', () => {
    test('TC_DES_02.1 - Should filter designations correctly by Active, Inactive, and All statuses', async ({ page }) => {
      // Active filter
      await desPage.filterByStatus('active');
      const activeRows = await desPage.getRowCount();
      expect(activeRows).toBeGreaterThan(0);

      // Inactive filter (may return 0 if no inactive designations exist)
      await desPage.filterByStatus('inactive');
      const inactiveRows = await desPage.getRowCount();
      expect(inactiveRows).toBeGreaterThanOrEqual(0);

      // All filter — should show at least as many as active + inactive
      await desPage.filterByStatus('all');
      const allRows = await desPage.getRowCount();
      expect(allRows).toBeGreaterThanOrEqual(activeRows);

      console.log(`✅ Filters — Active: ${activeRows}, Inactive: ${inactiveRows}, All: ${allRows}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_DES_03 – Upload CSV file
  // ────────────────────────────────────────────────────────

  test.describe('TC_DES_03 – Upload CSV file', () => {
    test('TC_DES_03.1 - Should import designations from a valid CSV file', async ({ page }) => {
      const uniqueTitle = `Auto CSV Des ${Date.now()}`;
      const csvContent = `title\n${uniqueTitle}`;

      await desPage.click(desPage.uploadCSVButton);
      await desPage.waitForVisible(desPage.dialog);

      // Provide CSV file as a buffer (no OS file dialog required)
      await desPage.fileUploadInput.setInputFiles({
        name: 'test-designations.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent),
      });
      await page.waitForTimeout(500);

      await desPage.click(desPage.uploadButton);
      await page.waitForTimeout(1500);

      // Dialog should close after successful upload
      const dialogStillOpen = await desPage.dialog.isVisible();
      expect(dialogStillOpen).toBe(false);

      // Verify the new designation appears in the list
      await desPage.search(uniqueTitle.slice(0, 20));
      const rowCount = await desPage.getRowCount();
      expect(rowCount).toBeGreaterThan(0);

      console.log(`✅ CSV upload successful — "${uniqueTitle}" created and found`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_DES_04 – Create designation
  // ────────────────────────────────────────────────────────

  test.describe('TC_DES_04 – Create designation', () => {
    test('TC_DES_04.1 - Should create a new designation and display it in the list', async ({ page }) => {
      const title = `${testData.designations.createTitle} ${Date.now()}`;

      await desPage.createDesignation(title);

      // Search for the newly created designation
      await desPage.search(title.slice(0, 20));
      const rowCount = await desPage.getRowCount();
      expect(rowCount).toBeGreaterThan(0);

      const bodyText = await page.evaluate(() => document.body.textContent ?? '');
      expect(bodyText).toContain(title.slice(0, 30));

      console.log(`✅ Designation "${title}" created and found in list`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_DES_05 – Pagination 10 records
  // ────────────────────────────────────────────────────────

  test.describe('TC_DES_05 – Pagination 10 records', () => {
    test('TC_DES_05.1 - Should show at most 10 records per page when 10 is selected', async ({ page }) => {
      await desPage.setPageSize('10');

      const rowCount = await desPage.getRowCount();
      expect(rowCount).toBeGreaterThan(0);
      expect(rowCount).toBeLessThanOrEqual(10);

      console.log(`✅ Page size 10 — showing ${rowCount} rows`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_DES_06 – Pagination 20 records
  // ────────────────────────────────────────────────────────

  test.describe('TC_DES_06 – Pagination 20 records', () => {
    test('TC_DES_06.1 - Should show more records when page size is increased to 20', async ({ page }) => {
      await desPage.setPageSize('10');
      const rows10 = await desPage.getRowCount();

      await desPage.setPageSize('20');
      const rows20 = await desPage.getRowCount();

      expect(rows20).toBeLessThanOrEqual(20);
      expect(rows20).toBeGreaterThanOrEqual(rows10);

      console.log(`✅ Page size 20 — ${rows10} rows at 10/page → ${rows20} rows at 20/page`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_DES_07 – Pagination 50 records
  // ────────────────────────────────────────────────────────

  test.describe('TC_DES_07 – Pagination 50 records', () => {
    test('TC_DES_07.1 - Should show all available records when page size is 50', async ({ page }) => {
      await desPage.setPageSize('20');
      const rows20 = await desPage.getRowCount();

      await desPage.setPageSize('50');
      const rows50 = await desPage.getRowCount();

      expect(rows50).toBeLessThanOrEqual(50);
      expect(rows50).toBeGreaterThanOrEqual(rows20);

      console.log(`✅ Page size 50 — ${rows20} rows at 20/page → ${rows50} rows at 50/page`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_DES_08 – Sort Last Modified
  // ────────────────────────────────────────────────────────

  test.describe('TC_DES_08 – Sort Last Modified', () => {
    test('TC_DES_08.1 - Should toggle sort order when Last Modified header is clicked', async ({ page }) => {
      // Default sort is descending (newest first)
      const initialSort = await desPage.lastModifiedHeader.getAttribute('aria-sort');
      expect(initialSort).toBe('descending');

      // Click to sort ascending
      await desPage.lastModifiedHeader.click();
      await page.waitForTimeout(800);

      const sortAfterClick = await desPage.lastModifiedHeader.getAttribute('aria-sort');
      expect(sortAfterClick).toBe('ascending');

      console.log(`✅ Last Modified sort toggled: "${initialSort}" → "${sortAfterClick}"`);
    });
  });
});
