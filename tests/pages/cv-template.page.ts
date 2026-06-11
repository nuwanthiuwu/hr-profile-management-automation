import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CvTemplatePage extends BasePage {
  // ===== LIST PAGE =====
  readonly pageHeading: Locator = this.page.locator('h1:has-text("CV Templates")');
  readonly templateCards: Locator = this.page.locator('div.rounded-lg.border.border-slate-200.bg-white');
  readonly uploadTemplateButton: Locator = this.page.locator('button:has-text("Upload Template")');

  // ===== UPLOAD FORM (inline — revealed after clicking Upload Template) =====
  readonly templateNameInput: Locator = this.page.locator('#template-name');
  readonly templateFileInput: Locator = this.page.locator('#file-upload-template-file');
  readonly uploadFormCancelButton: Locator = this.page.locator('button:has-text("Cancel")');
  readonly uploadFormCloseButton: Locator = this.page.locator('button[aria-label="Close"]');
  readonly uploadSubmitButton: Locator = this.page.locator('button:has-text("Upload"):not(:has-text("Upload Template"))');

  // ===== TEMPLATE CARD ACTIONS =====
  readonly firstActionsButton: Locator = this.page.locator('button:has-text("Actions for")').first();
  readonly viewDetailsMenuItem: Locator = this.page.locator('[role="menuitem"]:has-text("View Details")');

  // ===== STATUS LABELS =====
  readonly activeLabel: Locator = this.page.locator('p:text-is("Active"), span:text-is("Active")').first();

  constructor(page: Page) {
    super(page);
  }

  async navigateToCvTemplates(): Promise<void> {
    await this.goto('/cv-templates');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.pageHeading);
  }

  async openUploadForm(): Promise<void> {
    await this.click(this.uploadTemplateButton);
    await this.waitForVisible(this.templateNameInput);
  }

  async fillUploadForm(templateName: string, filePath: string): Promise<void> {
    await this.fill(this.templateNameInput, templateName);
    await this.templateFileInput.setInputFiles(filePath);
  }

  async submitUpload(): Promise<void> {
    await this.click(this.uploadSubmitButton);
    await this.page.waitForTimeout(1500);
  }

  async cancelUpload(): Promise<void> {
    await this.click(this.uploadFormCancelButton);
    await this.page.waitForTimeout(500);
  }

  async closeUploadForm(): Promise<void> {
    await this.click(this.uploadFormCloseButton);
    await this.page.waitForTimeout(500);
  }

  async getTemplateCount(): Promise<number> {
    return await this.templateCards.count();
  }

  async openActionsMenu(nth = 0): Promise<void> {
    await this.page.locator('button:has-text("Actions for")').nth(nth).click();
    await this.waitForVisible(this.viewDetailsMenuItem);
  }

  async clickViewDetails(): Promise<void> {
    await this.click(this.viewDetailsMenuItem);
    await this.page.waitForTimeout(800);
  }
}
