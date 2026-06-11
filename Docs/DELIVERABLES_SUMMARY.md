# Deliverables Summary & Usage Guide

## What You've Received

A **complete, production-ready Playwright automation framework** for the Smart HR admin application, covering four modules: Login, Left Menu & Dashboard, Employees, and Create Employee.

---

## File Inventory

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| **playwright.config.ts** | Playwright configuration (headless, screenshots, video) | Root |
| **package.json** | NPM dependencies and scripts | Root |
| **tsconfig.json** | TypeScript configuration | Root |
| **test-data.json** | Test credentials, URLs, and test input data | `config/` |

### Page Objects

| File | Purpose | Location |
|------|---------|----------|
| **base.page.ts** | Base class with shared helpers (click, fill, assert, wait) | `tests/pages/` |
| **login.page.ts** | Login and Forgot Password selectors & methods | `tests/pages/` |
| **navigation.page.ts** | Left sidebar navigation selectors & methods | `tests/pages/` |
| **dashboard.page.ts** | Dashboard stat cards, quick actions, sections | `tests/pages/` |
| **employee.page.ts** | Employee list page + Create Employee drawer | `tests/pages/` |

### Test Specs

| File | Test IDs | Count | Location |
|------|----------|-------|----------|
| **login.spec.ts** | TC_LOGIN_01–04, TC_FP_01–03 | 12 | `tests/specs/login/` |
| **menu.spec.ts** | TC_MENU_01–06 | 8 | `tests/specs/menu/` |
| **dashboard.spec.ts** | TC_DASH_01–09 | 9 | `tests/specs/dashboard/` |
| **employee.spec.ts** | TC_EMP_01–18 | 18 | `tests/specs/employees/` |
| **create-employee.spec.ts** | TC_CREATE_EMP_01–12 | 12 | `tests/specs/employees/` |

### Test Fixtures

| File | Purpose | Location |
|------|---------|----------|
| **test-image.png** | 1×1 PNG for profile picture upload tests | `tests/fixtures/` |
| **test-cv.pdf** | Minimal valid PDF for CV upload tests | `tests/fixtures/` |

### Documentation

| File | Purpose |
|------|---------|
| **README.md** | Quick start guide and overview |
| **SETUP_INSTRUCTIONS.md** | Step-by-step setup guide |
| **E2E_WORKFLOW.md** | Complete end-to-end workflow |
| **DELIVERABLES_SUMMARY.md** | This file |
| **test-data.json** | Reference copy of test data |

### User Stories

| File | Module |
|------|--------|
| **user-stories/Left menu and Dashboard .md** | Menu & Dashboard module |
| **user-stories/Employee.md** | Employees & Create Employee module |

---

## Total Test Coverage

| Module | Tests | Status |
|--------|-------|--------|
| Login & Forgot Password | 12 | All passing |
| Left Side Menu | 8 | All passing |
| Dashboard | 9 | All passing |
| Employee List | 18 | All passing |
| Create Employee | 12 | All passing |
| **Total** | **59** | **All passing** |

---

## Test Case Details

### Login Tests (12 tests)
- TC_LOGIN_01.1 / 01.2: Toggle password visibility
- TC_LOGIN_02.1 / 02.2 / 02.3: Empty field validation
- TC_LOGIN_03.1 / 03.2: Successful login and session creation
- TC_LOGIN_04.1: Remember Me persists session
- TC_FP_01.1: Send reset link for valid email
- TC_FP_02.1 / 02.2: Invalid and unregistered email errors
- TC_FP_03.1: Navigate back to login

### Left Menu Tests (8 tests)
- TC_MENU_01.1: Navigate to Dashboard
- TC_MENU_02.1: Navigate to Employees
- TC_MENU_03.1 / 03.2 / 03.3: Navigate to Wall, People, Opportunities
- TC_MENU_04.1: Navigate to Designations (Configuration)
- TC_MENU_05.1: Navigate to CV Templates
- TC_MENU_06.1: Navigate to My Profile

### Dashboard Tests (9 tests)
- TC_DASH_01.1: Stat cards display total/active/inactive/admin counts
- TC_DASH_02.1: Active employee count matches "Active" label
- TC_DASH_03.1: Quick action buttons visible
- TC_DASH_04.1: Manage Designations button navigates correctly
- TC_DASH_05.1: "View all" button navigates to Employees
- TC_DASH_06.1: Create Employee button opens creation drawer
- TC_DASH_07.1: Needs Attention section visible
- TC_DASH_08.1: Recent Employees section visible
- TC_DASH_09.1: Dashboard heading and welcome text visible

### Employee List Tests (18 tests)
- TC_EMP_01.1: Search by name
- TC_EMP_02.1: Search by email
- TC_EMP_03.1: Search by employee ID (MongoDB ObjectId)
- TC_EMP_04.1: Filter All Roles
- TC_EMP_05.1: Filter Admin role only
- TC_EMP_06.1: Filter Employee role only
- TC_EMP_07.1: Filter All Statuses
- TC_EMP_08.1: Filter Active status only
- TC_EMP_09.1: Filter Inactive status only
- TC_EMP_10.1–14.1: Sort by Name, Designation, Role, Status, Completion
- TC_EMP_15.1: Pagination — 10 records per page
- TC_EMP_16.1: Pagination — 20 records per page
- TC_EMP_17.1: Pagination — 50 records per page
- TC_EMP_18.1: Data validation — all columns have valid values

### Create Employee Tests (12 tests)
- TC_CREATE_EMP_01.1: Open Create Employee drawer
- TC_CREATE_EMP_02.1: Close drawer via X button
- TC_CREATE_EMP_03.1: Validation errors on empty submit
- TC_CREATE_EMP_04.1: Successful employee creation
- TC_CREATE_EMP_05.1: Upload profile picture
- TC_CREATE_EMP_06.1: Upload CV file
- TC_CREATE_EMP_07.1: Add education details
- TC_CREATE_EMP_08.1: Add certification details
- TC_CREATE_EMP_09.1: Add achievement details
- TC_CREATE_EMP_10.1: Add work experience details
- TC_CREATE_EMP_11.1: Cancel form with unsaved data (handles native confirm dialog)
- TC_CREATE_EMP_12.1: Success toast confirmation after creation

---

## Available NPM Commands

```bash
# Run all tests (headless by default)
npm test

# Run a specific module
npx playwright test tests/specs/login/
npx playwright test tests/specs/menu/
npx playwright test tests/specs/dashboard/
npx playwright test tests/specs/employees/

# Run with visible browser
HEADLESS=false npx playwright test

# View HTML test report
npm run test:report

# Interactive test UI
npm run test:ui
```

---

## Project Setup

```bash
npm install
npx playwright install chromium
npm test
```

---

## Key Technical Notes

- All tests run in **headless Chromium** by default (`HEADLESS=false` to override)
- **Screenshots** and **videos** are recorded for every test run (not just failures)
- Reports are written to `test-results/reports/`
- The employee ID field uses the MongoDB ObjectId as the system-assigned ID when no custom ID is set
- The Create Employee Cancel button triggers a native browser `confirm` dialog when the form has unsaved data — handled automatically in the page object
- File upload inputs have dynamic IDs on each page load; selectors use the `accept` attribute instead
- Duplicate `#title` and `#description` IDs in the Create Employee form (Certification, Achievement, Experience sections) are resolved with XPath `following::` axis selectors
