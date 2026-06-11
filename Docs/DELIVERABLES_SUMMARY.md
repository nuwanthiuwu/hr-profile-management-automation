# Deliverables Summary & Usage Guide

## What You've Received

A **complete, production-ready Playwright automation framework** for the Smart HR admin application, covering six modules: Login, Left Menu & Dashboard, Employees, Create Employee, CV Templates, and My Profile.

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
| **cv-template.page.ts** | CV Templates list + upload form + actions menu | `tests/pages/` |
| **profile.page.ts** | My Profile page — all 7 tabs and form fields | `tests/pages/` |

### Test Specs

| File | Test IDs | Count | Location |
|------|----------|-------|----------|
| **login.spec.ts** | TC_LOGIN_01–04, TC_FP_01–03 | 12 | `tests/specs/login/` |
| **menu.spec.ts** | TC_MENU_01–06 | 8 | `tests/specs/menu/` |
| **dashboard.spec.ts** | TC_DASH_01–09 | 9 | `tests/specs/dashboard/` |
| **employee.spec.ts** | TC_EMP_01–18 | 18 | `tests/specs/employees/` |
| **create-employee.spec.ts** | TC_CREATE_EMP_01–12 | 12 | `tests/specs/employees/` |
| **cv-template.spec.ts** | TC_CV_01–04 | 4 | `tests/specs/cv-templates/` |
| **profile.spec.ts** | TC_MP_01–11 | 12 | `tests/specs/profile/` |

### Test Fixtures

| File | Purpose | Location |
|------|---------|----------|
| **test-image.png** | 1×1 PNG for profile picture upload tests | `tests/fixtures/` |
| **test-cv.pdf** | Minimal valid PDF for CV upload tests | `tests/fixtures/` |

### Scripts

| File | Purpose | Location |
|------|---------|----------|
| **generate-summary.js** | Called by /run-tests to write session-summary.md | `scripts/` |

### Documentation

| File | Purpose |
|------|---------|
| **Docs/README.md** | Full project reference with skills guide |
| **Docs/DELIVERABLES_SUMMARY.md** | This file |
| **Docs/test-data.json** | Reference copy of config/test-data.json |
| **Docs/SETUP_INSTRUCTIONS.md** | Step-by-step setup guide |
| **Docs/E2E_WORKFLOW.md** | Complete end-to-end workflow |

### User Stories

| File | Module |
|------|--------|
| **user-stories/Left menu and Dashboard .md** | Menu & Dashboard module |
| **user-stories/Employee.md** | Employees & Create Employee module |
| **user-stories/CV templates and My profile.md** | CV Templates & My Profile module |

### Claude Code Skills

| File | Slash Command | Purpose |
|------|--------------|---------|
| **.claude/commands/run-tests.md** | `/run-tests [module]` | Run tests + organise evidence into timestamped session folder |
| **.claude/commands/inspect-page.md** | `/inspect-page <path>` | Headless scan of any app page for real selectors |
| **.claude/commands/automate-module.md** | `/automate-module <file>` | Read story → inspect → create POM + spec → run + fix |
| **.claude/commands/fix-tests.md** | `/fix-tests [module]` | Run tests, diagnose failures, patch, rerun until green |
| **.claude/commands/commit-module.md** | `/commit-module <module>` | Stage correct files, write commit message, push |
| **.claude/commands/update-docs.md** | `/update-docs` | Sync test-data + rewrite DELIVERABLES_SUMMARY |
| **.claude/commands/new-module.md** | `/new-module <name>` | Full pipeline for a new module — composes all skills |

---

## Total Test Coverage

| Module | Test IDs | Tests | Status |
|--------|----------|-------|--------|
| Login & Forgot Password | TC_LOGIN_01–04, TC_FP_01–03 | 12 | All passing |
| Left Side Menu | TC_MENU_01–06 | 8 | All passing |
| Dashboard | TC_DASH_01–09 | 9 | All passing |
| Employee List | TC_EMP_01–18 | 18 | All passing |
| Create Employee | TC_CREATE_EMP_01–12 | 12 | All passing |
| CV Templates | TC_CV_01–04 | 4 | All passing |
| My Profile | TC_MP_01–11 | 12 | All passing |
| **Total** | | **75** | **All passing** |

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
- TC_MENU_01.1–06.1: Navigate to Dashboard, Employees, Wall, People, Opportunities, Designations, CV Templates, My Profile

### Dashboard Tests (9 tests)
- TC_DASH_01.1–09.1: Stat cards, quick actions, Manage Designations, View All, Create Employee drawer, Needs Attention, Recent Employees, heading

### Employee List Tests (18 tests)
- TC_EMP_01.1–03.1: Search by name, email, employee ID (MongoDB ObjectId)
- TC_EMP_04.1–06.1: Role filters (All, Admin, Employee)
- TC_EMP_07.1–09.1: Status filters (All, Active, Inactive)
- TC_EMP_10.1–14.1: Sort by Name, Designation, Role, Status, Completion
- TC_EMP_15.1–17.1: Pagination 10, 20, 50 records
- TC_EMP_18.1: Data validation across all columns

### Create Employee Tests (12 tests)
- TC_CREATE_EMP_01.1–02.1: Open and close drawer
- TC_CREATE_EMP_03.1: Validation errors on empty submit
- TC_CREATE_EMP_04.1: Successful employee creation
- TC_CREATE_EMP_05.1–06.1: Profile picture and CV upload
- TC_CREATE_EMP_07.1–10.1: Education, certification, achievement, experience sections
- TC_CREATE_EMP_11.1: Cancel with unsaved-changes confirm dialog
- TC_CREATE_EMP_12.1: Success toast after creation

### CV Templates Tests (4 tests)
- TC_CV_01.1: Upload form opens with template name and file inputs
- TC_CV_02.1: Invalid file type (.png) rejected by accept attribute
- TC_CV_03.1: Cancel closes the upload form
- TC_CV_04.1: Actions menu opens with View Details option

### My Profile Tests (12 tests)
- TC_MP_01.1: Profile picture upload — base64 preview rendered
- TC_MP_02.1: Edit personal information and save
- TC_MP_03.1: Work & Contact tab — contact number and address fields
- TC_MP_04.1: Education & Skills tab — Add button visible
- TC_MP_05.1: Accomplishments tab — Add button visible
- TC_MP_05.2: Work Experience tab — Add button visible
- TC_MP_06.1: Documents tab — CV file upload
- TC_MP_07.1: Documents tab — Open CV button visible
- TC_MP_08.1: Security tab — Reset Password button (sends email silently)
- TC_MP_09.1: Save Changes button — professional summary
- TC_MP_10.1: Cancel reverts unsaved changes
- TC_MP_11.1: Sign Out redirects to login page

---

## Key Technical Notes

- **Headless by default.** Set `HEADLESS=false` to see the browser.
- **Screenshots and videos** recorded for every test run.
- **`waitForLoadState('networkidle')`** required in headless mode — React mounts after domcontentloaded.
- **File upload inputs** use dynamic IDs — stable selectors use `accept` attribute.
- **Duplicate IDs** in Create Employee form — use XPath `following::` axis selectors.
- **Native confirm dialogs** — handled with `page.once('dialog', d => d.accept())`.
- **Exact text matching** — use `p:text-is("Active")` not `:has-text()`.
- **Profile picture upload** — React renders a `data:image/...` base64 preview.
- **Reset Password** — triggers silent email dispatch; no navigation occurs.
- **CV upload form** — inline, not a dialog; revealed after clicking Upload Template.
- **Actions menu** — uses `[role="menu"]` / `[role="menuitem"]` Radix UI pattern.
