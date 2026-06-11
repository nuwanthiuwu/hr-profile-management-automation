---
description: Full automation pipeline for a new module — reads the user story, inspects the live app, creates the POM and spec files, runs tests headlessly, and fixes any failures.
---

Automate a new test module end-to-end: read the user story, discover live selectors, create the Page Object and spec file, run headless tests, and fix any failures.

## Arguments

`$ARGUMENTS` — Path to the user story markdown file (e.g. `Docs/user-stories/Profile.md`). Required.

## Steps to follow exactly

### 1. Read the user story

Read the file at `$ARGUMENTS`. Extract:
- **Module name** (e.g. "Profile", "Designations")
- **URL path(s)** the tests will use (e.g. `/profile`, `/designations`)
- **Test case IDs and names** (TC_XXX_01 – TC_XXX_N)
- **Given/When/Then scenarios** for each test case

If the file does not exist, tell the user and stop.

### 2. Determine file paths to create

Following the project's naming convention:
- POM file: `tests/pages/<module-lowercase>.page.ts`
- Spec file: `tests/specs/<module-lowercase>/<module-lowercase>.spec.ts`
- Or if the module has sub-sections (like create form): split into multiple spec files

Check that these files do NOT already exist. If they do, warn the user and ask whether to overwrite.

### 3. Inspect the live app pages

For each URL path identified in the user story, run the `/inspect-page` skill:

Internally, write and run a headless script (same pattern as `/inspect-page`) for each URL. Collect all:
- Input IDs, placeholders, accept attributes
- Select elements with their option labels
- Button types and text
- Table headers (with aria-sort if sortable)
- Dialog roles, heading text
- Nav links and their href values

Combine results into a selector map for use in step 4.

### 4. Write the Page Object Model file

Create `tests/pages/<module>.page.ts` following this exact structure:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class <Module>Page extends BasePage {
  // ===== LIST/MAIN PAGE =====
  readonly pageHeading: Locator = this.page.locator('...');
  // ... all list-page selectors

  // ===== FORM/DRAWER (if applicable) =====
  readonly drawer: Locator = this.page.locator('[role="dialog"]');
  // ... all form selectors

  constructor(page: Page) {
    super(page);
  }

  // ===== NAVIGATION =====
  async navigateTo<Module>(): Promise<void> {
    await this.goto('/<path>');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.pageHeading);
  }

  // ===== ACTION METHODS =====
  // One method per meaningful user action
}
```

Rules:
- Use `#id` selectors where IDs exist and are unique
- Use `input[accept*="..."]` for file inputs (IDs are dynamic)
- Use `select:has(option:text-is("All ..."))` to scope filter dropdowns
- Use XPath `xpath=//p[normalize-space()="Section"]/following::input[@id="title"][1]` for duplicate IDs
- Use `p:text-is("Active")` for exact text match (avoids "Inactive" matching "Active")
- Scope all form selectors inside `[role="dialog"]` to avoid collisions with the login page

### 5. Write the test spec file(s)

Create `tests/specs/<module>/<module>.spec.ts` following this exact structure:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { <Module>Page } from '../../pages/<module>.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('<Module> Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let <module>Page: <Module>Page;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    <module>Page = new <Module>Page(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await <module>Page.navigateTo<Module>();
  });

  test.describe('TC_XXX_01 – <Name>', () => {
    test('TC_XXX_01.1 - <Full description>', async ({ page }) => {
      // Arrange / Act / Assert
    });
  });
  // ... one test.describe per TC_XXX_NN
});
```

Rules:
- One `test.describe` wrapper per test case ID from the user story
- Test name pattern: `TC_XXX_01.1 - Should <verb> <expected outcome>`
- Use `await empPage.page.waitForTimeout(700)` after search/filter inputs (debounce)
- Use `await page.waitForURL('**/path', { timeout: 10000 })` after navigation actions
- Add `console.log('✅ ...')` at the end of each passing test
- For file upload tests use `setInputFiles()` on the locator
- Handle native confirm dialogs with `page.once('dialog', d => d.accept())` before the triggering click

### 6. Run the tests headlessly

```bash
npx playwright test tests/specs/<module>/ 2>&1
```

Read the full output. Note any failures.

### 7. Fix any failures

For each failing test:
1. Read the error message and line number
2. If it is a selector/timeout error: run a targeted inspection on the relevant page to find the real selector
3. If it is an assertion error: check whether the expected value matches the actual app behaviour
4. Apply the fix to the POM or spec file
5. Rerun only the failing tests: `npx playwright test tests/specs/<module>/ -g "TC_XXX_NN" 2>&1`
6. Repeat until all tests pass

### 8. Report completion

Tell the user:
- Files created: POM path and spec path
- Total tests written and passing
- Any known limitations or edge cases found during inspection
- Suggested next step: `/commit-module <module-name>`
