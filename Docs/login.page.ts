import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoginPage - Page Object for Smart HR Login Module
 * 
 * Covers:
 * - TC_LOGIN_01: Password visibility toggle
 * - TC_LOGIN_02: Login with empty credentials
 * - TC_LOGIN_03: Login with valid credentials
 * - TC_LOGIN_04: Remember Me functionality
 * - TC_FP_01-03: Forgot Password flows
 * 
 * ⚠️ IMPORTANT: Update selectors below with actual values from your application
 * Use Playwright Inspector: npx playwright codegen https://smart-hr-fe.vercel.app/login
 */

export class LoginPage extends BasePage {
  // ===== LOGIN PAGE SELECTORS =====
  // 🔧 UPDATE THESE WITH YOUR ACTUAL SELECTORS
  
  // Email/Username input
  readonly emailInput: Locator = this.page.locator('input[placeholder*="email"], input[name="email"], input[id*="email"]');
  
  // Password input
  readonly passwordInput: Locator = this.page.locator('input[placeholder*="password"], input[type="password"], input[name="password"]');
  
  // Password visibility toggle icon
  readonly passwordVisibilityIcon: Locator = this.page.locator('button[aria-label*="password"], .password-toggle, [data-testid*="visibility"]');
  
  // Sign In / Login button
  readonly signInButton: Locator = this.page.locator('button:has-text("Sign In"), button:has-text("Login"), button[type="submit"]');
  
  // Remember Me checkbox
  readonly rememberMeCheckbox: Locator = this.page.locator('input[type="checkbox"], label:has-text("Remember"), input[name*="remember"]');
  
  // Forgot Password link
  readonly forgotPasswordLink: Locator = this.page.locator('a:has-text("Forgot Password"), a:has-text("Forgot"), button:has-text("Forgot")');
  
  // Error message container
  readonly errorMessage: Locator = this.page.locator('[role="alert"], .error-message, .alert-danger, [class*="error"]');
  
  // Success message (after successful login)
  readonly successMessage: Locator = this.page.locator('[role="status"], .alert-success, [class*="success"]');
  
  // ===== FORGOT PASSWORD PAGE SELECTORS =====
  
  // Forgot password email input
  readonly forgotPasswordEmailInput: Locator = this.page.locator('input[placeholder*="email"], input[type="email"]');
  
  // Send Reset Link button
  readonly sendResetLinkButton: Locator = this.page.locator('button:has-text("Send"), button:has-text("Reset")');
  
  // Back to Login link
  readonly backToLoginLink: Locator = this.page.locator('a:has-text("Back to Login"), a:has-text("Back"), button:has-text("Back")');
  
  // Forgot password confirmation message
  readonly resetConfirmationMessage: Locator = this.page.locator('[class*="confirmation"], [class*="success"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    console.log('📍 Navigating to login page');
    await this.goto('/login');
  }

  /**
   * TC_LOGIN_01 - Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    console.log('🔐 Toggling password visibility');
    await this.click(this.passwordVisibilityIcon);
  }

  /**
   * Check if password input shows text or dots
   */
  async getPasswordInputType(): Promise<string | null> {
    return await this.getAttribute(this.passwordInput, 'type');
  }

  /**
   * TC_LOGIN_02 - Verify error message for empty fields
   */
  async verifyEmptyFieldsError(): Promise<void> {
    console.log('❌ Verifying empty fields error');
    await this.click(this.signInButton);
    await this.waitForVisible(this.errorMessage);
  }

  /**
   * TC_LOGIN_03 - Login with valid credentials
   */
  async loginWithValidCredentials(username: string, password: string): Promise<void> {
    console.log('✅ Logging in with valid credentials');
    await this.fill(this.emailInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.signInButton);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * TC_LOGIN_04 - Login with Remember Me
   */
  async loginWithRememberMe(username: string, password: string): Promise<void> {
    console.log('✅ Logging in with Remember Me enabled');
    await this.fill(this.emailInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.rememberMeCheckbox);
    await this.click(this.signInButton);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if Remember Me is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }

  /**
   * TC_FP_01 - Navigate to Forgot Password
   */
  async navigateToForgotPassword(): Promise<void> {
    console.log('🔗 Navigating to Forgot Password');
    await this.click(this.forgotPasswordLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * TC_FP_01 - Send reset link with valid email
   */
  async submitForgotPasswordForm(email: string): Promise<void> {
    console.log(`📧 Submitting forgot password form with email: ${email}`);
    await this.fill(this.forgotPasswordEmailInput, email);
    await this.click(this.sendResetLinkButton);
    await this.waitForVisible(this.resetConfirmationMessage);
  }

  /**
   * TC_FP_02 - Submit forgot password with invalid email
   */
  async submitInvalidEmailToForgotPassword(invalidEmail: string): Promise<void> {
    console.log(`❌ Submitting invalid email to forgot password: ${invalidEmail}`);
    await this.fill(this.forgotPasswordEmailInput, invalidEmail);
    await this.click(this.sendResetLinkButton);
    await this.waitForVisible(this.errorMessage);
  }

  /**
   * TC_FP_03 - Click Back to Login
   */
  async clickBackToLogin(): Promise<void> {
    console.log('🔙 Clicking Back to Login');
    await this.click(this.backToLoginLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Verify we are on login page
   */
  async verifyOnLoginPage(): Promise<boolean> {
    console.log('✅ Verifying on login page');
    const url = await this.getCurrentUrl();
    return url.includes('/login');
  }

  /**
   * Verify logged in successfully
   */
  async verifyLoggedInSuccessfully(expectedUrl: string = '/dashboard'): Promise<boolean> {
    console.log('✅ Verifying logged in successfully');
    const url = await this.getCurrentUrl();
    return url.includes(expectedUrl);
  }

  /**
   * Get error message text
   */
  async getErrorMessageText(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Get reset confirmation message text
   */
  async getResetConfirmationText(): Promise<string> {
    await this.waitForVisible(this.resetConfirmationMessage);
    return await this.getText(this.resetConfirmationMessage);
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    console.log('🗑️  Clearing login form');
    await this.clear(this.emailInput);
    await this.clear(this.passwordInput);
  }

  /**
   * Verify all login elements are visible
   */
  async verifyLoginElementsVisible(): Promise<void> {
    console.log('👁️  Verifying login elements are visible');
    await this.assertVisible(this.emailInput);
    await this.assertVisible(this.passwordInput);
    await this.assertVisible(this.passwordVisibilityIcon);
    await this.assertVisible(this.signInButton);
    await this.assertVisible(this.rememberMeCheckbox);
    await this.assertVisible(this.forgotPasswordLink);
  }
}
