import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class OpportunitiesPage extends BasePage {
  readonly postOpportunityButton: Locator = this.page.locator('button:has-text("Post opportunity")');
  readonly dialog: Locator = this.page.locator('dialog[open]');
  readonly titleInput: Locator = this.page.locator('dialog[open] #title');
  readonly departmentInput: Locator = this.page.locator('dialog[open] #department');
  readonly locationInput: Locator = this.page.locator('dialog[open] #location');
  readonly closingDateInput: Locator = this.page.locator('dialog[open] #closing-date');
  readonly descriptionTextarea: Locator = this.page.locator('dialog[open] #description');
  readonly publishButton: Locator = this.page.locator('dialog[open] button:has-text("Publish")');
  readonly pageHeading: Locator = this.page.locator('h1');

  // Post-level action buttons (scoped outside dialog)
  closePostButtons = () => this.page.locator('button').filter({ hasText: /^Close$/ });
  reopenPostButtons = () => this.page.locator('button').filter({ hasText: /^Reopen$/ });

  constructor(page: Page) {
    super(page);
  }

  async navigateToOpportunities(): Promise<void> {
    await this.goto('/opportunities');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.postOpportunityButton);
  }

  async openPostForm(): Promise<void> {
    await this.click(this.postOpportunityButton);
    await this.waitForVisible(this.dialog);
  }

  async createOpportunity(
    title: string,
    department: string = 'Engineering',
    location: string = 'Remote',
    closingDate: string = '2026-12-31',
    description: string = 'Automated test opportunity description.',
  ): Promise<void> {
    await this.openPostForm();
    await this.fill(this.titleInput, title);
    await this.fill(this.departmentInput, department);
    await this.fill(this.locationInput, location);
    await this.fill(this.closingDateInput, closingDate);
    await this.fill(this.descriptionTextarea, description);
    await this.click(this.publishButton);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
}
