# End-to-End QA Automation Workflow
## HR Profile Management System — Smart HR Admin

---

## Overview

This document describes the **complete autonomous QA workflow** for adding, running, and maintaining automated test modules.

| Item | Value |
|------|-------|
| Environment | macOS, local development |
| Tools | VS Code + Playwright + Claude Code |
| Framework | Page Object Model (POM) with TypeScript |
| Browser | Chromium (headless by default) |
| Execution | Sequential (workers: 1) |
| App URL | https://smart-hr-fe.vercel.app |
| Credentials | alex.morgan@smart-hr.com / 8A1HdsuUgrZR |
| Total tests | 117 across 13 modules |
| Repository | https://github.com/nuwanthiuwu/hr-profile-management-automation |

---

## STEP 1 — Clone and Install

```bash
git clone https://github.com/nuwanthiuwu/hr-profile-management-automation
cd hr-profile-management-automation
npm install
npx playwright install chromium
npx playwright --version   # confirm v1.60.x
```

---

## STEP 2 — Understand the Codebase Structure

```
tests/pages/          ← 14 POM files (one per module)
tests/specs/          ← 14 spec files in 13 module folders
config/test-data.json ← all test inputs (credentials, search terms, form data)
playwright.config.ts  ← reporters use REPORT_DIR env var for module-wise output
.claude/commands/     ← 7 Claude Code skill files
Docs/user-stories/    ← 7 user story markdown files (source of truth for test cases)
test-results/         ← gitignored; created at runtime per module and per run
```

All modules currently automated:

| # | Module | Spec file | Tests |
|---|--------|-----------|-------|
| 1 | Login & Forgot Password | login.spec.ts | 12 |
| 2 | Left Side Menu | menu.spec.ts | 8 |
| 3 | Dashboard | dashboard.spec.ts | 9 |
| 4 | Employee List | employee.spec.ts | 18 |
| 5 | Create Employee | create-employee.spec.ts | 12 |
| 6 | CV Templates | cv-template.spec.ts | 4 |
| 7 | My Profile | profile.spec.ts | 12 |
| 8 | Wall & Posts | wall.spec.ts | 13 |
| 9 | People / Directory | people.spec.ts | 5 |
| 10 | Opportunities | opportunities.spec.ts | 3 |
| 11 | Designations | designations.spec.ts | 8 |
| 12 | Profile Menu (Header) | profile-menu.spec.ts | 4 |
| 13 | Global Search | global-search.spec.ts | 5 |
| 14 | Notifications | notifications.spec.ts | 4 |
| | **Total** | | **117** |

---

## STEP 3 — Running Tests

### Quick run (ad-hoc, no result archiving)

```bash
# All modules
npm test

# Single module
npx playwright test tests/specs/wall/
npx playwright test tests/specs/global-search/

# Single test case
npx playwright test --grep "TC_WALL_01"

# With visible browser
HEADLESS=false npx playwright test tests/specs/designations/
```

### Skill-based run (recommended — archives results)

In Claude Code:

```
/run-tests wall
/run-tests notifications
/run-tests all
```

Each skill run creates a dedicated folder that is **never overwritten**:

```
test-results/
└── wall/
    ├── run_2026-06-10_09-00-00/    ← preserved forever
    │   ├── reports/index.html
    │   ├── reports/results.json
    │   ├── reports/junit.xml
    │   ├── screenshots/
    │   └── videos/
    └── run_2026-06-12_14-30-00/    ← new run alongside old one
        └── ...
```

View a specific run's HTML report:

```bash
npx playwright show-report test-results/wall/run_2026-06-12_14-30-00/reports
```

---

## STEP 4 — Adding a New Test Module

### Full pipeline (one command)

```
/new-module <ModuleName>
```

This executes all steps below automatically.

### Step-by-step (manual)

**4.1 — Place the user story**

```
Docs/user-stories/<Module>.md
```

Follow the existing format: module heading, TC_XXX_NN test ID, GIVEN/WHEN/THEN acceptance criteria.

**4.2 — Inspect the live app for selectors**

```
/inspect-page /<route>
```

Returns all inputs (id/placeholder/accept), buttons (text/aria-label), selects, table headers with `aria-sort`, dialog roles. Use these exact selectors in the POM.

**4.3 — Create the Page Object Model**

```
tests/pages/<module>.page.ts
```

Extend `BasePage`. Declare all locators as `readonly Locator` properties. Add helper methods (`navigate`, `search`, `openForm`, `getCount`, etc.).

**4.4 — Write the spec file**

```
tests/specs/<module>/<module>.spec.ts
```

- One `test.describe` per TC_XXX group
- One `test(` per sub-case (TC_XXX_01.1, etc.)
- `test.beforeEach` logs in and navigates
- Assertions use `expect(locator).toBeVisible({ timeout: 10000 })` for async content

**4.5 — Update test data**

Add the module's test inputs to `config/test-data.json` under a new key.

**4.6 — Run and fix**

```
/run-tests <module>
```

If tests fail, re-run up to 2 more times. If still failing after 3 rounds, create a JIRA bug ticket (project ILS, cloud ID `981bbbf5-6901-4309-9dbc-795cdbcf2971`).

**4.7 — Commit**

```
/commit-module <module>
```

Stages only the module files. Writes a `feat: add <Module> module E2E tests (TC_XX_01–NN)` commit message and pushes.

**4.8 — Update documentation**

```
/update-docs
```

Syncs `Docs/test-data.json` and rewrites `Docs/DELIVERABLES_SUMMARY.md` with the new module counts.

**4.9 — Update the skill's module list**

Open `.claude/commands/run-tests.md` and add the new module to the argument table and the step-1 mapping.

---

## STEP 5 — Diagnosing and Fixing Failures

### Retry protocol

1. Run the failing test(s) — round 1
2. If failure: analyse error and fix selector/assertion
3. Re-run — round 2
4. If still failing: one more attempt — round 3
5. If still failing after round 3: create JIRA bug ticket (ILS project)

**Rule: only create JIRA tickets for tests that are STILL failing after all 3 rounds.**

### Common failure patterns and fixes

| Failure | Root cause | Fix |
|---------|-----------|-----|
| `locator not found` | Selector stale | Re-run `/inspect-page`, update POM locator |
| Assertion timeout | React re-render lag | `waitForTimeout(2500)` instead of `waitForLoadState` |
| `strict mode violation` (2 elements) | Selector too broad | `.filter({ hasText: /^exact$/ })` for exact match |
| Click doesn't trigger React handler | Synthetic events blocked | `evaluate(el => (el as HTMLElement).click())` |
| Duplicate `#id` in form | Multiple sections reuse same ID | XPath: `//p[text()="Section"]/following::input[@id="title"][1]` |
| Native confirm dialog blocks test | `page.on('dialog')` not set | `page.once('dialog', d => d.accept())` before the triggering click |
| `waitForURL` times out after navigation | URL pattern too strict | Use `**/route` glob instead of exact string |

### Interactive debugging

```bash
# Step through with Playwright Inspector
npm run test:debug

# Visual test runner
npm run test:ui

# Trace a specific test
npx playwright test --grep "TC_XXX" --trace on
# Then view:
npx playwright show-trace test-results/.current/<test-folder>/trace.zip
```

---

## STEP 6 — JIRA Defect Reporting

When a test is confirmed failing (not a flaky selector, but a real app defect):

```
JIRA project:  ILS (Internal LinkedIn App)
Cloud ID:      981bbbf5-6901-4309-9dbc-795cdbcf2971
Issue type:    Bug
```

Required fields per ticket:

| Field | Content |
|-------|---------|
| Summary | `TC_XXX_NN — <short description of broken behaviour>` |
| Severity | Critical / High / Medium / Low |
| Steps to Reproduce | Numbered list from login to failure |
| Expected | What should happen |
| Actual | What happens instead |
| Evidence | Test ID, run folder path, screenshot/video filenames |
| Environment | App URL, browser, OS, test run date |

Current open defects:

| ID | Test | Description |
|----|------|-------------|
| ILS-1 | TC_PROFILE_03 | Help & Support menu item has no navigation handler — stays on /dashboard |

---

## STEP 7 — Git and CI

### Commit convention

```
feat: add <Module> module E2E tests (TC_XX_01–NN)
fix: <what was fixed>
docs: sync test-data and update DELIVERABLES_SUMMARY
test: fix TC_XXX assertion to detect <issue>
```

### Push

```bash
git push origin main
```

Always use a classic PAT (`ghp_` prefix). Fine-grained PATs fail for `git push` even when the API shows push: true.

### CI/CD (future)

Recommended GitHub Actions trigger: `on: [push, pull_request]`

```yaml
- run: npm install
- run: npx playwright install chromium
- run: npm test
- uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: test-results/reports/
```

---

## STEP 8 — Maintenance

### After any UI change in the app

1. Re-run the affected module: `/run-tests <module>`
2. If selectors broke: `/inspect-page /<route>` → update the POM
3. Re-run and commit

### Weekly checks

- [ ] Run full suite: `/run-tests all`
- [ ] Review open JIRA tickets — close any fixed by the dev team
- [ ] Update test-data if new employees/designations changed expected counts
- [ ] Run `/update-docs` to keep the summary current

### Selector stability rules (priority order)

1. `aria-label` — most stable for buttons and icons
2. `input[type="..."]` or `input[placeholder*="..."]` — stable for form inputs
3. `:has-text("exact text")` with `.filter({ hasText: /^exact$/ })` — stable for buttons
4. `[role="..."]` — stable for semantic elements
5. CSS class substrings (`.w-full`, `.rounded-lg`) — use only as last resort
6. XPath — only when duplicate IDs force it (Create Employee form sections)

---

## Available Claude Code Skills

| Skill | Purpose |
|-------|---------|
| `/run-tests [module]` | Run tests + store evidence in timestamped module folder |
| `/inspect-page <path>` | Headless DOM inspection → stable selectors |
| `/automate-module <story>` | Read user story → create POM + spec → run & fix |
| `/fix-tests [module]` | Diagnose failures → patch → rerun until green |
| `/commit-module <module>` | Stage correct files → commit → push |
| `/update-docs` | Sync test-data.json + rewrite DELIVERABLES_SUMMARY |
| `/new-module <module>` | Full pipeline: inspect + automate + fix + commit + docs |

---

**Last updated:** 2026-06-12
**Total automated tests:** 117 (116 passing, 1 open defect ILS-1)
