import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // ===== LOGIN PAGE SELECTORS =====

  readonly emailInput: Locator = this.page.locator('#email-address');
  readonly passwordInput: Locator = this.page.locator('#password');

  // aria-label toggles between "Show password" and "Hide password"
  readonly passwordVisibilityIcon: Locator = this.page.locator('button[aria-label*="password"]');
  readonly signInButton: Locator = this.page.locator('button[type="submit"]');
  readonly rememberMeCheckbox: Locator = this.page.locator('#remember-me');
  readonly forgotPasswordLink: Locator = this.page.locator('a[href="/forgot-password"]');

  // Field-level validation uses role="alert"; .first() handles strict-mode when multiple errors show
  readonly errorMessage: Locator = this.page.locator('[role="alert"]').first();
  readonly successMessage: Locator = this.page.locator('[role="status"]');

  // ===== FORGOT PASSWORD PAGE SELECTORS =====

  readonly forgotPasswordEmailInput: Locator = this.page.locator('#email-address');
  readonly sendResetLinkButton: Locator = this.page.locator('button[type="submit"]');

  // Bottom "Back to login" text link — excludes the header logo link which carries aria-label
  readonly backToLoginLink: Locator = this.page.locator('a.inline-flex[href="/login"]');
  // After submitting, page shows a "Check your email" heading
  readonly resetConfirmationMessage: Locator = this.page.locator('h1:has-text("Check your email")');

  constructor(page: Page) {
    super(page);
  }

  async navigateToLoginPage(): Promise<void> {
    await this.goto('/login');
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.click(this.passwordVisibilityIcon);
  }

  async getPasswordInputType(): Promise<string | null> {
    return await this.getAttribute(this.passwordInput, 'type');
  }

  async verifyEmptyFieldsError(): Promise<void> {
    await this.click(this.signInButton);
    await this.waitForVisible(this.errorMessage);
  }

  async loginWithValidCredentials(username: string, password: string): Promise<void> {
    await this.fill(this.emailInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.signInButton);
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithRememberMe(username: string, password: string): Promise<void> {
    await this.fill(this.emailInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.rememberMeCheckbox);
    await this.click(this.signInButton);
    await this.page.waitForLoadState('networkidle');
  }

  async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }

  async navigateToForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async submitForgotPasswordForm(email: string): Promise<void> {
    await this.fill(this.forgotPasswordEmailInput, email);
    await this.click(this.sendResetLinkButton);
    await this.waitForVisible(this.resetConfirmationMessage);
  }

  async submitInvalidEmailToForgotPassword(invalidEmail: string): Promise<void> {
    await this.fill(this.forgotPasswordEmailInput, invalidEmail);
    await this.click(this.sendResetLinkButton);
    await this.waitForVisible(this.errorMessage);
  }

  async clickBackToLogin(): Promise<void> {
    await this.click(this.backToLoginLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyOnLoginPage(): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes('/login');
  }

  async verifyLoggedInSuccessfully(expectedUrl: string = '/dashboard'): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes(expectedUrl);
  }

  async getErrorMessageText(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async getResetConfirmationText(): Promise<string> {
    await this.waitForVisible(this.resetConfirmationMessage);
    return await this.getText(this.resetConfirmationMessage);
  }

  async clearLoginForm(): Promise<void> {
    await this.clear(this.emailInput);
    await this.clear(this.passwordInput);
  }

  async verifyLoginElementsVisible(): Promise<void> {
    await this.assertVisible(this.emailInput);
    await this.assertVisible(this.passwordInput);
    await this.assertVisible(this.passwordVisibilityIcon);
    await this.assertVisible(this.signInButton);
    await this.assertVisible(this.rememberMeCheckbox);
    await this.assertVisible(this.forgotPasswordLink);
  }
}
