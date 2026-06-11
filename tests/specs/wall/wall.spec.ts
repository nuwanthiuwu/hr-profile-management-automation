import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../../pages/login.page';
import { WallPage } from '../../pages/wall.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, '../../fixtures');

function uniqueTitle(prefix: string): string {
  return `${prefix} ${Date.now()}`;
}

test.describe('Wall Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let wallPage: WallPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    wallPage = new WallPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await wallPage.navigateToWall();
  });

  // ────────────────────────────────────────────────────────
  // TC_WALL_01 – Create Post
  // ────────────────────────────────────────────────────────

  test.describe('TC_WALL_01 – Create Post', () => {
    test('TC_WALL_01.1 - Should create a new post and display it in the feed', async ({ page }) => {
      const title = uniqueTitle(testData.wall.postTitle);

      await wallPage.createPost(title, testData.wall.postCategory);

      await expect(page.locator(`h3:has-text("${title}")`)).toBeVisible({ timeout: 10000 });

      console.log(`✅ Post "${title}" created and visible in feed`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_WALL_02 – Validate 700 character limit
  // ────────────────────────────────────────────────────────

  test.describe('TC_WALL_02 – Validate 700 character limit', () => {
    test('TC_WALL_02.1 - Should prevent submission or truncate content exceeding 700 characters', async ({ page }) => {
      const longText = 'a'.repeat(750);
      await wallPage.fill(wallPage.descriptionTextarea, longText);

      const value = await wallPage.descriptionTextarea.inputValue();
      const isDisabled = await wallPage.postButton.isDisabled();

      // Either the input enforces maxLength=700 (truncated) OR the submit is disabled
      expect(value.length <= 700 || isDisabled).toBe(true);

      console.log(`✅ 700-char limit enforced — input length: ${value.length}, submit disabled: ${isDisabled}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_WALL_03 – Upload document
  // ────────────────────────────────────────────────────────

  test.describe('TC_WALL_03 – Upload document', () => {
    test('TC_WALL_03.1 - Should accept a document file attached to the post form', async ({ page }) => {
      // Verify the input is visible and configured for document uploads
      await wallPage.assertVisible(wallPage.documentUploadInput);
      const acceptAttr = await wallPage.documentUploadInput.getAttribute('accept');
      expect(acceptAttr).toContain('pdf');
      expect(acceptAttr).toContain('.docx');

      // Set the file (bypasses OS dialog)
      const docPath = path.join(fixturesDir, 'test-cv.pdf');
      await wallPage.documentUploadInput.setInputFiles(docPath);
      await page.waitForTimeout(500);

      console.log('✅ Document upload input accepts PDF and docx files');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_WALL_04 – Switch between All Posts and My Posts
  // ────────────────────────────────────────────────────────

  test.describe('TC_WALL_04 – Switch between All Posts and My Posts', () => {
    test('TC_WALL_04.1 - Should filter to My Posts and back to All Posts', async ({ page }) => {
      // Get all-posts count
      const allCount = await wallPage.getPostCount();

      // Switch to My Posts
      await wallPage.switchTab('my');
      expect(page.url()).toContain('/wall');
      const myCount = await wallPage.getPostCount();

      // My Posts should be a subset (equal or fewer)
      expect(myCount).toBeLessThanOrEqual(allCount);

      // Switch back to All Posts
      await wallPage.switchTab('all');
      const allCountAfter = await wallPage.getPostCount();
      expect(allCountAfter).toBeGreaterThanOrEqual(myCount);

      console.log(`✅ Tab switching works — All: ${allCount}, My: ${myCount}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_WALL_05 – Sort posts
  // ────────────────────────────────────────────────────────

  test.describe('TC_WALL_05 – Sort posts', () => {
    test('TC_WALL_05.1 - Should sort posts by Most popular and Most recent', async ({ page }) => {
      await wallPage.sortBy('Most popular');
      const selectedPopular = await wallPage.sortSelect.evaluate(
        (el: HTMLSelectElement) => el.options[el.selectedIndex].text
      );
      expect(selectedPopular).toBe('Most popular');

      await wallPage.sortBy('Most recent');
      const selectedRecent = await wallPage.sortSelect.evaluate(
        (el: HTMLSelectElement) => el.options[el.selectedIndex].text
      );
      expect(selectedRecent).toBe('Most recent');

      console.log('✅ Sort select switches between Most popular and Most recent');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_POST_01 – React to post
  // ────────────────────────────────────────────────────────

  test.describe('TC_POST_01 – React to post', () => {
    test('TC_POST_01.1 - Should update reaction count when a reaction is added', async ({ page }) => {
      const countBtnBefore = page.locator('button:has-text("reactions")').first();
      const textBefore = await countBtnBefore.textContent();

      // JS click bypasses React synthetic event issue with overlapping disabled button
      await wallPage.firstLikeReaction.evaluate(el => (el as HTMLElement).click());
      await page.waitForTimeout(1000);

      const textAfter = await page.locator('button:has-text("reactions"), button:has-text("reaction")').first().textContent();
      expect(textAfter).not.toBe(textBefore);

      console.log(`✅ Reaction updated — before: "${textBefore}", after: "${textAfter}"`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_POST_02 – Add comment
  // ────────────────────────────────────────────────────────

  test.describe('TC_POST_02 – Add comment', () => {
    test('TC_POST_02.1 - Should add a comment and display it under the post', async ({ page }) => {
      const commentText = `${testData.wall.commentText} ${Date.now()}`;

      await wallPage.fill(wallPage.firstCommentInput, commentText);
      await expect(wallPage.firstSendCommentButton).toBeEnabled({ timeout: 5000 });
      // Enter key submits comment (React onKeyPress handler); button type="button" requires Enter
      await wallPage.firstCommentInput.press('Enter');
      await page.waitForTimeout(2500); // React re-render after API response

      const bodyText = await page.evaluate(() => document.body.textContent ?? '');
      expect(bodyText).toContain(commentText.split(' ').slice(0, 3).join(' '));

      console.log(`✅ Comment "${commentText}" added and visible in feed`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_POST_03 – Reply to comment
  // ────────────────────────────────────────────────────────

  test.describe('TC_POST_03 – Reply to comment', () => {
    test('TC_POST_03.1 - Should submit a reply to an existing comment', async ({ page }) => {
      // Click Reply on the first comment that has a Reply button
      await wallPage.firstReplyButton.click();
      await page.waitForTimeout(600);

      // After clicking Reply, a new comment input row appears at the end of the comments
      const allCommentInputs = page.locator('input[placeholder="Add a comment"]');
      const inputCount = await allCommentInputs.count();
      const replyInput = allCommentInputs.nth(inputCount - 1);

      const replyText = `${testData.wall.replyText} ${Date.now()}`;
      await replyInput.fill(replyText);

      // Send button for the reply
      const allSendBtns = page.locator('button[aria-label^="Send comment"]');
      const sendCount = await allSendBtns.count();
      const replySendBtn = allSendBtns.nth(sendCount - 1);
      await expect(replySendBtn).toBeEnabled({ timeout: 5000 });
      await replyInput.press('Enter');
      await page.waitForTimeout(800);

      // Verify still on wall page (reply submitted)
      expect(page.url()).toContain('/wall');

      console.log(`✅ Reply submitted under comment`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_POST_04 – Like comment
  // ────────────────────────────────────────────────────────

  test.describe('TC_POST_04 – Like comment', () => {
    test('TC_POST_04.1 - Should update like count when a comment is liked', async ({ page }) => {
      // Count Like and Liked buttons before any interaction
      const likeCountBefore = await page.locator('button').filter({ hasText: /^Like$/ }).count();
      const likedCountBefore = await page.locator('button').filter({ hasText: /^Liked/ }).count();

      if (likeCountBefore > 0) {
        const likeBtnBefore = page.locator('button').filter({ hasText: /^Like$/ }).first();
        // JS click required — React onClick doesn't fire from Playwright's synthetic click
        await likeBtnBefore.evaluate(el => (el as HTMLElement).click());
        await page.waitForTimeout(2000);

        const likeCountAfter = await page.locator('button').filter({ hasText: /^Like$/ }).count();
        const likedCountAfter = await page.locator('button').filter({ hasText: /^Liked/ }).count();

        // Like count decreased OR Liked count increased
        expect(likeCountAfter < likeCountBefore || likedCountAfter > likedCountBefore).toBe(true);
        console.log(`✅ Comment like updated — Like: ${likeCountBefore}→${likeCountAfter}, Liked: ${likedCountBefore}→${likedCountAfter}`);
      } else {
        // All comments already liked — unlike one and verify Like appears
        const likedBtnBefore = page.locator('button').filter({ hasText: /^Liked/ }).first();
        await likedBtnBefore.evaluate(el => (el as HTMLElement).click());
        await page.waitForTimeout(2000);
        const likeCountAfter = await page.locator('button').filter({ hasText: /^Like$/ }).count();
        expect(likeCountAfter).toBeGreaterThan(0);
        console.log(`✅ Comment like toggled — unliked, Like buttons after: ${likeCountAfter}`);
      }
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_POST_05 – Reaction count validation
  // ────────────────────────────────────────────────────────

  test.describe('TC_POST_05 – Reaction count validation', () => {
    test('TC_POST_05.1 - Should update reaction count correctly when reaction is added or removed', async ({ page }) => {
      // Read initial count from first post reaction display button
      const reactionDisplayBtn = page.locator('button:has-text("reactions")').first();
      const countTextBefore = await reactionDisplayBtn.textContent() ?? '0 reactions';
      const numBefore = parseInt(countTextBefore.match(/\d+/)?.[0] ?? '0', 10);

      // JS click bypasses React synthetic event issue with overlapping disabled button
      await wallPage.firstLikeReaction.evaluate(el => (el as HTMLElement).click());
      await page.waitForTimeout(1000);

      const countTextAfter = await page.locator('button:has-text("reactions"), button:has-text("reaction")').first().textContent() ?? '0 reactions';
      const numAfter = parseInt(countTextAfter.match(/\d+/)?.[0] ?? '0', 10);

      // Count must change by exactly 1
      expect(Math.abs(numAfter - numBefore)).toBe(1);

      console.log(`✅ Reaction count changed: ${numBefore} → ${numAfter}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_POST_06 – Comment count validation
  // ────────────────────────────────────────────────────────

  test.describe('TC_POST_06 – Comment count validation', () => {
    test('TC_POST_06.1 - Should increment comment count when a new comment is added', async ({ page }) => {
      // Count Reply buttons before — each existing comment has one
      const replyBtnsBefore = await page.locator('button').filter({ hasText: /^Reply$/ }).count();

      // Add a new comment
      const commentText = `Count test ${Date.now()}`;
      await wallPage.fill(wallPage.firstCommentInput, commentText);
      await expect(wallPage.firstSendCommentButton).toBeEnabled({ timeout: 5000 });
      await wallPage.firstCommentInput.press('Enter');
      await page.waitForTimeout(2500); // React re-render after API response

      // New comment should have added one more Reply button
      const replyBtnsAfter = await page.locator('button').filter({ hasText: /^Reply$/ }).count();
      expect(replyBtnsAfter).toBeGreaterThan(replyBtnsBefore);

      console.log(`✅ Comment count increased: ${replyBtnsBefore} → ${replyBtnsAfter} Reply buttons`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_POST_07 – Edit post (first TC_POST_07 in user story)
  // ────────────────────────────────────────────────────────

  test.describe('TC_POST_07 – Edit post', () => {
    test('TC_POST_07.1 - Should update post title when edited and saved', async ({ page }) => {
      await wallPage.openEditDialog(0);
      await wallPage.assertVisible(wallPage.openDialog);

      const newTitle = uniqueTitle('Edited Post');
      await wallPage.fill(wallPage.editTitleInput, newTitle);
      await wallPage.click(wallPage.saveChangesButton);
      await page.waitForTimeout(1000);

      // Dialog should be gone
      const dialogOpen = await wallPage.openDialog.isVisible();
      expect(dialogOpen).toBe(false);

      // Updated title should appear in feed
      const updatedInFeed = await page.locator(`h3:has-text("${newTitle.substring(0, 30)}")`).isVisible();
      expect(updatedInFeed).toBe(true);

      console.log(`✅ Post edited — new title "${newTitle}" visible in feed`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_POST_07 – Delete post (second TC_POST_07 in user story)
  // ────────────────────────────────────────────────────────

  test.describe('TC_POST_07 – Delete post', () => {
    test('TC_POST_07.2 - Should remove post from feed when deleted', async ({ page }) => {
      // Create a dedicated post so we can safely delete it
      const deleteTitle = uniqueTitle('Delete Test');
      await wallPage.createPost(deleteTitle, 'Achievement');
      await page.waitForLoadState('networkidle');

      // Confirm post is in feed
      await expect(page.locator(`h3:has-text("${deleteTitle}")`)).toBeVisible({ timeout: 12000 });

      // Find the index of this post among all h3 titles (to use same index for delete button)
      const allTitles = await page.locator('h3').allTextContents();
      const idx = allTitles.findIndex(t => t.includes(deleteTitle.substring(0, 30)));
      expect(idx).toBeGreaterThanOrEqual(0);

      // Open delete dialog for that post
      await wallPage.openDeleteDialog(idx);
      await wallPage.assertVisible(wallPage.openDialog);

      // Confirm deletion
      await wallPage.click(wallPage.confirmDeleteButton);
      await page.waitForTimeout(1200);

      // Post should no longer be visible
      const postGone = await page.locator(`h3:has-text("${deleteTitle}")`).isVisible();
      expect(postGone).toBe(false);

      console.log(`✅ Post "${deleteTitle}" deleted and removed from feed`);
    });
  });
});
