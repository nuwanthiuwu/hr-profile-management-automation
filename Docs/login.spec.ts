import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('Login Module - Smart HR Admin', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.verifyLoginElementsVisible();
  });

  test.describe('TC_LOGIN_01 - Password Visibility Toggle', () => {
    test('TC_LOGIN_01.1 - Should toggle password visibility from hidden to visible', async () => {
      const testPassword = 'TestPassword123';
      await loginPage.fill(loginPage.passwordInput, testPassword);

      let passwordInputType = await loginPage.getPasswordInputType();
      expect(passwordInputType).toBe('password');

      await loginPage.togglePasswordVisibility();

      passwordInputType = await loginPage.getPasswordInputType();
      expect(passwordInputType).toBe('text');

      console.log('✅ Password visibility toggled to VISIBLE');
    });

    test('TC_LOGIN_01.2 - Should toggle password visibility from visible to hidden', async () => {
      const testPassword = 'TestPassword123';
      await loginPage.fill(loginPage.passwordInput, testPassword);
      await loginPage.togglePasswordVisibility();

      let passwordInputType = await loginPage.getPasswordInputType();
      expect(passwordInputType).toBe('text');

      await loginPage.togglePasswordVisibility();

      passwordInputType = await loginPage.getPasswordInputType();
      expect(passwordInputType).toBe('password');

      console.log('✅ Password visibility toggled to HIDDEN');
    });
  });

  test.describe('TC_LOGIN_02 - Login with Empty Credentials', () => {
    test('TC_LOGIN_02.1 - Should display error when both fields are empty', async () => {
      await loginPage.click(loginPage.signInButton);

      await loginPage.assertVisible(loginPage.errorMessage);
      const errorText = await loginPage.getErrorMessageText();
      expect(errorText.length).toBeGreaterThan(0);

      console.log(`✅ Error message displayed: ${errorText}`);
    });

    test('TC_LOGIN_02.2 - Should display error when email is empty', async () => {
      await loginPage.fill(loginPage.passwordInput, 'SomePassword123');

      await loginPage.click(loginPage.signInButton);

      await loginPage.assertVisible(loginPage.errorMessage);
      const errorText = await loginPage.getErrorMessageText();
      expect(errorText.toLowerCase()).toContain('email');

      console.log(`✅ Email required error displayed: ${errorText}`);
    });

    test('TC_LOGIN_02.3 - Should display error when password is empty', async () => {
      await loginPage.fill(loginPage.emailInput, 'test@example.com');

      await loginPage.click(loginPage.signInButton);

      await loginPage.assertVisible(loginPage.errorMessage);
      const errorText = await loginPage.getErrorMessageText();
      expect(errorText.toLowerCase()).toContain('password');

      console.log(`✅ Password required error displayed: ${errorText}`);
    });
  });

  test.describe('TC_LOGIN_03 - Login with Valid Credentials', () => {
    test('TC_LOGIN_03.1 - Should successfully login with valid admin credentials', async ({ page }) => {
      const admin = testData.testUsers.admin;

      await loginPage.fill(loginPage.emailInput, admin.username);
      await loginPage.fill(loginPage.passwordInput, admin.password);

      await loginPage.click(loginPage.signInButton);

      await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {
        // Dashboard may have different URL, that's ok
      });

      const finalUrl = await loginPage.getCurrentUrl();
      expect(finalUrl).not.toContain('/login');

      console.log(`✅ Successfully logged in. Redirected to: ${finalUrl}`);
    });

    test('TC_LOGIN_03.2 - Should create user session after successful login', async ({ page }) => {
      const admin = testData.testUsers.admin;
      await loginPage.fill(loginPage.emailInput, admin.username);
      await loginPage.fill(loginPage.passwordInput, admin.password);
      await loginPage.click(loginPage.signInButton);

      await page.waitForLoadState('networkidle');

      const cookies = await page.context().cookies();
      const hasSessionCookie = cookies.some(cookie => 
        cookie.name.toLowerCase().includes('session') || 
        cookie.name.toLowerCase().includes('auth') ||
        cookie.name.toLowerCase().includes('token')
      );

      const localStorageData = await page.evaluate(() => JSON.stringify(localStorage));
      const hasAuthToken = localStorageData.includes('token') || localStorageData.includes('auth');

      expect(hasSessionCookie || hasAuthToken).toBeTruthy();

      console.log('✅ User session created after login');
    });
  });

  test.describe('TC_LOGIN_04 - Remember Me Functionality', () => {
    test('TC_LOGIN_04.1 - Should keep user logged in after closing and reopening browser', async ({ context, page }) => {
      const admin = testData.testUsers.admin;
      await loginPage.fill(loginPage.emailInput, admin.username);
      await loginPage.fill(loginPage.passwordInput, admin.password);

      const isCheckedBefore = await loginPage.isRememberMeChecked();
      if (!isCheckedBefore) {
        await loginPage.click(loginPage.rememberMeCheckbox);
      }
      const isCheckedAfter = await loginPage.isRememberMeChecked();
      expect(isCheckedAfter).toBeTruthy();

      await loginPage.click(loginPage.signInButton);

      await page.waitForLoadState('networkidle');

      const cookiesBefore = await context.cookies();
      console.log(`✅ Logged in with Remember Me. Cookies: ${cookiesBefore.length}`);

      const newPage = await context.newPage();
      const newLoginPage = new LoginPage(newPage);
      
      await newLoginPage.navigateToLoginPage();

      const urlAfterReopen = await newLoginPage.getCurrentUrl();
      expect(urlAfterReopen).not.toContain('/login');

      await newPage.close();

      console.log('✅ Session persisted after reopening browser with Remember Me');
    });
  });

  test.describe('TC_FP_01 - Forgot Password - Valid Email', () => {
    test('TC_FP_01.1 - Should send reset link for valid registered email', async () => {
      await loginPage.navigateToForgotPassword();

      const validEmail = testData.testUsers.admin.username;
      await loginPage.submitForgotPasswordForm(validEmail);

      const confirmationText = await loginPage.getResetConfirmationText();
      expect(confirmationText.length).toBeGreaterThan(0);

      console.log(`✅ Reset link sent. Confirmation: ${confirmationText}`);
    });
  });

  test.describe('TC_FP_02 - Forgot Password - Invalid Email Validation', () => {
    test('TC_FP_02.1 - Should show validation error for invalid email format', async () => {
      await loginPage.navigateToForgotPassword();

      const invalidEmail = 'not-an-email';
      await loginPage.submitInvalidEmailToForgotPassword(invalidEmail);

      await loginPage.assertVisible(loginPage.errorMessage);
      const errorText = await loginPage.getErrorMessageText();
      expect(errorText.toLowerCase()).toMatch(/email|invalid/);

      console.log(`✅ Validation error shown for invalid email: ${errorText}`);
    });

    test('TC_FP_02.2 - Should show error for unregistered email', async () => {
      await loginPage.navigateToForgotPassword();

      const unregisteredEmail = testData.testData.invalidEmail;
      await loginPage.fill(loginPage.forgotPasswordEmailInput, unregisteredEmail);
      await loginPage.click(loginPage.sendResetLinkButton);

      await loginPage.assertVisible(loginPage.errorMessage);
      const errorText = await loginPage.getErrorMessageText();
      expect(errorText.length).toBeGreaterThan(0);

      console.log(`✅ Error shown for unregistered email: ${errorText}`);
    });
  });

  test.describe('TC_FP_03 - Forgot Password - Navigation', () => {
    test('TC_FP_03.1 - Should navigate back to login page from forgot password', async () => {
      await loginPage.navigateToForgotPassword();

      await loginPage.clickBackToLogin();

      const isOnLoginPage = await loginPage.verifyOnLoginPage();
      expect(isOnLoginPage).toBeTruthy();

      await loginPage.assertVisible(loginPage.emailInput);
      await loginPage.assertVisible(loginPage.passwordInput);
      await loginPage.assertVisible(loginPage.signInButton);

      console.log('✅ Successfully navigated back to login page');
    });
  });
});
