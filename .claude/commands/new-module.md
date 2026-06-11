---
description: Full end-to-end pipeline for a new test module — create the user story file if needed, inspect the live app, build the POM, write the spec, run & fix tests, commit, and update docs.
---

Run the complete automation pipeline for a brand-new module. This skill composes `/inspect-page`, `/automate-module`, `/fix-tests`, `/commit-module`, and `/update-docs` into a single workflow.

## Arguments

`$ARGUMENTS` — The module name (e.g. `Profile`, `Designations`, `Opportunities`). Required. This is used to derive file names and paths.

## Steps to follow exactly

### 1. Validate and resolve paths

Derive all paths from `$ARGUMENTS` (convert to lowercase for file names):
- Module name (capitalised): e.g. `Profile`
- Module slug (lowercase): e.g. `profile`
- User story file: `Docs/user-stories/<Module>.md`
- POM file: `tests/pages/<slug>.page.ts`
- Spec folder: `tests/specs/<slug>/`
- Spec file: `tests/specs/<slug>/<slug>.spec.ts`

Check if the user story file exists:
```bash
ls "Docs/user-stories/$ARGUMENTS.md" 2>/dev/null || echo "NOT FOUND"
```

If NOT FOUND, tell the user the expected location and ask them to place the user story file there before continuing. Stop.

If found, read the user story file.

### 2. Check for existing automation

Check if the POM or spec already exists:
```bash
ls tests/pages/<slug>.page.ts tests/specs/<slug>/<slug>.spec.ts 2>/dev/null
```

If they already exist, warn the user and ask whether to:
- **Overwrite** — proceed and replace files
- **Skip** — stop and let the user handle it manually

### 3. Inspect the live app

Identify all URL paths mentioned or implied by the user story. For each one, run an inline headless inspection (same pattern as `/inspect-page`) to collect all selectors.

Log: "Inspecting <N> page(s): <URLs>"

### 4. Create the POM file

Write `tests/pages/<slug>.page.ts` following the project's POM conventions:
- Extends `BasePage`
- All locators as `readonly` class properties
- Navigation method: `async navigateTo<Module>()`
- Action methods for each meaningful interaction in the user story
- Selector rules: prefer `#id` > `input[placeholder*]` > `input[accept*]` > XPath for duplicate IDs

### 5. Create the spec file

Write `tests/specs/<slug>/<slug>.spec.ts` following the project's spec conventions:
- `beforeEach`: login + navigate
- One `test.describe` wrapper per TC_XXX_NN from the user story
- Test name format: `TC_XXX_01.1 - Should <verb> <outcome>`
- `console.log('✅ ...')` at the end of each passing test
- Handle native `confirm` dialogs with `page.once('dialog', d => d.accept())`

### 6. Run tests headlessly

```bash
npx playwright test tests/specs/<slug>/ 2>&1
```

### 7. Fix any failures

For each failure, follow the same diagnostic flow as `/fix-tests`:
1. Identify error type
2. Inspect the live app if it is a selector problem
3. Patch the POM or spec
4. Rerun only the failed test
5. Repeat until all pass

### 8. Commit the new module

Stage and commit using the `/commit-module` conventions:

```bash
git add tests/pages/<slug>.page.ts tests/specs/<slug>/ config/test-data.json
git commit -m "$(cat <<'EOF'
feat: add <Module> module E2E tests (TC_<MOD>_01–NN)

<One sentence summary of coverage.>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin main 2>&1
```

### 9. Update documentation

Run the `/update-docs` steps:
1. Sync `Docs/test-data.json` ← `config/test-data.json`
2. Rewrite `Docs/DELIVERABLES_SUMMARY.md` with updated file inventory and test counts
3. Commit and push the doc changes

### 10. Report completion to the user

Tell the user:
- POM and spec files created
- Total tests written and passing
- Commit hashes for the module commit and the docs commit
- Any important findings from the inspection (unusual selectors, edge cases, known limitations)
- How to run the tests: `npx playwright test tests/specs/<slug>/`
- How to view the full report: `/run-tests <slug>`
