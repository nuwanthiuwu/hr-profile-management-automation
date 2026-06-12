import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class PeoplePage extends BasePage {
  readonly searchInput: Locator = this.page.locator('input[placeholder="Search people, roles, or departments"]');
  // Person cards are <button> elements containing role keywords; sidebar buttons have aria-labels
  readonly personCards: Locator = this.page.locator('button').filter({
    hasText: /HR Admin|Software Engineer|Human Resources|Employee/,
  });
  readonly pageHeading: Locator = this.page.locator('h1');

  constructor(page: Page) {
    super(page);
  }

  async navigateToPeople(): Promise<void> {
    await this.goto('/directory');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.pageHeading);
  }

  async search(term: string): Promise<void> {
    await this.fill(this.searchInput, term);
    await this.page.waitForTimeout(800);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForTimeout(600);
  }

  async getPersonCardCount(): Promise<number> {
    return this.personCards.count();
  }

  async clickFirstPersonCard(): Promise<void> {
    await this.personCards.first().click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }
}
