# Setup Instructions

**Framework:** Playwright v1.60 + TypeScript | **App:** https://smart-hr-fe.vercel.app

---

## Prerequisites

```bash
node -v   # v18 or higher required (v23.6.1 used in development)
npm -v    # v8 or higher
git -v    # any recent version
```

---

## Phase 1 — Clone and Install

```bash
# Clone the repository
git clone https://github.com/nuwanthiuwu/hr-profile-management-automation
cd hr-profile-management-automation

# Install Node dependencies
npm install

# Install Playwright browsers (Chromium is required; others are optional)
npx playwright install chromium

# Verify
npx playwright --version   # should print Version 1.60.x
```

---

## Phase 2 — Project Layout (reference)

```
hr-profile-management-automation/
├── playwright.config.ts          ← reporters use REPORT_DIR env var
├── package.json
├── tsconfig.json
├── config/
│   └── test-data.json            ← credentials, test inputs (DO NOT commit .env)
├── tests/
│   ├── fixtures/
│   │   ├── test-image.png        ← 1×1 PNG for profile picture upload tests
│   │   └── test-cv.pdf           ← minimal PDF for CV/document upload tests
│   ├── pages/                    ← 14 Page Object files
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
│   └── specs/                    ← 14 spec files across 13 module folders
│       ├── login/login.spec.ts
│       ├── menu/menu.spec.ts
│       ├── dashboard/dashboard.spec.ts
│       ├── employees/employee.spec.ts
│       ├── employees/create-employee.spec.ts
│       ├── cv-templates/cv-template.spec.ts
│       ├── profile/profile.spec.ts
│       ├── wall/wall.spec.ts
│       ├── people/people.spec.ts
│       ├── opportunities/opportunities.spec.ts
│       ├── designations/designations.spec.ts
│       ├── profile-menu/profile-menu.spec.ts
│       ├── global-search/global-search.spec.ts
│       └── notifications/notifications.spec.ts
├── Docs/                         ← documentation (this file lives here)
├── .claude/commands/             ← Claude Code slash-command skill files
└── test-results/                 ← created at runtime, gitignored
    └── <module>/run_<timestamp>/
        ├── reports/              ← index.html, results.json, junit.xml
        ├── screenshots/          ← one PNG per test
        └── videos/               ← one WebM per test
```

---

## Phase 3 — Run the Tests

### Run everything

```bash
npm test
# or
npx playwright test
```

### Run a single module

```bash
npx playwright test tests/specs/login/
npx playwright test tests/specs/wall/
npx playwright test tests/specs/designations/
npx playwright test tests/specs/global-search/
npx playwright test tests/specs/notifications/
```

### Run with a visible browser

```bash
HEADLESS=false npx playwright test tests/specs/wall/
```

### Run a specific test by ID

```bash
npx playwright test --grep "TC_WALL_01"
```

### View the HTML report

```bash
# After any ad-hoc run:
npx playwright show-report test-results/reports

# After a /run-tests skill run (replace path with actual timestamp):
npx playwright show-report test-results/wall/run_2026-06-12_14-30-00/reports
```

---

## Phase 4 — Using the /run-tests Skill (Recommended)

The `/run-tests` skill stores results in separate timestamped folders per module so every run is preserved for comparison.

In your Claude Code session:

```
/run-tests wall
/run-tests designations
/run-tests global-search
/run-tests all
```

Each invocation creates:

```
test-results/<module>/run_YYYY-MM-DD_HH-MM-SS/
├── reports/
│   ├── index.html
│   ├── results.json
│   └── junit.xml
├── screenshots/    ← one file per test
└── videos/         ← one file per test
```

Previous runs are never deleted — they accumulate for easy comparison.

---

## Phase 5 — Adding a New Module

1. Place the user story in `Docs/user-stories/<Module>.md`
2. In Claude Code, run:

   ```
   /new-module <Module>
   ```

   This will: inspect the live app → create POM + spec → run & fix tests → commit → update docs.

   Or step-by-step:

   ```
   /inspect-page /<route>
   /automate-module Docs/user-stories/<Module>.md
   /fix-tests <module>
   /commit-module <module>
   /update-docs
   ```

---

## Phase 6 — Debugging Failures

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `locator not found` | Selector stale or wrong | Re-run `/inspect-page`, update POM |
| Timeout on assertion | React re-render lag | Replace `waitForLoadState` with `waitForTimeout(2500)` |
| Click not firing React event | Playwright synthetic click bypassed | Use `evaluate(el => el.click())` |
| `strict mode violation` (multiple elements) | Selector too broad | Add `.filter({ hasText: /^exact$/ })` |
| Duplicate ID in form | Multiple sections reuse `#title` | Use XPath to scope: `//p[text()="Section"]/following::input[@id="title"][1]` |
| Native confirm dialog blocks navigation | Unhandled browser dialog | Add `page.once('dialog', d => d.accept())` before the click |

To debug interactively:

```bash
npm run test:debug        # Playwright inspector
npm run test:ui           # Visual test runner
HEADLESS=false npx playwright test --grep "TC_XXX_01" --trace on
```

---

## Phase 7 — JIRA Defect Reporting

When tests fail after 3 attempts, create a JIRA bug via Claude Code (Atlassian MCP):

| Field | Value |
|-------|-------|
| Cloud ID | `981bbbf5-6901-4309-9dbc-795cdbcf2971` |
| Project key | `ILS` (Internal LinkedIn App) |
| Issue type | Bug |

Current open defect: **ILS-1** — TC_PROFILE_03 Help & Support navigation.

---

## NPM Script Reference

| Script | Command |
|--------|---------|
| `npm test` | `npx playwright test` |
| `npm run test:headed` | `HEADLESS=false npx playwright test` |
| `npm run test:ui` | `npx playwright test --ui` |
| `npm run test:debug` | `npx playwright test --debug` |
| `npm run test:report` | `npx playwright show-report test-results/reports` |
| `npm run codegen` | `npx playwright codegen https://smart-hr-fe.vercel.app` |

---

## Test Credentials

| Field | Value |
|-------|-------|
| Username | alex.morgan@smart-hr.com |
| Password | 8A1HdsuUgrZR |
| Role | Admin |
| App URL | https://smart-hr-fe.vercel.app |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm: command not found` | Install Node.js from nodejs.org |
| `playwright: command not found` | Run `npm install` then `npx playwright install chromium` |
| Tests timeout consistently | Increase `timeout` / `navigationTimeout` in `playwright.config.ts` |
| Git push fails | Verify PAT is a classic token (`ghp_` prefix); fine-grained PATs fail for push |
| Reports not generated | Check `REPORT_DIR` env var is set if running manually outside the skill |
| Videos missing | Confirm `video: 'on'` is set in `playwright.config.ts` `use` block |
