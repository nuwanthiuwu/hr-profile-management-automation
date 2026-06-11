# End-to-End QA Automation Workflow
## HR Profile Management System - Admin Login Module

---

## 📋 Workflow Overview

This document outlines your **complete 8-step autonomous QA workflow** optimized for:

- **Environment**: macOS (local development machine)
- **Tools**: VS Code + Playwright + Claude Pro
- **Framework**: Page Object Model with TypeScript
- **Browser**: Chromium (Chrome)
- **Execution**: Sequential (non-parallel)
- **Application**: https://smart-hr-fe.vercel.app/login
- **Test Credentials**: alex.morgan@smart-hr.com / 8A1HdsuUgrZR

---

## 🎯 STEP 1: Project Initialization & Setup

**Objective**: Set up your local development environment

### Tasks:

1. **Create directory structure**
   ```bash
   mkdir hr-profile-management-automation
   cd hr-profile-management-automation
   mkdir -p tests/{pages,specs/login,fixtures,utils}
   mkdir -p config test-results/{reports,screenshots} docs/{user-stories,defects}
   ```

2. **Initialize Git repository**
   ```bash
   git init
   git remote add origin https://github.com/nuwanthiuwu/hr-profile-management-automation
   ```

3. **Copy all provided files** to project root and subdirectories:
   - `playwright.config.ts` → root
   - `package.json` → root
   - `.gitignore` → root
   - `test-data.json` → `config/`
   - `base.page.ts` → `tests/pages/`
   - `login.page.ts` → `tests/pages/`
   - `login.spec.ts` → `tests/specs/login/`

4. **Install dependencies**
   ```bash
   npm install
   npx playwright install chromium
   ```

5. **Verify installation**
   ```bash
   node -v          # v23.6.1
   npm -v           # 10.9.2
   npx playwright --version  # 1.48.2
   ```

### ✅ Expected Output:
```
✅ Directory structure created
✅ All files in correct locations
✅ Dependencies installed
✅ Chromium browser ready
✅ Git repository initialized
```

---

## 📖 STEP 2: Read & Analyze User Story

**Objective**: Understand all test cases and acceptance criteria

### Tasks:

1. **Copy user story document**
   ```
   docs/user-stories/Login_-_Smart_HR_Profile_Management_System_-_Admin.md
   ```

2. **Extract test cases** (already documented):
   - ✅ **TC_LOGIN_01**: Password visibility toggle (2 sub-tests)
   - ✅ **TC_LOGIN_02**: Empty credentials validation (3 sub-tests)
   - ✅ **TC_LOGIN_03**: Valid login flow (2 sub-tests)
   - ✅ **TC_LOGIN_04**: Remember Me functionality (1 test)
   - ✅ **TC_FP_01**: Forgot password - valid email (1 test)
   - ✅ **TC_FP_02**: Forgot password - invalid email (2 sub-tests)
   - ✅ **TC_FP_03**: Forgot password - navigation (1 test)

   **Total: 12 test cases**

3. **Document key information**:
   - Application URL: https://smart-hr-fe.vercel.app/login
   - Test Credentials: alex.morgan@smart-hr.com / 8A1HdsuUgrZR
   - Key features: Login, Password toggle, Remember Me, Forgot Password

### ✅ Expected Output:
```
✅ User story documented
✅ All 12 test cases identified
✅ Acceptance criteria understood
✅ Features to test mapped
```

---

## 🔍 STEP 3: Perform Exploratory Testing (Manual)

**Objective**: Identify actual UI element selectors from the live application

### Critical: Finding Element Selectors

**Use Playwright Inspector** (Recommended):
```bash
npx playwright codegen https://smart-hr-fe.vercel.app/login
```

This opens a browser with code generator. Click on elements and it shows you the selector.

### Elements to Find Selectors For:

| Element | Test ID | How to Find |
|---------|---------|------------|
| Email input | `emailInput` | Click email field, copy selector |
| Password input | `passwordInput` | Click password field, copy selector |
| Eye icon (toggle) | `passwordVisibilityIcon` | Click eye icon, copy selector |
| Sign In button | `signInButton` | Click Sign In button, copy selector |
| Remember Me | `rememberMeCheckbox` | Click checkbox, copy selector |
| Forgot Password link | `forgotPasswordLink` | Click Forgot Password link, copy selector |
| Error message | `errorMessage` | Trigger error, inspect element |
| Forgot email input | `forgotPasswordEmailInput` | Go to forgot password page, click email field |
| Send Reset button | `sendResetLinkButton` | On forgot password page, click Send button |
| Back to Login | `backToLoginLink` | On forgot password page, click Back |

### Selector Priority (Use in This Order):

1. **data-testid** (Most stable): `[data-testid="email"]`
2. **aria-label**: `[aria-label="Email address"]`
3. **Semantic**: `input[type="email"]`
4. **CSS classes**: `.login-email`
5. **ID**: `#email-input`
6. **Text content**: `button:has-text("Sign In")`
7. **XPath** (Avoid this)

### Manual Test Execution:

For each test case:
1. Open app in Chrome
2. Interact with elements as per test steps
3. Verify behavior matches expected
4. Take screenshots of key states
5. Document any issues

### Screenshots to Take:

- `login-page.png` - Initial login page
- `password-visible.png` - After toggling password visibility
- `password-hidden.png` - After toggling back
- `error-empty-fields.png` - Empty field validation error
- `error-invalid-email.png` - Invalid email error
- `login-success.png` - After successful login
- `forgot-password-page.png` - Forgot password page
- `confirmation-message.png` - Reset link confirmation

### ✅ Expected Output:
```
✅ All element selectors identified
✅ Selectors tested and working
✅ Selector priority documented
✅ Screenshots captured
✅ Manual test results documented
```

---

## 🔧 STEP 4: Update Page Objects with Real Selectors

**Objective**: Replace placeholder selectors with actual ones found in Step 3

### Tasks:

1. **Open `tests/pages/login.page.ts`**

2. **Update each selector** with your discovered selectors:

   ```typescript
   // BEFORE (placeholder):
   readonly emailInput: Locator = this.page.locator('input[placeholder*="email"]');

   // AFTER (real selector):
   readonly emailInput: Locator = this.page.locator('[data-testid="email-input"]');
   ```

3. **Update all selectors**:

   ```typescript
   // Login Page Elements
   readonly emailInput: Locator = this.page.locator('YOUR_EMAIL_SELECTOR');
   readonly passwordInput: Locator = this.page.locator('YOUR_PASSWORD_SELECTOR');
   readonly passwordVisibilityIcon: Locator = this.page.locator('YOUR_EYE_ICON_SELECTOR');
   readonly signInButton: Locator = this.page.locator('YOUR_SIGNIN_BUTTON_SELECTOR');
   readonly rememberMeCheckbox: Locator = this.page.locator('YOUR_REMEMBER_ME_SELECTOR');
   readonly forgotPasswordLink: Locator = this.page.locator('YOUR_FORGOT_PASSWORD_SELECTOR');
   readonly errorMessage: Locator = this.page.locator('YOUR_ERROR_MESSAGE_SELECTOR');

   // Forgot Password Page Elements
   readonly forgotPasswordEmailInput: Locator = this.page.locator('YOUR_FP_EMAIL_SELECTOR');
   readonly sendResetLinkButton: Locator = this.page.locator('YOUR_SEND_BUTTON_SELECTOR');
   readonly backToLoginLink: Locator = this.page.locator('YOUR_BACK_LINK_SELECTOR');
   readonly resetConfirmationMessage: Locator = this.page.locator('YOUR_CONFIRMATION_SELECTOR');
   ```

4. **Test each selector** by running a quick test:
   ```bash
   npx playwright test --grep "TC_LOGIN_01.1" --headed
   ```

5. **Fix any failing selectors** using Playwright Inspector again

### ✅ Expected Output:
```
✅ All selectors updated in login.page.ts
✅ Each selector tested and working
✅ No "element not found" errors
✅ Page object ready for automated testing
```

---

## ✍️ STEP 5: Review & Validate Test Specifications

**Objective**: Ensure test file matches test plan and is ready to run

### Tasks:

1. **Review `tests/specs/login/login.spec.ts`**
   - Verify all 12 test cases are present
   - Check test structure and organization
   - Review assertions and expectations

2. **Validate test data references**
   ```typescript
   import testData from '../../../config/test-data.json' assert { type: 'json' };
   
   // Verify credentials match:
   const admin = testData.testUsers.admin;
   // Should be: alex.morgan@smart-hr.com / 8A1HdsuUgrZR
   ```

3. **Check test organization**:
   - `test.describe()` for logical grouping ✅
   - `test.beforeEach()` for setup ✅
   - Clear test names matching test IDs ✅
   - Proper assertions ✅

4. **Run tests locally** to verify they work:
   ```bash
   npm run test:login --headed
   ```

### ✅ Expected Output:
```
✅ Test file structure validated
✅ All 12 test cases present
✅ Test data configured correctly
✅ Tests ready for execution
```

---

## 🧪 STEP 6: Execute Tests & Identify Failures

**Objective**: Run all tests and identify any issues

### Tasks:

1. **Run all login tests**:
   ```bash
   npm run test:login
   ```

2. **Monitor output** for:
   - ✅ PASSED tests (green)
   - ❌ FAILED tests (red)
   - ⏭️ SKIPPED tests (gray)

3. **Check test report**:
   ```bash
   npm run test:report
   ```
   This opens HTML report with:
   - Test results summary
   - Failure details
   - Screenshots of failures
   - Video recordings (if enabled)

4. **Document failures** (if any):
   ```
   Test Name: [TC_LOGIN_01.1]
   Error: [Copy error message]
   Screenshot: [test-results/screenshots/...]
   Root Cause: [Your analysis]
   ```

### Run Specific Tests for Debugging:

```bash
# Run single test
npx playwright test --grep "TC_LOGIN_01.1"

# Run test with visible browser
npx playwright test --grep "TC_LOGIN_03" --headed

# Run with trace for debugging
npx playwright test --trace on
```

### ✅ Expected Output:
```
✅ Test execution completed
✅ Pass/fail count documented
✅ Failure screenshots captured
✅ Error messages documented
✅ Test report generated
```

---

## 🔧 STEP 7: Debug & Heal Failing Tests

**Objective**: Fix any failing tests to ensure 100% pass rate

### For Each Failing Test:

1. **Analyze the failure**:
   - View screenshot in `test-results/screenshots/`
   - Read console error message
   - Determine root cause

2. **Common Issues & Solutions**:

   | Issue | Solution |
   |-------|----------|
   | Element not found | Update selector in `login.page.ts` |
   | Element not visible | Add `await page.waitForVisible()` |
   | Timeout | Increase timeout in `playwright.config.ts` |
   | Wrong assertion | Adjust expected value in test |
   | Navigation issues | Add proper wait states |

3. **Fix the issue**:

   ```typescript
   // Example: Selector was wrong
   // In login.page.ts:
   readonly emailInput: Locator = this.page.locator('[data-testid="email"]'); // FIXED
   ```

4. **Re-run the test**:
   ```bash
   npx playwright test --grep "TC_LOGIN_01.1"
   ```

5. **Verify it passes** before moving to next test

### Debug Mode (Interactive):

```bash
npm run test:debug

# This opens Playwright Inspector where you can:
# - Step through test execution
# - Inspect elements live
# - Try selectors before using them
# - View element properties
```

### ✅ Expected Output:
```
✅ All failing tests identified
✅ Root causes documented
✅ Fixes applied
✅ All tests passing
✅ No red flags in test report
```

---

## 📊 STEP 8: Create Test Execution Report

**Objective**: Document comprehensive test results for stakeholders

### Create Report File:

```bash
# Create file: test-results/hr-profile-management-admin-test-report-login.md
```

### Report Structure:

```markdown
# Test Execution Report - HR Profile Management Admin Login Module

## Executive Summary
- **Test Date**: [Date]
- **Total Test Cases**: 12
- **Passed**: X
- **Failed**: Y
- **Success Rate**: Z%
- **Duration**: X minutes

## Test Execution Details

### TC_LOGIN_01: Password Visibility Toggle
- **TC_LOGIN_01.1**: Toggle hidden to visible
  - Status: ✅ PASS / ❌ FAIL
  - Duration: 2.3s
  - Notes: Verified password type changes from 'password' to 'text'

- **TC_LOGIN_01.2**: Toggle visible to hidden
  - Status: ✅ PASS / ❌ FAIL
  - Duration: 2.1s
  - Notes: Verified password type changes back to 'password'

### TC_LOGIN_02: Empty Credentials Validation
- **TC_LOGIN_02.1**: Both fields empty
  - Status: ✅ PASS
  - Error Message Displayed: ✅ Yes
  
[Continue for all 12 test cases...]

## Issues & Defects Found

### Defect #1
- **ID**: DEF-001
- **Title**: Password toggle button not responding
- **Test Case**: TC_LOGIN_01.1
- **Severity**: High
- **Status**: Open
- **Steps to Reproduce**:
  1. Go to login page
  2. Enter password
  3. Click eye icon
  4. Actual: Icon doesn't respond
  5. Expected: Password should become visible
- **Screenshot**: [screenshot-link]

## Test Coverage Analysis

| Feature | Manual Testing | Automated Testing | Gap |
|---------|----------------|-------------------|-----|
| Password toggle | ✅ | ✅ | None |
| Empty validation | ✅ | ✅ | None |
| Valid login | ✅ | ✅ | None |
| Remember Me | ✅ | ✅ | None |
| Forgot Password | ✅ | ✅ | None |

## Recommendations

1. **Positive**: All core functionality working as expected
2. **Issues**: [List any bugs found]
3. **Improvements**: [Suggest enhancements]
4. **Next Steps**: [What should be tested next]

## Conclusion

The admin login module is [READY FOR PRODUCTION / NEEDS FIXES / REQUIRES REDESIGN].

All acceptance criteria are [SATISFIED / NOT SATISFIED].

---
**Report Generated**: [Date/Time]
**Prepared By**: [Your Name]
**Environment**: Production
```

### Attach Evidence:

```
test-results/
├── reports/
│   └── index.html (generated by Playwright)
├── screenshots/
│   ├── tc-login-01-1-password-visible.png
│   ├── tc-login-02-1-empty-error.png
│   └── [other screenshots]
└── hr-profile-management-admin-test-report-login.md (your report)
```

### ✅ Expected Output:
```
✅ Comprehensive test report created
✅ All test results documented
✅ Screenshots attached as evidence
✅ Issues clearly identified
✅ Recommendations provided
```

---

## 🐛 STEP 9: Document Defects

**Objective**: Create defect tickets for any issues found

### Create Defect Log:

```bash
# Create file: docs/defects/defects-log.md
```

### Log Format:

```markdown
# Defects Log - Admin Login Module

## Defect #1: Password Toggle Not Responding
- **ID**: DEF-001
- **Date Found**: [Date]
- **Severity**: High
- **Status**: Open / In Progress / Fixed
- **Test Case**: TC_LOGIN_01.1
- **Component**: Password Visibility Toggle

### Scenario
When user clicks the eye icon to toggle password visibility, the icon doesn't respond.

### Steps to Reproduce
1. Navigate to login page
2. Enter password: "TestPassword123"
3. Click eye icon to show password
4. Expected: Password becomes visible (input type changes from 'password' to 'text')
5. Actual: Icon doesn't respond, password remains hidden

### Expected Result
Password should become visible/hidden based on eye icon clicks

### Actual Result
Eye icon doesn't respond to clicks

### Evidence
- Screenshot: test-results/screenshots/defect-001.png
- Console Error: [Copy any JS errors]
- Browser: Chrome 120
- OS: macOS

### Environment
- App URL: https://smart-hr-fe.vercel.app/login
- Environment: Production
- Test Credentials: alex.morgan@smart-hr.com

### Notes
This is a critical issue as password visibility is an important UX feature.
```

### Create JIRA Tickets (if integration available):

If you have **Atlassian MCP** connected, create tickets programmatically:

```bash
# Use Atlassian Rovo tool to create JIRA issue
# In Claude or your automation tool, you can:
# - Create issue with title, description, steps to reproduce
# - Attach screenshots as evidence
# - Set priority/severity
# - Assign to developer
```

### ✅ Expected Output:
```
✅ Defects documented in defects-log.md
✅ JIRA tickets created (if applicable)
✅ Screenshots attached to each defect
✅ Severity levels assigned
✅ Clear reproduction steps provided
```

---

## 💾 STEP 10: Commit to Git Repository

**Objective**: Version control all test assets and push to GitHub

### Tasks:

1. **Stage all files**:
   ```bash
   git add .
   ```

2. **Check what's staged**:
   ```bash
   git status
   ```

   Should show:
   ```
   A tests/pages/base.page.ts
   A tests/pages/login.page.ts
   A tests/specs/login/login.spec.ts
   A config/test-data.json
   A playwright.config.ts
   A package.json
   A .gitignore
   A specs/hr-profile-management-Admin-test-plan-login.md
   A test-results/hr-profile-management-admin-test-report-login.md
   A docs/defects/defects-log.md
   ```

3. **Create meaningful commit**:
   ```bash
   git commit -m "feat(tests): Add complete login automation test suite

   - Add Playwright configuration with TypeScript setup
   - Add Page Object Models for login and forgot password flows
   - Add 12 comprehensive test cases covering all scenarios:
     * TC_LOGIN_01: Password visibility toggle (2 tests)
     * TC_LOGIN_02: Empty credentials validation (3 tests)
     * TC_LOGIN_03: Valid admin login flow (2 tests)
     * TC_LOGIN_04: Remember Me functionality (1 test)
     * TC_FP_01-03: Forgot Password workflows (2 tests)
   - Add test data configuration with admin credentials
   - Add test execution report with results
   - Add defects log for issues found
   - Add npm scripts for convenient test execution:
     * npm run test:login - Run all login tests
     * npm run test:headed - Run with visible browser
     * npm run test:ui - Interactive mode
     * npm run test:debug - Debug mode
     * npm run test:report - View HTML report
   
   All tests organized using Page Object Model pattern for maintainability.
   100% coverage of login module acceptance criteria.

   Resolves: Admin Login Module Automation"
   ```

4. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

   If you get error about branch:
   ```bash
   git branch -M main
   git push -u origin main
   ```

5. **Verify on GitHub**:
   Visit: https://github.com/nuwanthiuwu/hr-profile-management-automation
   
   Check:
   - ✅ All files visible
   - ✅ Commit message descriptive
   - ✅ Structure correct
   - ✅ No sensitive data exposed

6. **Share repository link**:
   ```
   https://github.com/nuwanthiuwu/hr-profile-management-automation
   ```

### ✅ Expected Output:
```
✅ All files committed to Git
✅ Descriptive commit message
✅ Successfully pushed to GitHub
✅ Repository accessible and organized
✅ Ready for team collaboration
```

---

## 📈 Optional: Continuous Integration Setup

After main workflow is complete, consider:

1. **GitHub Actions CI/CD**
   - Auto-run tests on every push
   - Generate reports
   - Send notifications

2. **Integration with JIRA**
   - Auto-create tickets for failures
   - Link tests to user stories

3. **Slack Notifications**
   - Alert team of test failures
   - Share test reports

---

## 🎯 Quick Reference Checklist

### Before Each Test Run:
- [ ] All code changes committed
- [ ] Latest selectors in `login.page.ts`
- [ ] Test credentials still valid
- [ ] Playwright installed: `npx playwright --version`
- [ ] No network issues blocking app access

### After Each Test Run:
- [ ] Review test report: `npm run test:report`
- [ ] Document any failures
- [ ] Create defect tickets
- [ ] Fix identified issues
- [ ] Update selectors if needed
- [ ] Commit changes

### Weekly Tasks:
- [ ] Review test coverage
- [ ] Update selectors if UI changed
- [ ] Check for deprecated Playwright APIs
- [ ] Verify credentials still work

---

## 🚀 You're Done!

Your end-to-end automation workflow is complete!

### What You've Achieved:
- ✅ Set up Playwright automation framework
- ✅ Created Page Object Model structure
- ✅ Automated 12 test cases
- ✅ Integrated with Git/GitHub
- ✅ Generated test reports
- ✅ Documented defects

### Next Phase:
1. Add more test modules (Dashboard, Profile, Settings, etc.)
2. Set up CI/CD pipeline
3. Integrate JIRA for defect tracking
4. Scale to entire application

---

**Happy Testing! 🧪✨**

For questions, refer to:
- Playwright Docs: https://playwright.dev
- Project README.md: Your local README file
- SETUP_INSTRUCTIONS.md: Detailed setup guide
