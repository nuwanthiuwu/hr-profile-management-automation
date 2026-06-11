# HR Profile Management — Playwright Automation Framework

**Application under test:** https://smart-hr-fe.vercel.app  
**Framework:** Playwright v1.60 + TypeScript  
**Pattern:** Page Object Model (POM)  
**Execution:** Headless Chromium, sequential  
**Total tests:** 88 across 8 modules — all passing

---

## Project Structure

```
hr-profile-management-automation/
├── playwright.config.ts          # Headless, screenshot + video on every test
├── package.json
├── tsconfig.json
├── config/
│   └── test-data.json            # Credentials, URLs, search terms, form data
├── scripts/
│   └── generate-summary.js       # Called by /run-tests to write session-summary.md
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
│   │   └── wall.page.ts
│   └── specs/                    # Test specifications
│       ├── login/
│       │   └── login.spec.ts          # TC_LOGIN_01–04, TC_FP_01–03    (12 tests)
│       ├── menu/
│       │   └── menu.spec.ts           # TC_MENU_01–06                   (8 tests)
│       ├── dashboard/
│       │   └── dashboard.spec.ts      # TC_DASH_01–09                   (9 tests)
│       ├── employees/
│       │   ├── employee.spec.ts       # TC_EMP_01–18                    (18 tests)
│       │   └── create-employee.spec.ts# TC_CREATE_EMP_01–12             (12 tests)
│       ├── cv-templates/
│       │   └── cv-template.spec.ts    # TC_CV_01–04                     (4 tests)
│       ├── profile/
│       │   └── profile.spec.ts        # TC_MP_01–11                     (12 tests)
│       └── wall/
│           └── wall.spec.ts           # TC_WALL_01–05, TC_POST_01–07    (13 tests)
├── Docs/
│   ├── README.md                 # This file
│   ├── DELIVERABLES_SUMMARY.md   # Full file inventory and test case listing
│   ├── test-data.json            # Reference copy of config/test-data.json
│   └── user-stories/             # Source user stories used for automation
│       ├── Left menu and Dashboard .md
│       ├── Employee.md
│       ├── CV templates and My profile.md
│       └── Wall.md
└── test-results/                 # Session folders created by /run-tests
    └── YYYY-MM-DD_HH-MM-SS/
        ├── reports/              # index.html, results.json, junit.xml
        ├── evidence/             # screenshots + videos per test
        └── session-summary.md    # Pass/fail table, failed test errors
```

---

## Quick Start

```bash
npm install
npx playwright install chromium
npm test
```

To view the HTML report after a run:

```bash
npx playwright show-report test-results/reports
```

---

## Test Coverage

| Module | Test IDs | Tests | Status |
|--------|----------|-------|--------|
| Login & Forgot Password | TC_LOGIN_01–04, TC_FP_01–03 | 12 | All passing |
| Left Side Menu | TC_MENU_01–06 | 8 | All passing |
| Dashboard | TC_DASH_01–09 | 9 | All passing |
| Employee List | TC_EMP_01–18 | 18 | All passing |
| Create Employee | TC_CREATE_EMP_01–12 | 12 | All passing |
| CV Templates | TC_CV_01–04 | 4 | All passing |
| My Profile | TC_MP_01–11 | 12 | All passing |
| Wall | TC_WALL_01–05, TC_POST_01–07 | 13 | All passing |
| **Total** | | **88** | **All passing** |

---

## NPM Commands

| Command | What it does |
|---------|-------------|
| `npm test` | Run all 88 tests headlessly |
| `npm run test:login` | Run login module only |
| `npm run test:headed` | Run with visible browser (`HEADLESS=false`) |
| `npm run test:ui` | Open the Playwright interactive UI |
| `npm run test:debug` | Run in debug mode with inspector |
| `npm run test:report` | Open the last HTML report |
| `npm run codegen` | Record new selectors via browser interaction |

To target a specific module:

```bash
npx playwright test tests/specs/login/
npx playwright test tests/specs/menu/
npx playwright test tests/specs/dashboard/
npx playwright test tests/specs/employees/
npx playwright test tests/specs/cv-templates/
npx playwright test tests/specs/profile/
npx playwright test tests/specs/wall/
```

To run with a visible browser:

```bash
HEADLESS=false npx playwright test
```

---

## Claude Code Skills

This project includes seven slash commands for Claude Code that automate the most repetitive parts of the development and testing workflow. Type any of these in your Claude Code session.

---

### `/run-tests [module]`

Run the test suite and organise all evidence into a clean timestamped session folder.

**Arguments:** `login` | `menu` | `dashboard` | `employees` | `cv-templates` | `profile` | `wall` | `all` (default)

**What it does:**
1. Runs the specified tests (or all 88)
2. Creates `test-results/YYYY-MM-DD_HH-MM-SS/` after the run
3. Moves HTML/JSON/JUnit reports → `reports/`
4. Collects screenshots + videos → `evidence/`
5. Deletes raw per-test folders
6. Writes `session-summary.md` with per-test pass/fail table and error details

**Usage examples:**
```
/run-tests
/run-tests login
/run-tests wall
/run-tests employees
```

---

### `/inspect-page <url-path>`

Run a headless Playwright inspection against any page in the app and get a structured map of all interactive elements with recommended Playwright selectors.

**Arguments:** URL path, e.g. `/profile`, `/wall`, `/employees/new`

**What it returns:** Headings, inputs (with IDs/placeholders/accept), selects (with option labels), buttons (text/aria-label), nav links (href), table headers (aria-sort), dialog roles.

**Usage examples:**
```
/inspect-page /wall
/inspect-page /profile
/inspect-page /employees/new
```

Use this before writing a new POM to discover all real selectors without guessing.

---

### `/automate-module <user-story-file>`

Read a user story, inspect the live app, create the POM and spec files, run tests headlessly, and fix any failures.

**Arguments:** Path to the user story markdown file

**What it does:**
1. Reads the user story and extracts all TC_XXX test cases
2. Inspects the relevant app pages for real selectors
3. Creates `tests/pages/<module>.page.ts` (POM)
4. Creates `tests/specs/<module>/<module>.spec.ts`
5. Runs tests and fixes any failures
6. Reports total tests written and passing

**Usage examples:**
```
/automate-module Docs/user-stories/Wall.md
/automate-module Docs/user-stories/Designations.md
```

---

### `/fix-tests [module]`

Run tests for a module, diagnose each failure by inspecting the live app, patch selectors or assertions, and rerun until all pass.

**Arguments:** `login` | `menu` | `dashboard` | `employees` | `cv-templates` | `profile` | `wall` | `all` (default)

**Handles these failure patterns:**
- Selector/locator not found → re-inspects the live app
- Assertion value mismatch → checks actual app behaviour
- Navigation/URL mismatch → updates `waitForURL` patterns
- Race conditions → adds `waitForVisible` or switches to `networkidle`
- React event handler issues → switches to `evaluate(el => el.click())`
- Native confirm dialog blocking navigation → adds `page.once('dialog', ...)`

**Usage examples:**
```
/fix-tests
/fix-tests wall
/fix-tests employees
```

---

### `/commit-module <module-name>`

Stage the correct files for a given module, write a properly formatted commit message, and push to GitHub.

**Arguments:** `login` | `menu` | `dashboard` | `employees` | `create-employee` | `cv-templates` | `profile` | `wall` | `docs` | `config` | `all`

**What it does:**
1. Stages only the files belonging to the module (never `git add .` blindly)
2. Writes a commit message following the project convention: `feat: add <Module> module E2E tests (<TC range>)`
3. Commits with `Co-Authored-By: Claude Sonnet 4.6` footer
4. Pushes to `origin/main`

**Usage examples:**
```
/commit-module wall
/commit-module profile
/commit-module docs
```

---

### `/update-docs`

Sync `Docs/test-data.json` with `config/test-data.json` and rewrite `Docs/DELIVERABLES_SUMMARY.md` to accurately reflect all modules, file counts, test counts, and available skills.

**Arguments:** None

**What it does:**
1. Counts tests in every spec file
2. Mirrors `config/test-data.json` → `Docs/test-data.json`
3. Rewrites `Docs/DELIVERABLES_SUMMARY.md` with current inventory
4. Commits and pushes

**Usage:**
```
/update-docs
```

Run this after finishing any new module to keep documentation current.

---

### `/new-module <module-name>`

Full end-to-end pipeline for a brand-new module — the composition of all other skills.

**Arguments:** Module name, e.g. `Designations`, `Opportunities`, `Settings`

**What it does:**
1. Checks for `Docs/user-stories/<Module>.md` (stop if missing)
2. Inspects all relevant app pages
3. Creates POM and spec files
4. Runs and fixes tests
5. Commits the module
6. Updates documentation

**Usage examples:**
```
/new-module Designations
/new-module Opportunities
```

This is the single command to run at the start of each new module.

---

## Recommended Workflow for a New Module

```
1. Place user story → Docs/user-stories/<Module>.md
2. /new-module <Module>            ← does everything automatically
   — or step-by-step:
   /inspect-page /<path>           ← discover real selectors
   /automate-module Docs/user-stories/<Module>.md
   /fix-tests <module>
   /commit-module <module>
   /update-docs
3. /run-tests <module>             ← verify + capture evidence
```

---

## Key Technical Notes

- **Headless by default.** Set `HEADLESS=false` env var to see the browser during a run.
- **Screenshots and videos** are recorded for every test (not just failures). They land in the timestamped session folder when using `/run-tests`.
- **`waitForLoadState('networkidle')`** is required on most pages in headless mode — `domcontentloaded` returns before React mounts the form inputs.
- **File upload inputs** have dynamic IDs on each page load; use the `accept` attribute as the stable selector: `input[accept*="image/png"]`, `input[accept*=".pdf,.doc,.docx"]`.
- **Duplicate IDs** in the Create Employee form (Certification, Achievement, Experience all reuse `#title` and `#description`): use XPath `//p[normalize-space()="Certification"]/following::input[@id="title"][1]` to scope to the correct section.
- **Native confirm dialogs** appear when cancelling a form with unsaved data. Handle with `page.once('dialog', d => d.accept())` immediately before the click.
- **Exact text matching**: use `p:text-is("Active")` (not `:has-text`) to avoid "Inactive" being matched by "Active".
- **Employee ID** is a MongoDB ObjectId (`6a299e9eb6f820f4a02538dc`) when no custom ID is set.
- **Git authentication**: use a classic PAT (`ghp_` prefix). Fine-grained PATs fail for `git push` even when the API shows `push: true`.
- **Wall module — Reaction buttons:** The emoji reaction buttons are blocked by a disabled `<button>0 reactions</button>` overlay. Use `evaluate(el => el.click())` to dispatch a JS-level click that bypasses the overlay.
- **Wall module — Comment submission:** The comment send button is `type="button"` outside any `<form>`. React's `onKeyPress` handler fires on Enter; use `input.press('Enter')` to submit. After pressing Enter, wait `waitForTimeout(2500)` (not `waitForLoadState`) to allow React DOM re-render.
- **Wall module — Like buttons:** Both post reaction buttons and comment Like buttons require `evaluate(el => el.click())` — Playwright's synthetic pointer/mouse events do not trigger their React `onClick` handlers.
- **Wall module — Edit dialog:** The edit dialog uses a native `<dialog>` element (`dialog[open]`). The same `#title` and `#category` IDs exist on both the post form and the edit dialog; scope with `dialog[open] #title` to avoid ambiguity.
- **Wall module — Post creation:** Both `#title` and `#description` are required. Submitting without a description silently fails (no network request is sent).

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
