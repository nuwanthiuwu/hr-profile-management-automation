import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Base class for all page objects
 * 
 * Provides common methods used across all pages:
 * - Navigation
 * - Element interactions
 * - Assertions
 * - Logging
 * - Wait conditions
 */

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    console.log(`🔗 Navigating to: ${url}`);
    await this.page.goto(url);
  }

  /**
   * Navigate to base URL
   */
  async gotoBaseUrl(): Promise<void> {
    console.log(`🔗 Navigating to base URL`);
    await this.page.goto('/');
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Click on an element
   */
  async click(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`👆 Clicking element`);
    await element.click();
  }

  /**
   * Fill text in an input field
   */
  async fill(locator: Locator | string, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`✍️  Filling text`);
    await element.fill(text);
  }

  /**
   * Clear text from an input field
   */
  async clear(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`🗑️  Clearing text field`);
    await element.clear();
  }

  /**
   * Type text character by character
   */
  async type(locator: Locator | string, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`⌨️  Typing text`);
    await element.type(text);
  }

  /**
   * Get text from an element
   */
  async getText(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.textContent() || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(locator: Locator | string, timeout: number = 5000): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`⏳ Waiting for element to be visible`);
    await element.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(locator: Locator | string, timeout: number = 5000): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`⏳ Waiting for element to be hidden`);
    await element.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for page navigation
   */
  async waitForNavigation(): Promise<void> {
    console.log(`⏳ Waiting for page navigation`);
    await this.page.waitForNavigation();
  }

  /**
   * Check if element contains specific text
   */
  async hasText(locator: Locator | string, text: string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.textContent().then((content) => content?.includes(text) || false);
  }

  /**
   * Assert element contains text
   */
  async assertTextContains(locator: Locator | string, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`✅ Asserting text contains: ${text}`);
    await expect(element).toContainText(text);
  }

  /**
   * Assert element has exact text
   */
  async assertTextEquals(locator: Locator | string, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`✅ Asserting text equals: ${text}`);
    await expect(element).toHaveText(text);
  }

  /**
   * Assert element is visible
   */
  async assertVisible(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`✅ Asserting element is visible`);
    await expect(element).toBeVisible();
  }

  /**
   * Assert element is hidden
   */
  async assertHidden(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`✅ Asserting element is hidden`);
    await expect(element).toBeHidden();
  }

  /**
   * Get attribute value
   */
  async getAttribute(locator: Locator | string, attribute: string): Promise<string | null> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.getAttribute(attribute);
  }

  /**
   * Capture screenshot
   */
  async screenshot(filename: string): Promise<void> {
    console.log(`📸 Taking screenshot: ${filename}`);
    await this.page.screenshot({ path: `test-results/screenshots/${filename}.png` });
  }

  /**
   * Close the page
   */
  async closePage(): Promise<void> {
    console.log(`❌ Closing page`);
    await this.page.close();
  }
}
