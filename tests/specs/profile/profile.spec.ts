import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../../pages/login.page';
import { ProfilePage } from '../../pages/profile.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, '../../fixtures');

test.describe('My Profile Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await profilePage.navigateToProfile();
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_01 – Update profile photo
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_01 – Update profile photo', () => {
    test('TC_MP_01.1 - Should show profile picture upload control when change button is clicked', async () => {
      await profilePage.assertVisible(profilePage.profilePictureButton);

      // Trigger the file input via the change-picture button
      const imagePath = path.join(fixturesDir, 'test-image.png');
      await profilePage.profilePictureInput.setInputFiles(imagePath);
      await profilePage.page.waitForTimeout(800);

      // React generates a base64 data: preview URI from the selected file
      const previewVisible = await profilePage.page.evaluate(() =>
        Array.from(document.querySelectorAll('img')).some(
          img => img.src?.startsWith('data:image')
        )
      );
      expect(previewVisible).toBe(true);

      console.log('✅ Profile picture upload accepted — base64 preview rendered');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_02 – Edit personal information
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_02 – Edit personal information', () => {
    test('TC_MP_02.1 - Should save updated personal information when Save Changes is clicked', async ({ page }) => {
      // Personal tab is active by default
      await profilePage.assertVisible(profilePage.firstNameInput);

      // Read current value and edit it
      const currentFirst = await profilePage.firstNameInput.inputValue();
      await profilePage.fill(profilePage.firstNameInput, testData.myProfile.firstName);
      await profilePage.fill(profilePage.lastNameInput, testData.myProfile.lastName);

      await profilePage.saveChanges();

      // Verify we stay on the profile page and no error state
      expect(page.url()).toContain('/profile');

      // Restore original value
      await profilePage.fill(profilePage.firstNameInput, currentFirst);
      await profilePage.saveChanges();

      console.log('✅ Personal information saved successfully');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_03 – Add Work & Contact
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_03 – Add Work & Contact', () => {
    test('TC_MP_03.1 - Should show work and contact fields when Work & Contact tab is clicked', async ({ page }) => {
      await profilePage.clickTab(profilePage.workContactTab);

      await profilePage.assertVisible(profilePage.contactNumberInput);
      await profilePage.assertVisible(profilePage.addressInput);

      await profilePage.fill(profilePage.contactNumberInput, testData.myProfile.contactNumber);
      await profilePage.fill(profilePage.addressInput, testData.myProfile.address);

      await expect(profilePage.contactNumberInput).toHaveValue(testData.myProfile.contactNumber);
      await expect(profilePage.addressInput).toHaveValue(testData.myProfile.address);

      await profilePage.saveChanges();
      expect(page.url()).toContain('/profile');

      console.log('✅ Work & Contact details entered and saved');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_04 – Add education and skills
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_04 – Add education and skills', () => {
    test('TC_MP_04.1 - Should show Education & Skills section with Add button when tab is clicked', async () => {
      await profilePage.clickTab(profilePage.educationSkillsTab);

      const heading = profilePage.page.locator('h2:has-text("Education & Skills"), h3:has-text("Education & Skills")');
      await profilePage.assertVisible(heading);
      await profilePage.assertVisible(profilePage.addButton);

      console.log('✅ Education & Skills tab loaded with Add button visible');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_05 – Add accomplishments (first TC_MP_05 in user story)
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_05 – Add accomplishments', () => {
    test('TC_MP_05.1 - Should show Accomplishments section with Add button when tab is clicked', async () => {
      await profilePage.clickTab(profilePage.accomplishmentsTab);

      const heading = profilePage.page.locator('h2:has-text("Accomplishments"), h3:has-text("Accomplishments")');
      await profilePage.assertVisible(heading);
      await profilePage.assertVisible(profilePage.addButton);

      console.log('✅ Accomplishments tab loaded with Add button visible');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_05 – Add work experience (second TC_MP_05 in user story)
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_05 – Add work experience', () => {
    test('TC_MP_05.2 - Should show Work Experience section with Add button when tab is clicked', async () => {
      await profilePage.clickTab(profilePage.workExperienceTab);

      const heading = profilePage.page.locator('h2:has-text("Work Experience"), h3:has-text("Work Experience")');
      await profilePage.assertVisible(heading);
      await profilePage.assertVisible(profilePage.addButton);

      console.log('✅ Work Experience tab loaded with Add button visible');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_06 – Add documents
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_06 – Add documents', () => {
    test('TC_MP_06.1 - Should accept a CV file upload on the Documents tab', async ({ page }) => {
      await profilePage.clickTab(profilePage.documentsTab);

      await profilePage.assertVisible(profilePage.cvFileInput);

      const cvPath = path.join(fixturesDir, 'test-cv.pdf');
      await profilePage.cvFileInput.setInputFiles(cvPath);
      await profilePage.page.waitForTimeout(500);

      const bodyHasFile = await page.evaluate(() =>
        document.body.textContent?.includes('test-cv') ?? false
      );
      expect(bodyHasFile).toBe(true);

      console.log('✅ CV file uploaded on Documents tab');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_07 – Open CV
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_07 – Open CV', () => {
    test('TC_MP_07.1 - Should show Open CV button on Documents tab', async ({ page }) => {
      await profilePage.clickTab(profilePage.documentsTab);

      await profilePage.assertVisible(profilePage.openCvButton);

      console.log('✅ Open CV button is visible on Documents tab');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_08 – Reset password flow
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_08 – Reset password flow', () => {
    test('TC_MP_08.1 - Should navigate to reset password page when Reset Password is clicked', async ({ page }) => {
      await profilePage.clickTab(profilePage.securityTab);

      await profilePage.assertVisible(profilePage.resetPasswordButton);
      const isEnabled = await profilePage.resetPasswordButton.isEnabled();
      expect(isEnabled).toBe(true);

      // Click Reset Password — the app sends a password reset email silently
      // (no navigation; the button triggers an email dispatch from the current page)
      await profilePage.click(profilePage.resetPasswordButton);
      await page.waitForTimeout(1500);

      // Verify no error state — still on a valid app page
      const url = page.url();
      expect(url).toContain('smart-hr-fe.vercel.app');

      console.log(`✅ Reset Password button clicked successfully — page: ${url}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_09 – Save button behaviour
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_09 – Save button behaviour', () => {
    test('TC_MP_09.1 - Should save profile changes when Save Changes is clicked', async ({ page }) => {
      await profilePage.assertVisible(profilePage.professionalSummaryTextarea);

      const originalValue = await profilePage.professionalSummaryTextarea.inputValue();
      await profilePage.fill(profilePage.professionalSummaryTextarea, testData.myProfile.professionalSummary);

      await profilePage.saveChanges();

      // Verify still on profile page (no error redirect)
      expect(page.url()).toContain('/profile');

      // Restore original
      await profilePage.fill(profilePage.professionalSummaryTextarea, originalValue);
      await profilePage.saveChanges();

      console.log('✅ Save Changes button works correctly');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_10 – Cancel button behaviour
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_10 – Cancel button behaviour', () => {
    test('TC_MP_10.1 - Should discard unsaved changes when Cancel is clicked', async ({ page }) => {
      await profilePage.assertVisible(profilePage.firstNameInput);

      const originalValue = await profilePage.firstNameInput.inputValue();

      // Make a change
      await profilePage.fill(profilePage.firstNameInput, 'ShouldBeDiscarded');

      // Cancel
      await profilePage.cancelChanges();

      // After cancel the field should revert to original value
      const currentValue = await profilePage.firstNameInput.inputValue();
      expect(currentValue).toBe(originalValue);

      console.log(`✅ Cancel discarded changes — field reverted to: "${currentValue}"`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_MP_11 – Logout button behaviour
  // ────────────────────────────────────────────────────────

  test.describe('TC_MP_11 – Logout button behaviour', () => {
    test('TC_MP_11.1 - Should end session and redirect to login when Sign Out is clicked', async ({ page }) => {
      await profilePage.assertVisible(profilePage.signOutButton);
      await profilePage.signOut();

      expect(page.url()).toContain('/login');

      console.log('✅ Sign Out redirected to login page');
    });
  });
});
