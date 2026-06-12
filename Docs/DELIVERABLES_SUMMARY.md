# Deliverables Summary & Usage Guide

**Last verified:** 2026-06-12
**Total tests:** 117 across 13 modules — 116 passing, 1 open defect (ILS-1)
**Repository:** https://github.com/nuwanthiuwu/hr-profile-management-automation

---

## 1. File Inventory

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `playwright.config.ts` | Playwright config — reporters read `REPORT_DIR` env var for module-wise output | Root |
| `package.json` | NPM dependencies and scripts | Root |
| `tsconfig.json` | TypeScript configuration | Root |
| `config/test-data.json` | Test credentials, URLs, search terms, form inputs | `config/` |

### Page Object Files (`tests/pages/`)

| File | Module | Key Locators / Methods |
|------|--------|------------------------|
| `base.page.ts` | Shared base | `click`, `fill`, `waitForVisible`, `goto` |
| `login.page.ts` | Login / Forgot Password | `emailInput`, `passwordInput`, `signInButton`, `forgotPasswordLink` |
| `navigation.page.ts` | Left sidebar | Nav links by href, collapse/expand |
| `dashboard.page.ts` | Dashboard | Stat cards, quick-action buttons, recent employees section |
| `employee.page.ts` | Employee List | Search input, role/status filters, pagination, sort headers |
| `cv-template.page.ts` | CV Templates | Upload form, file input, actions menu |
| `profile.page.ts` | My Profile | 7 tabs, personal info form, document upload, reset password |
| `wall.page.ts` | Wall & Posts | Post form, comment input, reaction buttons, filter/sort selectors |
| `people.page.ts` | People / Directory | Search input, person cards, back navigation |
| `opportunities.page.ts` | Opportunities | Post form dialog, Close/Reopen buttons |
| `designations.page.ts` | Designations | Search, status filter, page-size select, CSV upload, create form, sort header |
| `profile-menu.page.ts` | Profile Menu (Header) | Profile button, My Profile / Reset Password / Help & Support / Sign Out items |
| `global-search.page.ts` | Global Search | Search button (Cmd+K), search input, result cards, no-results heading |
| `notifications.page.ts` | Notifications | Bell button, notification panel, Mark all read, Refresh, item list |

### Spec Files (`tests/specs/`)

| File | Module | Test IDs | Tests |
|------|--------|----------|-------|
| `login/login.spec.ts` | Login & Forgot Password | TC_LOGIN_01–04, TC_FP_01–03 | 12 |
| `menu/menu.spec.ts` | Left Side Menu | TC_MENU_01–06 | 8 |
| `dashboard/dashboard.spec.ts` | Dashboard | TC_DASH_01–09 | 9 |
| `employees/employee.spec.ts` | Employee List | TC_EMP_01–18 | 18 |
| `employees/create-employee.spec.ts` | Create Employee | TC_CREATE_EMP_01–12 | 12 |
| `cv-templates/cv-template.spec.ts` | CV Templates | TC_CV_01–04 | 4 |
| `profile/profile.spec.ts` | My Profile | TC_MP_01–11 | 12 |
| `wall/wall.spec.ts` | Wall & Posts | TC_WALL_01–05, TC_POST_01–07 | 13 |
| `people/people.spec.ts` | People / Directory | TC_PEOPLE_01–05 | 5 |
| `opportunities/opportunities.spec.ts` | Opportunities | TC_OPP_01–03 | 3 |
| `designations/designations.spec.ts` | Designations | TC_DES_01–08 | 8 |
| `profile-menu/profile-menu.spec.ts` | Profile Menu (Header) | TC_PROFILE_01–04 | 4 |
| `global-search/global-search.spec.ts` | Global Search | TC_SEARCH_01–05 | 5 |
| `notifications/notifications.spec.ts` | Notifications | TC_NOTIF_01–04 | 4 |
| **Total** | | | **117** |

### Test Fixtures (`tests/fixtures/`)

| File | Purpose |
|------|---------|
| `test-image.png` | 1×1 PNG for profile picture upload tests |
| `test-cv.pdf` | Minimal valid PDF for CV/document upload tests |

### Documentation (`Docs/`)

| File | Purpose |
|------|---------|
| `README.md` | Project overview, structure, test coverage table, skills reference |
| `SETUP_INSTRUCTIONS.md` | Prerequisites, installation, first-run guide, troubleshooting |
| `E2E_WORKFLOW.md` | Step-by-step QA workflow for running, adding, and maintaining modules |
| `DELIVERABLES_SUMMARY.md` | This file — complete file inventory and test case listing |
| `test-data.json` | Reference copy of `config/test-data.json` |
| `user-stories/` | 7 source user story files |

### User Stories (`Docs/user-stories/`)

| File | Modules covered |
|------|----------------|
| `Login.md` | TC_LOGIN_01–04, TC_FP_01–03 |
| `Left menu and Dashboard .md` | TC_MENU_01–06, TC_DASH_01–09 |
| `Employee.md` | TC_EMP_01–18, TC_CREATE_EMP_01–12 |
| `CV templates and My profile.md` | TC_CV_01–04, TC_MP_01–11 |
| `Wall.md` | TC_WALL_01–05, TC_POST_01–07 |
| `People and Opportunities.md` | TC_PEOPLE_01–05, TC_OPP_01–03 |
| `Designation and Side profile menu.md` | TC_DES_01–08, TC_PROFILE_01–04 |
| `Global search and Notifications.md` | TC_SEARCH_01–05, TC_NOTIF_01–04 |

### Claude Code Skills (`.claude/commands/`)

| File | Slash command | Purpose |
|------|--------------|---------|
| `run-tests.md` | `/run-tests [module]` | Run tests + store evidence in timestamped module folder |
| `inspect-page.md` | `/inspect-page <path>` | Headless DOM inspection → stable selectors |
| `automate-module.md` | `/automate-module <story>` | Read user story → create POM + spec → run & fix |
| `fix-tests.md` | `/fix-tests [module]` | Diagnose failures → patch → rerun until green |
| `commit-module.md` | `/commit-module <module>` | Stage correct files → commit → push |
| `update-docs.md` | `/update-docs` | Sync test-data.json + rewrite DELIVERABLES_SUMMARY |
| `new-module.md` | `/new-module <module>` | Full pipeline: inspect + automate + fix + commit + docs |

---

## 2. Total Test Coverage

| Module | Test IDs | Count | Status |
|--------|----------|-------|--------|
| Login & Forgot Password | TC_LOGIN_01–04, TC_FP_01–03 | 12 | All passing |
| Left Side Menu | TC_MENU_01–06 | 8 | All passing |
| Dashboard | TC_DASH_01–09 | 9 | All passing |
| Employee List | TC_EMP_01–18 | 18 | All passing |
| Create Employee | TC_CREATE_EMP_01–12 | 12 | All passing |
| CV Templates | TC_CV_01–04 | 4 | All passing |
| My Profile | TC_MP_01–11 | 12 | All passing |
| Wall & Posts | TC_WALL_01–05, TC_POST_01–07 | 13 | All passing |
| People / Directory | TC_PEOPLE_01–05 | 5 | All passing |
| Opportunities | TC_OPP_01–03 | 3 | All passing |
| Designations | TC_DES_01–08 | 8 | All passing |
| Profile Menu (Header) | TC_PROFILE_01–04 | 4 | 3 passing, ILS-1 open |
| Global Search | TC_SEARCH_01–05 | 5 | All passing |
| Notifications | TC_NOTIF_01–04 | 4 | All passing |
| **Total** | | **117** | **116 passing** |

---

## 3. Test Case Listing

### Login & Forgot Password (12 tests)

| Test ID | Description |
|---------|-------------|
| TC_LOGIN_01.1 | Should toggle password visibility from hidden to visible |
| TC_LOGIN_01.2 | Should toggle password visibility from visible to hidden |
| TC_LOGIN_02.1 | Should display error when both fields are empty |
| TC_LOGIN_02.2 | Should display error when email is empty |
| TC_LOGIN_02.3 | Should display error when password is empty |
| TC_LOGIN_03.1 | Should successfully login with valid admin credentials |
| TC_LOGIN_03.2 | Should create user session after successful login |
| TC_LOGIN_04.1 | Should keep user logged in after closing and reopening browser |
| TC_FP_01.1 | Should send reset link for valid registered email |
| TC_FP_02.1 | Should show validation error for invalid email format |
| TC_FP_02.2 | Should show error for unregistered email |
| TC_FP_03.1 | Should navigate back to login page from forgot password |

### Left Side Menu (8 tests)

| Test ID | Description |
|---------|-------------|
| TC_MENU_01.1 | Should navigate to Dashboard page |
| TC_MENU_02.1 | Should navigate to Employees page |
| TC_MENU_03.1 | Should navigate to Wall page |
| TC_MENU_03.2 | Should navigate to People page |
| TC_MENU_03.3 | Should navigate to Opportunities page |
| TC_MENU_04.1 | Should navigate to Designation page |
| TC_MENU_05.1 | Should navigate to CV Templates page |
| TC_MENU_06.1 | Should navigate to My Profile page |

### Dashboard (9 tests)

| Test ID | Description |
|---------|-------------|
| TC_DASH_01.1 | Should display total employee count |
| TC_DASH_02.1 | Should display active employee count |
| TC_DASH_03.1 | Should display inactive employee count |
| TC_DASH_04.1 | Should display average profile completion percentage |
| TC_DASH_05.1 | Should navigate to Designation page when Manage Designation is clicked |
| TC_DASH_06.1 | Should open employee creation form when Create Employee is clicked |
| TC_DASH_07.1 | Should display recent employees section with employee records |
| TC_DASH_08.1 | Should display needs attention section with employee records |
| TC_DASH_09.1 | Should navigate to Employees page when View All is clicked |

### Employee List (18 tests)

| Test ID | Description |
|---------|-------------|
| TC_EMP_01.1 | Should return matching employees when searching by name |
| TC_EMP_02.1 | Should return exact employee when searching by email |
| TC_EMP_03.1 | Should return matching employee when searching by employee ID |
| TC_EMP_04.1 | Should display all employees when All Roles is selected |
| TC_EMP_05.1 | Should display only admin users when Admin role is selected |
| TC_EMP_06.1 | Should display only employee role users when Employee is selected |
| TC_EMP_07.1 | Should display all employees when All Statuses is selected |
| TC_EMP_08.1 | Should display only active employees when Active status is selected |
| TC_EMP_09.1 | Should display only inactive employees when Inactive status is selected |
| TC_EMP_10.1 | Should sort records when Name header is clicked |
| TC_EMP_11.1 | Should sort records when Designation header is clicked |
| TC_EMP_12.1 | Should sort records when Role header is clicked |
| TC_EMP_13.1 | Should sort records when Status header is clicked |
| TC_EMP_14.1 | Should sort records when Completion header is clicked |
| TC_EMP_15.1 | Should show at most 10 records when 10 per page is selected |
| TC_EMP_16.1 | Should show at most 20 records when 20 per page is selected |
| TC_EMP_17.1 | Should show at most 50 records when 50 per page is selected |
| TC_EMP_18.1 | Should display valid employee data in all columns |

### Create Employee (12 tests)

| Test ID | Description |
|---------|-------------|
| TC_CREATE_EMP_01.1 | Should open employee creation form when Create Employee is clicked |
| TC_CREATE_EMP_02.1 | Should close form when the X button is clicked |
| TC_CREATE_EMP_03.1 | Should show validation errors when form is submitted empty |
| TC_CREATE_EMP_04.1 | Should create employee successfully with valid details |
| TC_CREATE_EMP_05.1 | Should accept a valid profile image upload |
| TC_CREATE_EMP_06.1 | Should accept a CV file upload |
| TC_CREATE_EMP_07.1 | Should accept education details in the Education section |
| TC_CREATE_EMP_08.1 | Should accept certification details in the Certification section |
| TC_CREATE_EMP_09.1 | Should accept achievement details in the Achievement section |
| TC_CREATE_EMP_10.1 | Should accept work experience details in the Experience section |
| TC_CREATE_EMP_11.1 | Should close form and discard data when Cancel is clicked |
| TC_CREATE_EMP_12.1 | Should show success confirmation after employee is created |

### CV Templates (4 tests)

| Test ID | Description |
|---------|-------------|
| TC_CV_01.1 | Should upload a valid CV template file successfully |
| TC_CV_02.1 | Should show validation error when uploading an unsupported file type |
| TC_CV_03.1 | Should close the upload form when Cancel is clicked |
| TC_CV_04.1 | Should open the actions menu and show View Details option |

### My Profile (12 tests)

| Test ID | Description |
|---------|-------------|
| TC_MP_01.1 | Should show profile picture upload control when change button is clicked |
| TC_MP_02.1 | Should save updated personal information when Save Changes is clicked |
| TC_MP_03.1 | Should show work and contact fields when Work & Contact tab is clicked |
| TC_MP_04.1 | Should show Education & Skills section with Add button when tab is clicked |
| TC_MP_05.1 | Should show Accomplishments section with Add button when tab is clicked |
| TC_MP_05.2 | Should show Work Experience section with Add button when tab is clicked |
| TC_MP_06.1 | Should accept a CV file upload on the Documents tab |
| TC_MP_07.1 | Should show Open CV button on Documents tab |
| TC_MP_08.1 | Should navigate to reset password page when Reset Password is clicked |
| TC_MP_09.1 | Should save profile changes when Save Changes is clicked |
| TC_MP_10.1 | Should discard unsaved changes when Cancel is clicked |
| TC_MP_11.1 | Should end session and redirect to login when Sign Out is clicked |

### Wall & Posts (13 tests)

| Test ID | Description |
|---------|-------------|
| TC_WALL_01.1 | Should create a new post and display it in the feed |
| TC_WALL_02.1 | Should prevent submission or truncate content exceeding 700 characters |
| TC_WALL_03.1 | Should accept a document file attached to the post form |
| TC_WALL_04.1 | Should filter to My Posts and back to All Posts |
| TC_WALL_05.1 | Should sort posts by Most popular and Most recent |
| TC_POST_01.1 | Should update reaction count when a reaction is added |
| TC_POST_02.1 | Should add a comment and display it under the post |
| TC_POST_03.1 | Should submit a reply to an existing comment |
| TC_POST_04.1 | Should update like count when a comment is liked |
| TC_POST_05.1 | Should update reaction count correctly when reaction is added or removed |
| TC_POST_06.1 | Should increment comment count when a new comment is added |
| TC_POST_07.1 | Should update post title when edited and saved |
| TC_POST_07.2 | Should remove post from feed when deleted |

### People / Directory (5 tests)

| Test ID | Description |
|---------|-------------|
| TC_PEOPLE_01.1 | Should show matching people when searching by name |
| TC_PEOPLE_02.1 | Should show people with the searched role |
| TC_PEOPLE_03.1 | Should show filtered results when searching by department |
| TC_PEOPLE_04.1 | Should display people cards on the People page |
| TC_PEOPLE_05.1 | Should open the corresponding profile when a person card is clicked |

### Opportunities (3 tests)

| Test ID | Description |
|---------|-------------|
| TC_OPP_01.1 | Should create a new opportunity post and display it in the list |
| TC_OPP_02.1 | Should change button to "Close" when a closed post is reopened |
| TC_OPP_03.1 | Should change button to "Reopen" when a post is closed |

### Designations (8 tests)

| Test ID | Description |
|---------|-------------|
| TC_DES_01.1 | Should display matching designations when searched by name |
| TC_DES_02.1 | Should filter designations correctly by Active, Inactive, and All statuses |
| TC_DES_03.1 | Should import designations from a valid CSV file |
| TC_DES_04.1 | Should create a new designation and display it in the list |
| TC_DES_05.1 | Should show at most 10 records per page when 10 is selected |
| TC_DES_06.1 | Should show more records when page size is increased to 20 |
| TC_DES_07.1 | Should show all available records when page size is 50 |
| TC_DES_08.1 | Should toggle sort order when Last Modified header is clicked |

### Profile Menu — Header (4 tests)

| Test ID | Description | Status |
|---------|-------------|--------|
| TC_PROFILE_01.1 | Should navigate to My Profile page from the header profile menu | Passing |
| TC_PROFILE_02.1 | Should open the Reset Password dialog from the profile menu | Passing |
| TC_PROFILE_03.1 | Should navigate to the Help & Support page when selected from the profile menu | **FAILING — ILS-1** |
| TC_PROFILE_04.1 | Should sign out and redirect to the login page | Passing |

### Global Search (5 tests)

| Test ID | Description |
|---------|-------------|
| TC_SEARCH_01.1 | Should display matching employees when searched by name |
| TC_SEARCH_02.1 | Should display exact employee when searched by email |
| TC_SEARCH_03.1 | Should display exact matching employee when searched by employee ID |
| TC_SEARCH_04.1 | Should display employees matching the searched designation |
| TC_SEARCH_05.1 | Should display no results message for an invalid search term |

### Notifications (4 tests)

| Test ID | Description |
|---------|-------------|
| TC_NOTIF_01.1 | Should display a notification count badge on the bell icon |
| TC_NOTIF_02.1 | Should reload notifications when Refresh is clicked |
| TC_NOTIF_03.1 | Should display notification details when the panel is opened |
| TC_NOTIF_04.1 | Should mark all notifications as read when Mark all read is clicked |

---

## 4. NPM Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all 117 tests headlessly |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Open Playwright interactive UI |
| `npm run test:debug` | Run with Playwright Inspector |
| `npm run test:report` | Open last HTML report |
| `npm run codegen` | Record new selectors via browser interaction |

Targeting a specific module:

```bash
npx playwright test tests/specs/<module>/
```

---

## 5. Claude Code Skills

| Skill | What it does |
|-------|-------------|
| `/run-tests [module]` | Run tests + store HTML/JSON/JUnit + screenshots/videos in `test-results/<module>/run_<ts>/` |
| `/inspect-page <path>` | Headless DOM inspection; returns stable selectors for all interactive elements |
| `/automate-module <story-file>` | Read user story → inspect app → create POM + spec → run & fix failures |
| `/fix-tests [module]` | Run tests → diagnose failures → patch → rerun until all pass |
| `/commit-module <module>` | Stage module files → conventional commit → push to GitHub |
| `/update-docs` | Sync `Docs/test-data.json` + rewrite this file |
| `/new-module <module>` | Full pipeline: inspect + automate + fix + commit + update-docs |

---

## 6. Key Technical Notes

| Topic | Note |
|-------|------|
| **Report storage** | `playwright.config.ts` reads `REPORT_DIR` env var; `/run-tests` sets it to the timestamped folder so reporters write directly to the right place |
| **Playwright wipe zone** | Only `test-results/<module>/run_<ts>/.artifacts/` is wiped; all other run folders persist |
| **Headless mode** | Default; set `HEADLESS=false` to see the browser |
| **React event handlers** | Wall reaction, Like, and profile-menu buttons require `evaluate(el => el.click())` — Playwright synthetic events don't reach React's `onClick` |
| **Comment submission** | Press `Enter` (React onKeyPress); then `waitForTimeout(2500)` instead of `waitForLoadState` for DOM re-render |
| **`waitForLoadState`** | Use `networkidle` on most pages; `domcontentloaded` returns before React mounts form inputs |
| **File upload inputs** | IDs regenerate on each render; use `accept` attribute: `input[accept*="image/png"]`, `input[accept*=".pdf,.doc,.docx"]` |
| **Duplicate IDs** | Create Employee form reuses `#title` and `#description` across Certification, Achievement, Experience sections; use XPath to scope: `//p[normalize-space()="Certification"]/following::input[@id="title"][1]` |
| **Native confirm dialogs** | Cancel with unsaved data triggers browser confirm; handle with `page.once('dialog', d => d.accept())` before the triggering click |
| **Exact text matching** | Use `p:text-is("Active")` not `:has-text("Active")` to avoid matching "Inactive" |
| **Wall edit dialog** | Native `<dialog>` element; scope with `dialog[open] #title` to avoid ambiguity |
| **People route** | Navigates to `/directory`, not `/people` |
| **Global Search route** | Navigates to `/search` when Cmd+K button is clicked; results are `button[class*="text-left"]` inside `[role="search"]` |
| **Notification panel** | `div[class*="absolute right-0 z-50"]`; unread count from `button[aria-label*="Notifications"]` aria-label |
| **CSV Upload button** | `dialog[open] button:has-text("Upload")` matches two elements; use `.filter({ hasText: /^Upload$/ })` |
| **Open defect ILS-1** | TC_PROFILE_03: Help & Support `<button>` has no `onclick`/`href` — app defect, not a test issue |
| **JIRA** | Project: ILS; Cloud ID: `981bbbf5-6901-4309-9dbc-795cdbcf2971`; create bugs only for tests failing after 3 rounds |
