import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { ProfileMenuPage } from '../../pages/profile-menu.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('My Profile Menu (Header) - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let profileMenuPage: ProfileMenuPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    profileMenuPage = new ProfileMenuPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  });

  // ────────────────────────────────────────────────────────
  // TC_PROFILE_01 – Open My Profile
  // ────────────────────────────────────────────────────────

  test.describe('TC_PROFILE_01 – Open My Profile', () => {
    test('TC_PROFILE_01.1 - Should navigate to My Profile page from the header profile menu', async ({ page }) => {
      await profileMenuPage.openProfileMenu();
      await profileMenuPage.click(profileMenuPage.myProfileItem);
      await page.waitForURL('**/profile', { timeout: 8000 });

      expect(page.url()).toContain('/profile');
      console.log(`✅ My Profile page opened at: ${page.url()}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_PROFILE_02 – Reset Password Navigation
  // ────────────────────────────────────────────────────────

  test.describe('TC_PROFILE_02 – Reset Password Navigation', () => {
    test('TC_PROFILE_02.1 - Should open the Reset Password dialog from the profile menu', async ({ page }) => {
      await profileMenuPage.openProfileMenu();
      await profileMenuPage.click(profileMenuPage.resetPasswordItem);

      await expect(profileMenuPage.resetPasswordDialog).toBeVisible({ timeout: 5000 });
      const dialogText = await profileMenuPage.resetPasswordDialog.textContent();
      expect(dialogText).toContain('Reset Password');

      console.log(`✅ Reset Password dialog opened successfully`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_PROFILE_03 – Help & Support
  // ────────────────────────────────────────────────────────

  test.describe('TC_PROFILE_03 – Help & Support', () => {
    test('TC_PROFILE_03.1 - Should navigate to the Help & Support page when selected from the profile menu', async ({ page, context }) => {
      await profileMenuPage.openProfileMenu();
      await expect(profileMenuPage.helpSupportItem).toBeVisible({ timeout: 3000 });

      // Help & Support may open in a new tab — listen for it
      const [newPage] = await Promise.all([
        context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
        profileMenuPage.click(profileMenuPage.helpSupportItem),
      ]);

      await page.waitForTimeout(1000);

      if (newPage) {
        // Opened in a new tab
        await newPage.waitForLoadState('load');
        const helpUrl = newPage.url();
        console.log(`✅ Help & Support opened in new tab: ${helpUrl}`);
        expect(helpUrl).not.toBe('about:blank');
      } else {
        // Should have navigated in the same tab — URL must change from /dashboard
        const currentUrl = page.url();
        console.log(`Help & Support URL after click: ${currentUrl}`);
        expect(currentUrl).not.toContain('/dashboard');
      }
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_PROFILE_04 – Sign Out
  // ────────────────────────────────────────────────────────

  test.describe('TC_PROFILE_04 – Sign Out', () => {
    test('TC_PROFILE_04.1 - Should sign out and redirect to the login page', async ({ page }) => {
      await profileMenuPage.openProfileMenu();
      await profileMenuPage.click(profileMenuPage.signOutItem);
      await page.waitForURL('**/login', { timeout: 8000 });

      expect(page.url()).toContain('/login');
      console.log(`✅ Signed out — redirected to login page: ${page.url()}`);
    });
  });
});
