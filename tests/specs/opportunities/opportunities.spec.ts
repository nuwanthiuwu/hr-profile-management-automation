import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { OpportunitiesPage } from '../../pages/opportunities.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

function uniqueTitle(prefix: string): string {
  return `${prefix} ${Date.now()}`;
}

test.describe('Opportunities Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let oppPage: OpportunitiesPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    oppPage = new OpportunitiesPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await oppPage.navigateToOpportunities();
  });

  // ────────────────────────────────────────────────────────
  // TC_OPP_01 – Create a post
  // ────────────────────────────────────────────────────────

  test.describe('TC_OPP_01 – Create a post', () => {
    test('TC_OPP_01.1 - Should create a new opportunity post and display it in the list', async ({ page }) => {
      const title = uniqueTitle(testData.opportunities.postTitle);

      await oppPage.createOpportunity(
        title,
        testData.opportunities.department,
        testData.opportunities.location,
        testData.opportunities.closingDate,
        testData.opportunities.description,
      );

      // Dialog should be closed and post should appear
      const dialogOpen = await oppPage.dialog.isVisible();
      expect(dialogOpen).toBe(false);

      await expect(page.locator(`text="${title.substring(0, 30)}"`)).toBeVisible({ timeout: 10000 });

      console.log(`✅ Opportunity "${title}" created and visible in the list`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_OPP_02 – Reopen the post
  // ────────────────────────────────────────────────────────

  test.describe('TC_OPP_02 – Reopen the post', () => {
    test('TC_OPP_02.1 - Should change button to "Close" when a closed post is reopened', async ({ page }) => {
      // Ensure at least one "Reopen" button exists — close a post first if needed
      let reopenCount = await oppPage.reopenPostButtons().count();
      if (reopenCount === 0) {
        const closeBtns = oppPage.closePostButtons();
        expect(await closeBtns.count()).toBeGreaterThan(0);
        await closeBtns.first().click();
        await page.waitForTimeout(1000);
        reopenCount = await oppPage.reopenPostButtons().count();
      }
      expect(reopenCount).toBeGreaterThan(0);

      const closeBtnCountBefore = await oppPage.closePostButtons().count();

      await oppPage.reopenPostButtons().first().click();
      await page.waitForTimeout(1200);

      const closeBtnCountAfter = await oppPage.closePostButtons().count();
      expect(closeBtnCountAfter).toBeGreaterThan(closeBtnCountBefore);

      console.log(`✅ Post reopened — "Close" buttons: ${closeBtnCountBefore} → ${closeBtnCountAfter}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_OPP_03 – Close the post
  // ────────────────────────────────────────────────────────

  test.describe('TC_OPP_03 – Close the post', () => {
    test('TC_OPP_03.1 - Should change button to "Reopen" when a post is closed', async ({ page }) => {
      // Ensure at least one "Close" button exists — reopen a post first if needed
      let closeCount = await oppPage.closePostButtons().count();
      if (closeCount === 0) {
        const reopenBtns = oppPage.reopenPostButtons();
        expect(await reopenBtns.count()).toBeGreaterThan(0);
        await reopenBtns.first().click();
        await page.waitForTimeout(1000);
        closeCount = await oppPage.closePostButtons().count();
      }
      expect(closeCount).toBeGreaterThan(0);

      const reopenCountBefore = await oppPage.reopenPostButtons().count();

      await oppPage.closePostButtons().first().click();
      await page.waitForTimeout(1200);

      const reopenCountAfter = await oppPage.reopenPostButtons().count();
      expect(reopenCountAfter).toBeGreaterThan(reopenCountBefore);

      console.log(`✅ Post closed — "Reopen" buttons: ${reopenCountBefore} → ${reopenCountAfter}`);
    });
  });
});
