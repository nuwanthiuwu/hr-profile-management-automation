# Setup Instructions - Step by Step

## Prerequisites

Verify you have the required tools installed:

```bash
# Check Node.js
node -v  # Should be v23.6.1 or higher

# Check npm
npm -v   # Should be v10.9.2 or higher

# Check Git
git -v   # Should be git version 2.50.1 or higher
```

---

## Phase 1: Project Initialization

### Step 1.1: Create Project Directory

```bash
# Create main project directory
mkdir hr-profile-management-automation
cd hr-profile-management-automation

# Initialize Git
git init
git remote add origin https://github.com/nuwanthiuwu/hr-profile-management-automation
```

### Step 1.2: Create Directory Structure

```bash
# Create all required directories
mkdir -p tests/{pages,specs/login,fixtures,utils}
mkdir -p config
mkdir -p test-results/{reports,screenshots}
mkdir -p docs/{user-stories,defects}
mkdir -p .github/workflows
```

Expected structure:
```
hr-profile-management-automation/
├── tests/
│   ├── pages/
│   ├── specs/
│   │   └── login/
│   ├── fixtures/
│   └── utils/
├── config/
├── test-results/
│   ├── reports/
│   └── screenshots/
├── docs/
│   ├── user-stories/
│   └── defects/
└── .github/
    └── workflows/
```

### Step 1.3: Copy Configuration Files to Root

Copy these files to your project root:
- `playwright.config.ts`
- `package.json`
- `.gitignore`

```bash
# After copying, your root should contain:
# - playwright.config.ts
# - package.json
# - .gitignore
```

### Step 1.4: Copy Configuration Folder

Copy `test-data.json` to `config/` folder:

```bash
# Structure should be:
config/
└── test-data.json
```

**Content of test-data.json:**
```json
{
  "application": {
    "baseUrl": "https://smart-hr-fe.vercel.app",
    "loginUrl": "https://smart-hr-fe.vercel.app/login",
    "dashboardUrl": "https://smart-hr-fe.vercel.app/dashboard"
  },
  "testUsers": {
    "admin": {
      "username": "alex.morgan@smart-hr.com",
      "password": "8A1HdsuUgrZR",
      "role": "Admin"
    }
  },
  "testData": {
    "invalidEmail": "invalid.email@test.com",
    "invalidPassword": "WrongPassword123"
  }
}
```

---

## Phase 2: Dependencies Installation

### Step 2.1: Install NPM Packages

```bash
# From project root, install all dependencies
npm install

# This will install:
# - @playwright/test@^1.48.2
# - @types/node@^22.10.5
# - typescript@^5.7.3
# - dotenv@^16.4.7
```

### Step 2.2: Install Playwright Browsers

```bash
# Install Chromium browser (required for tests)
npx playwright install chromium

# Optional: Install other browsers for future use
npx playwright install firefox webkit
```

### Step 2.3: Verify Installation

```bash
# Check if Playwright is installed correctly
npx playwright --version

# Should output something like: Version 1.48.2
```

---

## Phase 3: Copy Page Objects and Test Files

### Step 3.1: Copy Page Object Base Class

Copy `base.page.ts` to `tests/pages/`:

```
tests/
└── pages/
    └── base.page.ts
```

This file contains:
- Common methods for all pages (click, fill, type, wait, assert)
- Logging utilities
- Navigation helpers

### Step 3.2: Copy Login Page Object

Copy `login.page.ts` to `tests/pages/`:

```
tests/
└── pages/
    ├── base.page.ts
    └── login.page.ts
```

This file contains:
- All selectors for login page elements
- All selectors for forgot password page
- Methods for login operations
- Methods for password visibility toggle
- Methods for forgot password operations

### Step 3.3: Copy Test Specification File

Copy `login.spec.ts` to `tests/specs/login/`:

```
tests/
└── specs/
    └── login/
        └── login.spec.ts
```

This file contains:
- 12 comprehensive test cases
- All test scenarios from the user story
- Before/after hooks for setup

---

## Phase 4: ⚠️ CRITICAL - Update Selectors

### Step 4.1: Understand the Current Placeholders

In `login.page.ts`, selectors are currently placeholders:

```typescript
// Example - these are NOT the real selectors
readonly emailInput: Locator = this.page.locator('input[placeholder*="email"], input[name="email"]');
readonly passwordInput: Locator = this.page.locator('input[type="password"]');
readonly signInButton: Locator = this.page.locator('button:has-text("Sign In")');
```

**You MUST update these with actual selectors from the application.**

### Step 4.2: Find Real Selectors Using Playwright Inspector

Open Playwright Inspector and interact with the app:

```bash
# This opens browser with code generator
npx playwright codegen https://smart-hr-fe.vercel.app/login
```

**Steps:**
1. Click on each element in the app (email input, password, etc.)
2. Code generator will show you the selector
3. Copy the selector to `login.page.ts`

### Step 4.3: Elements to Find Selectors For

Find selectors for these elements in `login.page.ts`:

| Element | Property Name | Location |
|---------|---------------|----------|
| Email input | `emailInput` | Login page |
| Password input | `passwordInput` | Login page |
| Eye icon (password toggle) | `passwordVisibilityIcon` | Login page |
| Sign In button | `signInButton` | Login page |
| Remember Me checkbox | `rememberMeCheckbox` | Login page |
| Forgot Password link | `forgotPasswordLink` | Login page |
| Error message | `errorMessage` | Login page |
| Forgot password email input | `forgotPasswordEmailInput` | Forgot password page |
| Send Reset button | `sendResetLinkButton` | Forgot password page |
| Back to Login link | `backToLoginLink` | Forgot password page |

### Step 4.4: Best Selector Strategy (Priority Order)

```typescript
// 1. Most stable: data-testid
this.page.locator('[data-testid="email-input"]')

// 2. Stable: aria-label (for buttons, icons)
this.page.locator('[aria-label="Toggle password visibility"]')

// 3. Stable: Semantic selectors (for form inputs)
this.page.locator('input[type="email"]')

// 4. Less stable: CSS classes
this.page.locator('.login-email-input')

// 5. Avoid: XPath (very fragile)
this.page.locator('//input[@id="email"]')  // ❌ Don't use this
```

### Step 4.5: Example Update

Before:
```typescript
readonly emailInput: Locator = this.page.locator('input[placeholder*="email"]');
readonly passwordInput: Locator = this.page.locator('input[type="password"]');
readonly signInButton: Locator = this.page.locator('button:has-text("Sign In")');
```

After (example - update with YOUR actual selectors):
```typescript
readonly emailInput: Locator = this.page.locator('[data-testid="email-input"]');
readonly passwordInput: Locator = this.page.locator('[data-testid="password-input"]');
readonly signInButton: Locator = this.page.locator('button[type="submit"]');
```

---

## Phase 5: Test Execution

### Step 5.1: Run All Tests

```bash
npm run test
# OR
npm run test:login
```

**What happens:**
1. Playwright launches Chrome browser
2. Navigates to login page
3. Runs each test case
4. Captures screenshots on failures
5. Generates HTML report

### Step 5.2: Run Tests with Visible Browser (Headed Mode)

```bash
npm run test:headed

# Browser will be visible so you can see what's happening
```

### Step 5.3: Run Tests in Interactive UI Mode

```bash
npm run test:ui

# Opens interactive test runner where you can:
# - Click to run individual tests
# - Watch execution live
# - See logs in real-time
```

### Step 5.4: Debug Specific Test

```bash
# Generate selectors interactively
npm run codegen

# Or debug a failing test
npm run test:debug
```

### Step 5.5: View Test Report

```bash
npm run test:report

# Opens HTML report with:
# - Pass/fail status
# - Screenshots
# - Videos
# - Logs
```

---

## Phase 6: Fix Failing Tests

### If tests fail:

1. **Check the error message** in console
2. **Open the screenshot** from `test-results/screenshots/`
3. **Identify the issue**:
   - Selector not found? → Update selector in `login.page.ts`
   - Element not visible? → Add wait condition
   - Wrong text? → Adjust assertion

4. **Fix the issue**:
   ```typescript
   // Example: If email input selector is wrong
   readonly emailInput: Locator = this.page.locator('[data-testid="email"]'); // FIXED
   ```

5. **Re-run the test**:
   ```bash
   npm run test:login
   ```

---

## Phase 7: Environment Setup (Optional)

### Create .env File (for sensitive data)

```bash
# Create .env file in project root
cat > .env << EOF
APP_URL=https://smart-hr-fe.vercel.app
ADMIN_USERNAME=alex.morgan@smart-hr.com
ADMIN_PASSWORD=8A1HdsuUgrZR
EOF
```

**Important:** Add `.env` to `.gitignore` so credentials are never committed!

---

## Phase 8: Git Setup and First Commit

### Step 8.1: Configure Git (if first time)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 8.2: Stage All Files

```bash
git add .
```

### Step 8.3: Create Initial Commit

```bash
git commit -m "feat(tests): Add complete login automation test suite

- Add Playwright configuration with TypeScript setup
- Add Page Object Models for login and forgot password
- Add 12 comprehensive test cases covering all scenarios
- Add test data configuration for credentials
- Add npm scripts for running tests

Test Coverage:
- TC_LOGIN_01: Password visibility toggle
- TC_LOGIN_02: Empty credentials validation
- TC_LOGIN_03: Valid admin login flow
- TC_LOGIN_04: Remember Me functionality
- TC_FP_01-03: Forgot Password workflows

Resolves: Admin Login Module Automation"
```

### Step 8.4: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

### Step 8.5: Verify on GitHub

Visit: https://github.com/nuwanthiuwu/hr-profile-management-automation

All files should be visible on GitHub ✅

---

## Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| `npm: command not found` | Install Node.js from nodejs.org |
| `playwright: command not found` | Run `npm install` and `npx playwright install chromium` |
| Tests timeout | Increase timeout in `playwright.config.ts` |
| Selector not found | Update selector in `login.page.ts` |
| Tests pass locally but not in CI | Check environment variables in `.env` |
| Screenshots not captured | Ensure `test-results/screenshots/` directory exists |
| Git push fails | Verify GitHub repo is accessible: `git remote -v` |

---

## Quick Reference Commands

```bash
# Navigation
cd hr-profile-management-automation

# Installation
npm install
npx playwright install chromium

# Running Tests
npm run test              # Run all tests
npm run test:login        # Run only login tests
npm run test:headed       # See browser while running
npm run test:ui           # Interactive mode
npm run test:debug        # Debug mode
npm run test:report       # View HTML report

# Code Generation
npm run codegen           # Generate selectors automatically

# Git Operations
git status                # See what files changed
git add .                 # Stage all files
git commit -m "message"   # Create commit
git push                  # Push to GitHub
git log                   # View commit history
```

---

## ✅ Success Criteria

You've completed setup when:

- ✅ Project directory created with proper structure
- ✅ All dependencies installed (`npm install`)
- ✅ Playwright browsers installed
- ✅ All files in correct locations
- ✅ **Selectors updated in `login.page.ts`** (CRITICAL!)
- ✅ Tests run successfully: `npm run test:login`
- ✅ All tests pass or failures are documented
- ✅ First commit pushed to GitHub
- ✅ HTML report viewable with `npm run test:report`

---

## 🎉 You're Done!

Your Playwright automation framework is ready to use!

**Next steps:**
1. Run tests regularly as you develop
2. Add more test cases for other modules
3. Set up CI/CD pipeline (GitHub Actions)
4. Integrate with JIRA for defect tracking
5. Run tests in Headless mode for CI/CD

Happy testing! 🧪✨
