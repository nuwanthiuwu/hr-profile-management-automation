import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class WallPage extends BasePage {
  // ===== POST CREATION FORM =====
  readonly titleInput: Locator = this.page.locator('#title');
  readonly categorySelect: Locator = this.page.locator('#category');
  readonly descriptionTextarea: Locator = this.page.locator('#description');
  readonly photoUploadInput: Locator = this.page.locator('#wall-photo-upload');
  readonly documentUploadInput: Locator = this.page.locator('#wall-document-upload');
  readonly postButton: Locator = this.page.locator('button[type="submit"]:has-text("Post")');

  // ===== FILTER TABS =====
  readonly allPostsTab: Locator = this.page.locator('button:has-text("All posts")');
  readonly myPostsTab: Locator = this.page.locator('button:has-text("My posts")');

  // ===== SORT =====
  readonly sortSelect: Locator = this.page.locator('select[aria-label="Sort wall posts"]');

  // ===== PER-POST REACTIONS (use .nth(n) or .first() in tests) =====
  readonly firstLikeReaction: Locator = this.page.locator('button[aria-label="Like reaction"]').first();
  readonly firstCelebrateReaction: Locator = this.page.locator('button[aria-label="Celebrate reaction"]').first();

  // ===== PER-POST COMMENTS =====
  readonly firstCommentInput: Locator = this.page.locator('input[placeholder="Add a comment"]').first();
  readonly firstSendCommentButton: Locator = this.page.locator('button[aria-label^="Send comment"]').first();

  // ===== COMMENT INTERACTIONS =====
  readonly firstReplyButton: Locator = this.page.locator('button').filter({ hasText: /^Reply$/ }).first();
  readonly firstLikeCommentButton: Locator = this.page.locator('button').filter({ hasText: /^Like$/ }).first();

  // ===== POST MANAGEMENT =====
  readonly firstEditPostButton: Locator = this.page.locator('button[aria-label="Edit post"]').first();
  readonly firstDeletePostButton: Locator = this.page.locator('button[aria-label="Delete post"]').first();

  // ===== EDIT/DELETE DIALOG (native <dialog> element) =====
  readonly openDialog: Locator = this.page.locator('dialog[open]');
  readonly editTitleInput: Locator = this.page.locator('dialog[open] #title');
  readonly editCategorySelect: Locator = this.page.locator('dialog[open] #category');
  readonly saveChangesButton: Locator = this.page.locator('dialog[open] button:has-text("Save changes")');
  readonly cancelDialogButton: Locator = this.page.locator('dialog[open] button:has-text("Cancel")');
  readonly confirmDeleteButton: Locator = this.page.locator('dialog[open] button:has-text("Delete post")');

  // ===== POST FEED =====
  readonly postTitles: Locator = this.page.locator('h3');

  constructor(page: Page) {
    super(page);
  }

  async navigateToWall(): Promise<void> {
    await this.goto('/wall');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.titleInput);
  }

  async createPost(title: string, category: string = 'Achievement', description: string = 'Automated test post description.'): Promise<void> {
    await this.fill(this.titleInput, title);
    await this.categorySelect.selectOption(category);
    await this.fill(this.descriptionTextarea, description);
    await this.click(this.postButton);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1500);
  }

  async switchTab(tab: 'all' | 'my'): Promise<void> {
    await this.click(tab === 'all' ? this.allPostsTab : this.myPostsTab);
    await this.page.waitForTimeout(600);
  }

  async sortBy(option: 'Most recent' | 'Most popular'): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
    await this.page.waitForTimeout(600);
  }

  async getPostCount(): Promise<number> {
    return this.postTitles.count();
  }

  async openEditDialog(nth: number = 0): Promise<void> {
    await this.page.locator('button[aria-label="Edit post"]').nth(nth).click();
    await this.waitForVisible(this.openDialog);
  }

  async openDeleteDialog(nth: number = 0): Promise<void> {
    await this.page.locator('button[aria-label="Delete post"]').nth(nth).click();
    await this.waitForVisible(this.openDialog);
  }
}
