import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class NotificationsPage extends BasePage {
  readonly notificationBell: Locator = this.page.locator('button[aria-label*="Notifications"]');
  readonly notificationPanel: Locator = this.page.locator('div[class*="absolute right-0 z-50"]');
  readonly markAllReadButton: Locator = this.page.locator('button:has-text("Mark all read")');
  readonly refreshButton: Locator = this.page.locator('button:has-text("Refresh notifications")');

  // Notification item buttons inside the panel (meaningful text length)
  notificationItems = () =>
    this.notificationPanel.locator('button').filter({ hasText: /.{20,}/ });

  constructor(page: Page) {
    super(page);
  }

  async openNotificationPanel(): Promise<void> {
    await this.click(this.notificationBell);
    await this.waitForVisible(this.notificationPanel);
  }

  async getUnreadCount(): Promise<number> {
    const ariaLabel = await this.notificationBell.getAttribute('aria-label');
    const match = ariaLabel?.match(/(\d+) unread/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
