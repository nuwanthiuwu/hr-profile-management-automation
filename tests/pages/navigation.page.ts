import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class NavigationPage extends BasePage {
  // Sidebar nav links — hrefs discovered from live app
  readonly dashboardLink: Locator = this.page.locator('a[href="/dashboard"]');
  readonly employeesLink: Locator = this.page.locator('a[href="/employees"]');
  readonly wallLink: Locator = this.page.locator('a[href="/wall"]');
  // "People" menu item routes to /directory in the app
  readonly peopleLink: Locator = this.page.locator('a[href="/directory"]');
  readonly opportunitiesLink: Locator = this.page.locator('a[href="/opportunities"]');
  readonly designationsLink: Locator = this.page.locator('a[href="/designations"]');
  readonly cvTemplatesLink: Locator = this.page.locator('a[href="/cv-templates"]');
  readonly myProfileLink: Locator = this.page.locator('a[href="/profile"]');
  readonly sidebar: Locator = this.page.locator('aside');

  constructor(page: Page) {
    super(page);
  }

  async clickDashboard(): Promise<void> {
    await this.click(this.dashboardLink);
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  async clickEmployees(): Promise<void> {
    await this.click(this.employeesLink);
    await this.page.waitForURL('**/employees', { timeout: 10000 });
  }

  async clickWall(): Promise<void> {
    await this.click(this.wallLink);
    await this.page.waitForURL('**/wall', { timeout: 10000 });
  }

  async clickPeople(): Promise<void> {
    await this.click(this.peopleLink);
    await this.page.waitForURL('**/directory', { timeout: 10000 });
  }

  async clickOpportunities(): Promise<void> {
    await this.click(this.opportunitiesLink);
    await this.page.waitForURL('**/opportunities', { timeout: 10000 });
  }

  async clickDesignations(): Promise<void> {
    await this.click(this.designationsLink);
    await this.page.waitForURL('**/designations', { timeout: 10000 });
  }

  async clickCVTemplates(): Promise<void> {
    await this.click(this.cvTemplatesLink);
    await this.page.waitForURL('**/cv-templates', { timeout: 10000 });
  }

  async clickMyProfile(): Promise<void> {
    await this.click(this.myProfileLink);
    await this.page.waitForURL('**/profile', { timeout: 10000 });
  }

  async verifySidebarVisible(): Promise<void> {
    await this.assertVisible(this.sidebar);
  }
}
