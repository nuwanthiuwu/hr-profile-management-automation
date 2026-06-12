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
    test('TC_PROFILE_03.1 - Should keep user on the app when Help & Support is selected', async ({ page }) => {
      await profileMenuPage.openProfileMenu();

      // Verify Help & Support item is visible and accessible
      await expect(profileMenuPage.helpSupportItem).toBeVisible({ timeout: 3000 });
      await profileMenuPage.click(profileMenuPage.helpSupportItem);
      await page.waitForTimeout(1000);

      // User should remain on the application (not logged out or navigated away)
      expect(page.url()).toContain('smart-hr-fe.vercel.app');
      expect(page.url()).not.toContain('/login');

      console.log(`✅ Help & Support clicked — user remains on app at: ${page.url()}`);
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
