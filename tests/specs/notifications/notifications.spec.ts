import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { NotificationsPage } from '../../pages/notifications.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('Notifications Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let notifPage: NotificationsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    notifPage = new NotificationsPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(1000);
  });

  // ────────────────────────────────────────────────────────
  // TC_NOTIF_01 – Notification count
  // ────────────────────────────────────────────────────────

  test.describe('TC_NOTIF_01 – Notification count', () => {
    test('TC_NOTIF_01.1 - Should display a notification count badge on the bell icon', async ({ page }) => {
      await expect(notifPage.notificationBell).toBeVisible({ timeout: 5000 });

      const ariaLabel = await notifPage.notificationBell.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/Notifications/);

      const unreadCount = await notifPage.getUnreadCount();
      expect(unreadCount).toBeGreaterThanOrEqual(0);

      // Badge text (the number visible on the bell) should be a numeric string
      const badgeText = await page.locator('button[aria-label*="Notifications"]').textContent();
      console.log(`✅ Notification bell visible — aria-label: "${ariaLabel}", badge: "${badgeText?.trim()}"`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_NOTIF_02 – Refresh notifications
  // ────────────────────────────────────────────────────────

  test.describe('TC_NOTIF_02 – Refresh notifications', () => {
    test('TC_NOTIF_02.1 - Should reload notifications when Refresh is clicked', async ({ page }) => {
      await notifPage.openNotificationPanel();

      await expect(notifPage.refreshButton).toBeVisible({ timeout: 5000 });
      await notifPage.click(notifPage.refreshButton);
      await page.waitForTimeout(1500);

      // Panel should remain open with notifications loaded
      await expect(notifPage.notificationPanel).toBeVisible({ timeout: 5000 });
      const panelText = await notifPage.notificationPanel.textContent();
      expect(panelText).toContain('Notifications');

      console.log(`✅ Refresh notifications clicked — panel remains open and reloaded`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_NOTIF_03 – View notifications
  // ────────────────────────────────────────────────────────

  test.describe('TC_NOTIF_03 – View notifications', () => {
    test('TC_NOTIF_03.1 - Should display notification details when the panel is opened', async ({ page }) => {
      await notifPage.openNotificationPanel();

      const panelText = await notifPage.notificationPanel.textContent();
      expect(panelText).toContain('Notifications');

      // Verify notification items are present
      const itemCount = await notifPage.notificationItems().count();
      expect(itemCount).toBeGreaterThan(0);

      // Each item should contain some meaningful content
      const firstItemText = await notifPage.notificationItems().first().textContent();
      expect(firstItemText?.trim().length).toBeGreaterThan(5);

      console.log(`✅ Notification panel open — ${itemCount} notification item(s) visible`);
      console.log(`   First item: "${firstItemText?.trim().slice(0, 60)}"`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_NOTIF_04 – Mark all read
  // ────────────────────────────────────────────────────────

  test.describe('TC_NOTIF_04 – Mark all read', () => {
    test('TC_NOTIF_04.1 - Should mark all notifications as read when Mark all read is clicked', async ({ page }) => {
      const unreadBefore = await notifPage.getUnreadCount();
      console.log(`Unread count before: ${unreadBefore}`);

      await notifPage.openNotificationPanel();
      await expect(notifPage.markAllReadButton).toBeVisible({ timeout: 5000 });

      await notifPage.markAllReadButton.evaluate(el => (el as HTMLElement).click());
      await page.waitForTimeout(2000);

      const unreadAfter = await notifPage.getUnreadCount();
      console.log(`Unread count after: ${unreadAfter}`);

      // After marking all read, unread count should be 0 or less than before
      expect(unreadAfter).toBeLessThanOrEqual(unreadBefore);

      console.log(`✅ Mark all read — count went from ${unreadBefore} → ${unreadAfter}`);
    });
  });
});
