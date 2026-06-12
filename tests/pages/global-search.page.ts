import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class GlobalSearchPage extends BasePage {
  readonly searchButton: Locator = this.page.locator('button[aria-label="Search (Cmd+K)"]');
  readonly searchInput: Locator = this.page.locator('input[placeholder*="Search by name"]');
  readonly resultCards: Locator = this.page.locator('[role="search"] button').filter({ hasText: /active|inactive/i });
  readonly noResultsHeading: Locator = this.page.locator('h3').filter({ hasText: 'No results found' });
  readonly noResultsMessage: Locator = this.page.locator('p').filter({ hasText: /couldn't find/ });
  readonly clearButton: Locator = this.page.locator('button[aria-label="Clear search"]');

  constructor(page: Page) {
    super(page);
  }

  async openSearch(): Promise<void> {
    await this.click(this.searchButton);
    await this.page.waitForURL('**/search', { timeout: 8000 });
    await this.waitForVisible(this.searchInput);
  }

  async search(term: string): Promise<void> {
    await this.fill(this.searchInput, term);
    await this.page.waitForTimeout(1500);
  }

  async getResultCount(): Promise<number> {
    return this.resultCards.count();
  }
}
