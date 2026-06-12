import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DesignationsPage extends BasePage {
  readonly searchInput: Locator = this.page.locator('input[placeholder="Search designations..."]');
  // First <select> on the page is the status filter
  readonly statusSelect: Locator = this.page.locator('select').first();
  readonly pageSizeSelect: Locator = this.page.locator('#page-size-select');
  readonly uploadCSVButton: Locator = this.page.locator('button:has-text("Upload CSV")');
  readonly createDesignationButton: Locator = this.page.locator('button:has-text("Create Designation")');
  readonly tableRows: Locator = this.page.locator('tbody tr');
  // Last Modified th has cursor:pointer and aria-sort attribute
  readonly lastModifiedHeader: Locator = this.page.locator('th').filter({ hasText: /Last Modified/i });
  readonly dialog: Locator = this.page.locator('dialog[open]');
  readonly designationTitleInput: Locator = this.page.locator('dialog[open] #designation-title');
  readonly createButton: Locator = this.page.locator('dialog[open] button:has-text("Create")');
  readonly fileUploadInput: Locator = this.page.locator('#file-upload-input');
  readonly uploadButton: Locator = this.page.locator('dialog[open] button').filter({ hasText: /^Upload$/ });

  constructor(page: Page) {
    super(page);
  }

  async navigateToDesignations(): Promise<void> {
    await this.goto('/designations');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.createDesignationButton);
  }

  async search(term: string): Promise<void> {
    await this.fill(this.searchInput, term);
    await this.page.waitForTimeout(800);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForTimeout(600);
  }

  async filterByStatus(status: 'all' | 'active' | 'inactive'): Promise<void> {
    await this.statusSelect.selectOption(status);
    await this.page.waitForTimeout(800);
  }

  async setPageSize(size: '10' | '20' | '50'): Promise<void> {
    await this.pageSizeSelect.selectOption(size);
    await this.page.waitForTimeout(800);
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async createDesignation(title: string): Promise<void> {
    await this.click(this.createDesignationButton);
    await this.waitForVisible(this.dialog);
    await this.fill(this.designationTitleInput, title);
    await this.click(this.createButton);
    await this.page.waitForTimeout(1000);
  }

  async getTotalCount(): Promise<number> {
    const match = await this.page.evaluate(() =>
      document.body.textContent?.match(/(\d+)-\d+ of (\d+)/)?.[2] ?? '0'
    );
    return parseInt(match, 10);
  }
}
