import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfileMenuPage extends BasePage {
  // Header right-corner profile button (contains the logged-in user's name)
  readonly profileMenuButton: Locator = this.page.locator('button').filter({ hasText: /Morgan/ }).first();
  readonly myProfileItem: Locator = this.page.locator('button:has-text("My Profile")');
  readonly resetPasswordItem: Locator = this.page.locator('button:has-text("Reset Password")');
  readonly helpSupportItem: Locator = this.page.locator('button:has-text("Help & Support")');
  readonly signOutItem: Locator = this.page.locator('button:has-text("Sign out")');
  readonly resetPasswordDialog: Locator = this.page.locator('dialog[open]');

  constructor(page: Page) {
    super(page);
  }

  async openProfileMenu(): Promise<void> {
    await this.click(this.profileMenuButton);
    await this.page.waitForTimeout(500);
  }
}
