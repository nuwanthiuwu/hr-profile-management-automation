import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  // Page heading
  readonly pageHeading: Locator = this.page.locator('h1:has-text("Dashboard")');

  // Stat card values — ordered in DOM: Total Employees, Active, Inactive, Avg Profile Completion
  // Scoped to div.grid.gap-5 (the stats grid, distinct from the gap-3 quick-actions grid)
  readonly totalEmployeesValue: Locator = this.page.locator('div.grid.gap-5 p.text-2xl').nth(0);
  readonly activeEmployeesValue: Locator = this.page.locator('div.grid.gap-5 p.text-2xl').nth(1);
  readonly inactiveEmployeesValue: Locator = this.page.locator('div.grid.gap-5 p.text-2xl').nth(2);
  readonly avgCompletionValue: Locator = this.page.locator('div.grid.gap-5 p.text-2xl').nth(3);

  // Stat card labels
  readonly totalEmployeesLabel: Locator = this.page.locator('p:has-text("Total Employees")');
  // :text-is() is Playwright's exact-match selector — avoids "Inactive" matching "Active"
  readonly activeEmployeesLabel: Locator = this.page.locator('p:text-is("Active")');
  readonly inactiveEmployeesLabel: Locator = this.page.locator('p:text-is("Inactive")');
  readonly avgCompletionLabel: Locator = this.page.locator('p:has-text("Avg. Profile Completion")');

  // Quick action buttons (button elements, not links)
  readonly manageDesignationsButton: Locator = this.page.locator('button:has(p:has-text("Manage Designations"))');
  readonly createEmployeeButton: Locator = this.page.locator('button:has(p:has-text("Add New User"))');

  // Section headings
  readonly needsAttentionHeading: Locator = this.page.locator('h3:has-text("Needs Attention")');
  readonly recentEmployeesHeading: Locator = this.page.locator('h3:has-text("Recent Employees")');

  // Items within sections
  readonly needsAttentionItems: Locator = this.page.locator(
    'div.rounded-md:has(h3:has-text("Needs Attention")) button.flex.w-full'
  );
  readonly recentEmployeeNames: Locator = this.page.locator(
    'div.rounded-md:has(h3:has-text("Recent Employees")) p.text-sm.font-medium'
  );

  // "View all" button navigates to /employees
  readonly viewAllButton: Locator = this.page.locator('button:has-text("View all")');

  constructor(page: Page) {
    super(page);
  }

  async navigateToDashboard(): Promise<void> {
    await this.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.pageHeading);
  }

  async getStatValue(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return (await this.getText(locator)).trim();
  }

  async clickManageDesignations(): Promise<void> {
    await this.click(this.manageDesignationsButton);
    await this.page.waitForURL('**/designations', { timeout: 10000 });
  }

  async clickCreateEmployee(): Promise<void> {
    await this.click(this.createEmployeeButton);
    await this.page.waitForURL('**/employees/new', { timeout: 10000 });
  }

  async clickViewAll(): Promise<void> {
    await this.click(this.viewAllButton);
    await this.page.waitForURL('**/employees', { timeout: 10000 });
  }
}
