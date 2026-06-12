# HR Profile Management — Playwright Automation Framework

**Application under test:** https://smart-hr-fe.vercel.app
**Framework:** Playwright v1.60 + TypeScript
**Pattern:** Page Object Model (POM)
**Execution:** Headless Chromium, sequential
**Total tests:** 117 across 13 modules — 116 passing, 1 known defect (ILS-1)

---

## Project Structure

```
hr-profile-management-automation/
├── playwright.config.ts          # Reporters read REPORT_DIR env var for module-wise output
├── package.json
├── tsconfig.json
├── config/
│   └── test-data.json            # Credentials, URLs, search terms, form data
├── tests/
│   ├── fixtures/
│   │   ├── test-image.png        # 1×1 PNG for profile picture upload tests
│   │   └── test-cv.pdf           # Minimal PDF for CV upload / document upload tests
│   ├── pages/                    # Page Object Model files
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   ├── navigation.page.ts
│   │   ├── dashboard.page.ts
│   │   ├── employee.page.ts
│   │   ├── cv-template.page.ts
│   │   ├── profile.page.ts
│   │   ├── wall.page.ts
│   │   ├── people.page.ts
│   │   ├── opportunities.page.ts
│   │   ├── designations.page.ts
│   │   ├── profile-menu.page.ts
│   │   ├── global-search.page.ts
│   │   └── notifications.page.ts
│   └── specs/                    # Test specifications
│       ├── login/
│       │   └── login.spec.ts          # TC_LOGIN_01–04, TC_FP_01–03      (12 tests)
│       ├── menu/
│       │   └── menu.spec.ts           # TC_MENU_01–06                     (8 tests)
│       ├── dashboard/
│       │   └── dashboard.spec.ts      # TC_DASH_01–09                     (9 tests)
│       ├── employees/
│       │   ├── employee.spec.ts       # TC_EMP_01–18                      (18 tests)
│       │   └── create-employee.spec.ts# TC_CREATE_EMP_01–12               (12 tests)
│       ├── cv-templates/
│       │   └── cv-template.spec.ts    # TC_CV_01–04                       (4 tests)
│       ├── profile/
│       │   └── profile.spec.ts        # TC_MP_01–11                       (12 tests)
│       ├── wall/
│       │   └── wall.spec.ts           # TC_WALL_01–05, TC_POST_01–07      (13 tests)
│       ├── people/
│       │   └── people.spec.ts         # TC_PEOPLE_01–05                   (5 tests)
│       ├── opportunities/
│       │   └── opportunities.spec.ts  # TC_OPP_01–03                      (3 tests)
│       ├── designations/
│       │   └── designations.spec.ts   # TC_DES_01–08                      (8 tests)
│       ├── profile-menu/
│       │   └── profile-menu.spec.ts   # TC_PROFILE_01–04                  (4 tests)
│       ├── global-search/
│       │   └── global-search.spec.ts  # TC_SEARCH_01–05                   (5 tests)
│       └── notifications/
│           └── notifications.spec.ts  # TC_NOTIF_01–04                    (4 tests)
├── Docs/
│   ├── README.md                 # This file
│   ├── SETUP_INSTRUCTIONS.md     # Prerequisites and first-run guide
│   ├── E2E_WORKFLOW.md           # Step-by-step QA automation workflow
│   ├── DELIVERABLES_SUMMARY.md   # Full file inventory and test case listing
│   ├── test-data.json            # Reference copy of config/test-data.json
│   └── user-stories/             # Source user stories used for automation
│       ├── Left menu and Dashboard .md
│       ├── Employee.md
│       ├── CV templates and My profile.md
│       ├── Wall.md
│       ├── People and Opportunities.md
│       ├── Designation and Side profile menu.md
│       └── Global search and Notifications.md
└── test-results/                 # Created by /run-tests — never wiped between runs
    └── <module>/
        └── run_YYYY-MM-DD_HH-MM-SS/
            ├── reports/          # index.html, results.json, junit.xml
            ├── screenshots/      # One PNG per test, prefixed with test name
            └── videos/           # One WebM per test, prefixed with test name
```

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/nuwanthiuwu/hr-profile-management-automation
cd hr-profile-management-automation
npm install
npx playwright install chromium

# Run all 117 tests
npm test

# Run a single module
npx playwright test tests/specs/wall/

# View the HTML report after any run
npx playwright show-report test-results/reports
```

---

## Test Coverage

| Module | Spec File(s) | Test IDs | Tests | Status |
|--------|-------------|----------|-------|--------|
| Login & Forgot Password | login.spec.ts | TC_LOGIN_01–04, TC_FP_01–03 | 12 | All passing |
| Left Side Menu | menu.spec.ts | TC_MENU_01–06 | 8 | All passing |
| Dashboard | dashboard.spec.ts | TC_DASH_01–09 | 9 | All passing |
| Employee List | employee.spec.ts | TC_EMP_01–18 | 18 | All passing |
| Create Employee | create-employee.spec.ts | TC_CREATE_EMP_01–12 | 12 | All passing |
| CV Templates | cv-template.spec.ts | TC_CV_01–04 | 4 | All passing |
| My Profile | profile.spec.ts | TC_MP_01–11 | 12 | All passing |
| Wall & Posts | wall.spec.ts | TC_WALL_01–05, TC_POST_01–07 | 13 | All passing |
| People / Directory | people.spec.ts | TC_PEOPLE_01–05 | 5 | All passing |
| Opportunities | opportunities.spec.ts | TC_OPP_01–03 | 3 | All passing |
| Designations | designations.spec.ts | TC_DES_01–08 | 8 | All passing |
| Profile Menu (Header) | profile-menu.spec.ts | TC_PROFILE_01–04 | 4 | 3 passing, 1 defect (ILS-1) |
| Global Search | global-search.spec.ts | TC_SEARCH_01–05 | 5 | All passing |
| Notifications | notifications.spec.ts | TC_NOTIF_01–04 | 4 | All passing |
| **Total** | **14 spec files** | | **117** | **116 passing** |

> **Open defect — ILS-1:** TC_PROFILE_03 — Help & Support menu item has no navigation handler wired in the app; stays on `/dashboard` after click.

---

## Test Results Storage

Every `/run-tests` invocation creates a **separate, timestamped folder** per module. Previous runs are never overwritten.

```
test-results/
├── wall/
│   ├── run_2026-06-10_09-00-00/    ← old run preserved
│   └── run_2026-06-12_14-30-00/    ← new run
│       ├── reports/index.html
│       ├── reports/results.json
│       ├── reports/junit.xml
│       ├── screenshots/
│       └── videos/
├── designations/
│   └── run_2026-06-12_15-00-00/
└── ...
```

View any run's HTML report:

```bash
npx playwright show-report test-results/wall/run_2026-06-12_14-30-00/reports
```

---

## NPM Commands

| Command | What it does |
|---------|-------------|
| `npm test` | Run all 117 tests headlessly |
| `npm run test:headed` | Run with visible browser (`HEADLESS=false`) |
| `npm run test:ui` | Open the Playwright interactive UI |
| `npm run test:debug` | Run in debug mode with inspector |
| `npm run test:report` | Open the last HTML report |
| `npm run codegen` | Record new selectors via browser interaction |

Run a specific module:

```bash
npx playwright test tests/specs/login/
npx playwright test tests/specs/wall/
npx playwright test tests/specs/designations/
npx playwright test tests/specs/global-search/
npx playwright test tests/specs/notifications/
# ... any module folder
```

Run with visible browser:

```bash
HEADLESS=false npx playwright test tests/specs/wall/
```

---

## Claude Code Skills

Seven slash commands automate the entire QA lifecycle. Type any in your Claude Code session.

---

### `/run-tests [module]`

Run tests and store all evidence in a timestamped, module-wise folder.

**Arguments:** `login` | `menu` | `dashboard` | `employees` | `cv-templates` | `profile` | `wall` | `people` | `opportunities` | `designations` | `profile-menu` | `global-search` | `notifications` | `all` (default)

**What it does:**
1. Creates `test-results/<module>/run_<timestamp>/`
2. Runs Playwright with `REPORT_DIR` env var pointing to the timestamped reports folder
3. Collects screenshots → `screenshots/` (prefixed with test name)
4. Collects videos → `videos/` (prefixed with test name)
5. Prints a formatted summary: module, commit, totals, failed test list

```
/run-tests wall
/run-tests designations
/run-tests all
```

---

### `/inspect-page <url-path>`

Run a headless Playwright inspection against any page and return all interactive elements with stable selectors.

**Returns:** Headings, inputs (id/placeholder/accept), selects (with options), buttons (text/aria-label), nav links, table headers (aria-sort), dialog roles.

```
/inspect-page /wall
/inspect-page /search
/inspect-page /designations
```

---

### `/automate-module <user-story-file>`

Read a user story, inspect the live app, create the POM and spec files, run tests, fix failures.

```
/automate-module Docs/user-stories/Wall.md
/automate-module "Docs/user-stories/Global search and Notifications.md"
```

---

### `/fix-tests [module]`

Run tests for a module, diagnose each failure by inspecting the live app, patch selectors or assertions, rerun until all pass.

```
/fix-tests wall
/fix-tests designations
```

---

### `/commit-module <module-name>`

Stage the correct files for a module, write a conventional commit message, push to GitHub.

```
/commit-module wall
/commit-module global-search
/commit-module docs
```

---

### `/update-docs`

Sync `Docs/test-data.json` with `config/test-data.json` and rewrite `Docs/DELIVERABLES_SUMMARY.md` to reflect current module count, test counts, and file inventory.

```
/update-docs
```

---

### `/new-module <module-name>`

Full pipeline for a brand-new module: inspect app → create POM + spec → run & fix tests → commit → update docs.

```
/new-module Designations
/new-module "Global Search"
```

---

## Recommended Workflow for a New Module

```
1. Add user story → Docs/user-stories/<Module>.md
2. /new-module <Module>           ← does everything automatically
   — or step-by-step:
   /inspect-page /<route>         ← discover real selectors
   /automate-module Docs/user-stories/<Module>.md
   /fix-tests <module>
   /commit-module <module>
   /update-docs
3. /run-tests <module>            ← verify + capture evidence
```

---

## Key Technical Notes

- **Headless by default.** Set `HEADLESS=false` env var to see the browser.
- **REPORT_DIR env var** in `playwright.config.ts` lets `/run-tests` route all reporters (HTML, JSON, JUnit) directly into the timestamped module folder without post-run file moves.
- **Playwright wipe zone.** The `--output` flag is set to `test-results/<module>/run_<ts>/.artifacts/` per run; Playwright only clears that temp folder, leaving all other run folders intact.
- **Screenshots and videos** are recorded for every test (not just failures) and renamed with the test-folder prefix to prevent overwrites.
- **`waitForLoadState('networkidle')`** is required on most pages — `domcontentloaded` returns before React mounts form inputs.
- **File upload inputs** have dynamic IDs; use the `accept` attribute as the stable selector: `input[accept*="image/png"]`, `input[accept*=".pdf,.doc,.docx"]`.
- **Duplicate IDs** in the Create Employee form (Certification, Achievement, Experience all reuse `#title`): use XPath `//p[normalize-space()="Certification"]/following::input[@id="title"][1]` to scope correctly.
- **Native confirm dialogs** appear when cancelling a form with unsaved data. Handle with `page.once('dialog', d => d.accept())` immediately before the click.
- **Exact text matching:** use `p:text-is("Active")` (not `:has-text`) to avoid "Inactive" being matched by "Active".
- **Wall — Reaction buttons:** Emoji buttons are blocked by a disabled overlay; use `evaluate(el => el.click())` to dispatch a JS-level click.
- **Wall — Comment submission:** Press `Enter` to submit (React `onKeyPress` handler); then `waitForTimeout(2500)` instead of `waitForLoadState` to allow DOM re-render.
- **Wall — Like buttons:** Both post and comment Like buttons require `evaluate(el => el.click())` — Playwright's synthetic events don't reach the React `onClick` handlers.
- **Wall — Edit dialog:** Uses a native `<dialog>` element; scope with `dialog[open] #title` to avoid ambiguity with the post form.
- **People page** routes to `/directory`, not `/people`.
- **Global Search** navigates to `/search` route; results are `button` elements with `active|inactive` text inside `[role="search"]`.
- **Notification panel** is a `div[class*="absolute right-0 z-50"]` dropdown; count parsed from `button[aria-label*="Notifications"]` aria-label.
- **Designations CSV upload** — `dialog[open] button:has-text("Upload")` matches two buttons; use `.filter({ hasText: /^Upload$/ })` for exact match.
- **Open defect ILS-1:** Help & Support `<button>` has no `onclick`/`href` — clicking it does nothing. TC_PROFILE_03 correctly fails and is tracked in JIRA project ILS.

---

## Test Credentials

| Field | Value |
|-------|-------|
| URL | https://smart-hr-fe.vercel.app |
| Username | alex.morgan@smart-hr.com |
| Password | 8A1HdsuUgrZR |
| Role | Admin |

---

## Repository

https://github.com/nuwanthiuwu/hr-profile-management-automation
