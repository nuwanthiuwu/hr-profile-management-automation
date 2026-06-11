import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  // ===== PAGE HEADER =====
  readonly pageHeading: Locator = this.page.locator('h1').first();
  readonly profilePictureButton: Locator = this.page.locator('button[aria-label="Change profile picture"]');
  readonly profilePictureInput: Locator = this.page.locator('input[accept*="image/png"]').first();

  // ===== TABS =====
  readonly personalTab: Locator = this.page.locator('[role="tab"]:has-text("Personal")');
  readonly workContactTab: Locator = this.page.locator('[role="tab"]:has-text("Work & Contact")');
  readonly educationSkillsTab: Locator = this.page.locator('[role="tab"]:has-text("Education & Skills")');
  readonly workExperienceTab: Locator = this.page.locator('[role="tab"]:has-text("Work Experience")');
  readonly accomplishmentsTab: Locator = this.page.locator('[role="tab"]:has-text("Accomplishments")');
  readonly documentsTab: Locator = this.page.locator('[role="tab"]:has-text("Documents")');
  readonly securityTab: Locator = this.page.locator('[role="tab"]:has-text("Security")');

  // ===== PERSONAL TAB FIELDS =====
  readonly firstNameInput: Locator = this.page.locator('#first-name');
  readonly lastNameInput: Locator = this.page.locator('#last-name');
  readonly dateOfBirthInput: Locator = this.page.locator('#date-of-birth');
  readonly emailInput: Locator = this.page.locator('#email');
  readonly professionalSummaryTextarea: Locator = this.page.locator('#professional-summary');

  // ===== WORK & CONTACT TAB FIELDS =====
  readonly contactNumberInput: Locator = this.page.locator('#contact-number');
  readonly addressInput: Locator = this.page.locator('#address');

  // ===== EDUCATION / EXPERIENCE / ACCOMPLISHMENTS TABS =====
  // These tabs show existing entries with "Add" buttons to create new ones
  readonly addButton: Locator = this.page.locator('button[type="button"]:has-text("Add")').first();

  // ===== DOCUMENTS TAB =====
  readonly cvFileInput: Locator = this.page.locator('#uploaded-cv');
  readonly openCvButton: Locator = this.page.locator('button:has-text("Open CV")');

  // ===== SECURITY TAB =====
  readonly resetPasswordButton: Locator = this.page.locator('button:has-text("Reset Password")');

  // ===== GLOBAL ACTIONS =====
  readonly saveChangesButton: Locator = this.page.locator('button[type="submit"]:has-text("Save Changes")');
  readonly cancelButton: Locator = this.page.locator('button[type="button"]:has-text("Cancel")');
  readonly signOutButton: Locator = this.page.locator('button:has-text("Sign Out")');

  // ===== FEEDBACK =====
  readonly successToast: Locator = this.page.locator('[role="status"],[role="alert"]').filter({ hasText: /saved|updated|success/i });

  constructor(page: Page) {
    super(page);
  }

  async navigateToProfile(): Promise<void> {
    await this.goto('/profile');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.pageHeading);
  }

  async clickTab(tab: Locator): Promise<void> {
    await this.click(tab);
    await this.page.waitForTimeout(400);
  }

  async saveChanges(): Promise<void> {
    await this.click(this.saveChangesButton);
    await this.page.waitForTimeout(1000);
  }

  async cancelChanges(): Promise<void> {
    await this.click(this.cancelButton);
    await this.page.waitForTimeout(500);
  }

  async signOut(): Promise<void> {
    await this.click(this.signOutButton);
    await this.page.waitForURL('**/login', { timeout: 10000 });
  }
}
