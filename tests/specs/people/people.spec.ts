import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { PeoplePage } from '../../pages/people.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('People Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let peoplePage: PeoplePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    peoplePage = new PeoplePage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await peoplePage.navigateToPeople();
  });

  // ────────────────────────────────────────────────────────
  // TC_PEOPLE_01 – Search by People name
  // ────────────────────────────────────────────────────────

  test.describe('TC_PEOPLE_01 – Search by People name', () => {
    test('TC_PEOPLE_01.1 - Should show matching people when searching by name', async ({ page }) => {
      await peoplePage.search(testData.people.searchByName);

      const count = await peoplePage.getPersonCardCount();
      expect(count).toBeGreaterThan(0);

      const bodyText = await page.evaluate(() => document.body.textContent ?? '');
      expect(bodyText).toContain(testData.people.expectedNameResult);

      console.log(`✅ Search by name "${testData.people.searchByName}" returned ${count} result(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_PEOPLE_02 – Search by Roles
  // ────────────────────────────────────────────────────────

  test.describe('TC_PEOPLE_02 – Search by Roles', () => {
    test('TC_PEOPLE_02.1 - Should show people with the searched role', async ({ page }) => {
      await peoplePage.search(testData.people.searchByRole);

      const count = await peoplePage.getPersonCardCount();
      expect(count).toBeGreaterThan(0);

      const firstCardText = await peoplePage.personCards.first().textContent();
      expect(firstCardText).toContain(testData.people.searchByRole);

      console.log(`✅ Search by role "${testData.people.searchByRole}" returned ${count} result(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_PEOPLE_03 – Search by Department
  // ────────────────────────────────────────────────────────

  test.describe('TC_PEOPLE_03 – Search by Department', () => {
    test('TC_PEOPLE_03.1 - Should show filtered results when searching by department', async ({ page }) => {
      const totalBefore = await peoplePage.getPersonCardCount();

      await peoplePage.search(testData.people.searchByDepartment);

      const countAfter = await peoplePage.getPersonCardCount();
      expect(countAfter).toBeGreaterThan(0);
      expect(countAfter).toBeLessThan(totalBefore);

      console.log(`✅ Search by department "${testData.people.searchByDepartment}" filtered: ${totalBefore} → ${countAfter}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_PEOPLE_04 – People cards
  // ────────────────────────────────────────────────────────

  test.describe('TC_PEOPLE_04 – People cards', () => {
    test('TC_PEOPLE_04.1 - Should display people cards on the People page', async ({ page }) => {
      await peoplePage.assertVisible(peoplePage.pageHeading);
      const headingText = await peoplePage.pageHeading.textContent();
      expect(headingText).toContain('Directory');

      const count = await peoplePage.getPersonCardCount();
      expect(count).toBeGreaterThan(0);

      await peoplePage.assertVisible(peoplePage.personCards.first());

      console.log(`✅ ${count} people cards visible on the Employee Directory page`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_PEOPLE_05 – Access people profile
  // ────────────────────────────────────────────────────────

  test.describe('TC_PEOPLE_05 – Access people profile', () => {
    test('TC_PEOPLE_05.1 - Should open the corresponding profile when a person card is clicked', async ({ page }) => {
      await peoplePage.clickFirstPersonCard();

      // URL should change to /directory/{id}
      expect(page.url()).toMatch(/\/directory\/[a-f0-9]+/);

      // Wait for profile content to render
      await expect(page.locator('text=Back to People')).toBeVisible({ timeout: 10000 });

      console.log(`✅ Person profile opened at: ${page.url()}`);
    });
  });
});
