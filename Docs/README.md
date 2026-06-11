# HR Profile Management Automation - Complete Setup Guide

## 📋 Quick Overview

This package contains a **complete, production-ready Playwright automation framework** for the Smart HR admin login module using the **Page Object Model (POM)** pattern.

**Application Under Test**: https://smart-hr-fe.vercel.app/login  
**Test Credentials**: alex.morgan@smart-hr.com / 8A1HdsuUgrZR  
**Framework**: Playwright + TypeScript  
**Environment**: Local execution (sequential)  
**Test Cases**: 8 complete test scenarios

---

## 🎯 What's Included

### 📁 Files in This Package

1. **playwright.config.ts** - Playwright configuration for your environment
2. **package.json** - NPM dependencies and scripts
3. **test-data.json** - Configuration for test credentials and URLs
4. **base.page.ts** - Base Page Object class with common utilities
5. **login.page.ts** - Login page object with all selectors and methods
6. **login.spec.ts** - Complete test specifications for all 8 test cases
7. **PROJECT_STRUCTURE.md** - Recommended directory structure
8. **.gitignore** - Git ignore file template
9. **SETUP_INSTRUCTIONS.md** - Step-by-step setup guide
10. **E2E_WORKFLOW.md** - Complete end-to-end workflow documentation

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Create Project Directory
```bash
mkdir hr-profile-management-automation
cd hr-profile-management-automation
```

### Step 2: Create Directory Structure
```bash
mkdir -p tests/{pages,specs/login,fixtures,utils}
mkdir -p config test-results/{reports,screenshots} docs/{user-stories,defects} .github/workflows
```

### Step 3: Copy Files
Copy all provided files to your project:
```
hr-profile-management-automation/
├── playwright.config.ts          (copy to root)
├── package.json                  (copy to root)
├── .gitignore                    (copy to root)
├── config/
│   └── test-data.json           (copy here)
├── tests/
│   └── pages/
│       ├── base.page.ts         (copy here)
│       └── login.page.ts        (copy here)
│   └── specs/
│       └── login/
│           └── login.spec.ts    (copy here)
└── docs/
    └── user-stories/
        └── Login_-_Smart_HR_Profile_Management_System_-_Admin.md
```

### Step 4: Install Dependencies
```bash
npm install
npx playwright install chromium
```

### Step 5: Initialize Git
```bash
git init
git remote add origin https://github.com/nuwanthiuwu/hr-profile-management-automation
```

### Step 6: Run Tests
```bash
npm run test:login
```

---

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:login` | Run only login tests |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:ui` | Run tests in interactive UI mode |
| `npm run test:debug` | Debug mode with inspector |
| `npm run test:report` | Show HTML test report |
| `npm run codegen` | Generate test code from browser interactions |

---

## 📝 Test Cases Covered

### Login Tests (TC_LOGIN_*)
- ✅ **TC_LOGIN_01.1**: Toggle password visibility - hidden to visible
- ✅ **TC_LOGIN_01.2**: Toggle password visibility - visible to hidden
- ✅ **TC_LOGIN_02.1**: Error when both fields empty
- ✅ **TC_LOGIN_02.2**: Error when email empty
- ✅ **TC_LOGIN_02.3**: Error when password empty
- ✅ **TC_LOGIN_03.1**: Successfully login with valid credentials
- ✅ **TC_LOGIN_03.2**: Verify session created after login
- ✅ **TC_LOGIN_04.1**: Remember Me persists session

### Forgot Password Tests (TC_FP_*)
- ✅ **TC_FP_01.1**: Send reset link for valid email
- ✅ **TC_FP_02.1**: Validation error for invalid email format
- ✅ **TC_FP_02.2**: Error for unregistered email
- ✅ **TC_FP_03.1**: Navigate back to login from forgot password

---

## ⚠️ Important: Update Selectors

The `login.page.ts` file contains **placeholder selectors**. You must update them with actual selectors from your application:

### How to Find Correct Selectors

#### Option 1: Using Playwright Inspector (Recommended)
```bash
npx playwright codegen https://smart-hr-fe.vercel.app/login
```
- Opens browser with code generator
- Click on elements to generate selectors
- Copy the selectors to `login.page.ts`

#### Option 2: Browser DevTools
1. Open app in Chrome
2. Right-click on element → "Inspect"
3. Look for: `data-testid`, `id`, `name`, `aria-label`, `role`
4. Use most stable selector

### Selectors to Update in `login.page.ts`

```typescript
// Email input - update this
readonly emailInput: Locator = this.page.locator('YOUR_EMAIL_SELECTOR');

// Password input - update this
readonly passwordInput: Locator = this.page.locator('YOUR_PASSWORD_SELECTOR');

// Password visibility toggle - update this
readonly passwordVisibilityIcon: Locator = this.page.locator('YOUR_TOGGLE_SELECTOR');

// Sign In button - update this
readonly signInButton: Locator = this.page.locator('YOUR_SIGNIN_BUTTON_SELECTOR');

// And so on for other elements...
```

---

## 🔍 Selector Best Practices (Priority Order)

1. **data-testid** (Most Stable) - `[data-testid="email-input"]`
2. **aria-label** - `[aria-label="Email"]`
3. **role** - `[role="button"]`
4. **name** - `input[name="email"]`
5. **id** - `#email-input`
6. **type** - `input[type="email"]`
7. **placeholder** - `input[placeholder*="email"]`
8. **Text content** - `button:has-text("Sign In")`
9. **XPath** (Least Stable - Avoid)

---

## 📊 Test Execution Flow

```
1. Tests Start
   ↓
2. Navigate to Login Page (beforeEach)
   ↓
3. Verify UI Elements Visible
   ↓
4. Test Scenario Execution
   ├─ Fill fields
   ├─ Click buttons
   ├─ Wait for actions
   └─ Assert results
   ↓
5. Capture Screenshots (on failure)
   ↓
6. Generate Report
   ↓
7. Tests Complete
```

---

## 🐛 Troubleshooting

### Issue: Selector Not Found
**Solution**: Update selector in `login.page.ts`
```bash
# Use Playwright Inspector to find correct selector
npx playwright codegen https://smart-hr-fe.vercel.app/login
```

### Issue: Tests Timeout
**Solution**: Increase timeout in `playwright.config.ts`
```typescript
timeout: 60000, // 60 seconds instead of 30
```

### Issue: Password Toggle Not Working
**Solution**: Check if icon selector is correct and element is visible
```bash
# Run test in debug mode
npm run test:debug
```

### Issue: Login Fails But Works Manually
**Solution**: Check if page navigation is complete
- Ensure proper wait conditions
- Use `page.waitForLoadState('networkidle')`
- Add explicit waits for expected elements

---

## 📚 File Descriptions

### `playwright.config.ts`
- Main Playwright configuration
- Sets timeouts, reporters, browser options
- Configured for: headless: false (visible browser), sequential execution
- Sets up HTML report generation

### `package.json`
- NPM project metadata
- Defines all dependencies (Playwright, TypeScript, types)
- Defines convenient npm scripts for running tests

### `test-data.json`
- Centralized configuration for test data
- Stores credentials, URLs, test data values
- Easy to switch between environments
- **IMPORTANT**: Don't commit to Git if using real credentials

### `base.page.ts`
- Base class for all page objects
- Contains common methods: click, fill, getText, assertions, waits
- Provides logging for debugging
- Extends Playwright's Page class

### `login.page.ts`
- Specific page object for login page
- Defines all selectors for login and forgot password
- Contains high-level methods: `loginWithValidCredentials()`, `togglePasswordVisibility()`, etc.
- All tests use methods from this class

### `login.spec.ts`
- Test specification file with all test cases
- Organized by test scenario using `test.describe()`
- Each test is well-commented
- Uses login page object methods

---

## 🔐 Security Considerations

### Test Credentials
- **NEVER commit** real credentials to Git
- Store in `test-data.json` locally (don't commit)
- Use `.env` file for sensitive data
- Add to `.gitignore`

### Best Practice:
```json
// config/test-data.json (LOCAL ONLY - not committed)
{
  "testUsers": {
    "admin": {
      "username": "alex.morgan@smart-hr.com",
      "password": "8A1HdsuUgrZR"
    }
  }
}
```

---

## 📈 Next Steps After Setup

1. ✅ Copy all files to your project
2. ✅ Run `npm install`
3. ✅ Update selectors in `login.page.ts` using Playwright Inspector
4. ✅ Run `npm run test:login` to verify everything works
5. ✅ Fix any failing tests using debug mode
6. ✅ Commit to GitHub
7. ✅ Integrate with CI/CD (GitHub Actions - future phase)

---

## 💡 Tips for Success

### Debugging Tests
```bash
# See browser while tests run
npm run test:headed

# Interactive mode with live reload
npm run test:ui

# Full debug mode with inspector
npm run test:debug
```

### Recording Selectors
```bash
# Auto-generate selectors by interacting with app
npm run codegen
```

### Viewing Reports
```bash
# Opens detailed HTML report with screenshots
npm run test:report
```

---

## 📞 Common Questions

**Q: Do I need to update selectors?**  
A: Yes! The provided selectors are placeholders. Use Playwright Inspector to find the actual selectors.

**Q: Can I run tests in parallel?**  
A: Not in current config. Set `fullyParallel: true` in `playwright.config.ts` if you want parallel execution.

**Q: What if test credentials don't work?**  
A: Verify credentials are correct and account hasn't been locked. Check application login manually.

**Q: How do I add more test cases?**  
A: Add new `test()` blocks to `login.spec.ts`. Use existing tests as templates.

**Q: Can I use other browsers?**  
A: Yes! Uncomment Firefox and WebKit sections in `playwright.config.ts`.

---

## ✅ Verification Checklist

Before running tests, ensure:

- [ ] Node.js v23.6.1 installed (`node -v`)
- [ ] npm v10.9.2 installed (`npm -v`)
- [ ] Git configured (`git config --list`)
- [ ] Project directory created
- [ ] All files copied to correct locations
- [ ] `npm install` completed
- [ ] `npx playwright install` completed
- [ ] Selectors updated in `login.page.ts`
- [ ] Git remote configured
- [ ] Test data configured with valid credentials

---

## 🚀 You're Ready!

Everything is set up. Now:

```bash
cd hr-profile-management-automation
npm run test:login
```

Your tests should execute successfully! 🎉

---

## 📞 Need Help?

Refer to:
- **SETUP_INSTRUCTIONS.md** - Detailed setup steps
- **E2E_WORKFLOW.md** - Complete workflow guide
- **PROJECT_STRUCTURE.md** - Directory structure details
- Playwright Docs: https://playwright.dev/
- Test Case Details: User story in `docs/user-stories/`

---

**Happy Testing! 🧪✨**
