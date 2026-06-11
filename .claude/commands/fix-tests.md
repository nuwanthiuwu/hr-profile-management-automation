---
description: Run tests for a module, identify failures, inspect the live app to find the root cause, patch selectors or assertions, and rerun until all pass.
---

Run the test suite for the given module, diagnose each failure by inspecting the live application, apply fixes, and verify all tests pass.

## Arguments

`$ARGUMENTS` — Module to fix. Accepted values: `login`, `menu`, `dashboard`, `employees`, `all`. Defaults to `all` if empty.

## Steps to follow exactly

### 1. Resolve the module path

- `login`     → `tests/specs/login/`
- `menu`      → `tests/specs/menu/`
- `dashboard` → `tests/specs/dashboard/`
- `employees` → `tests/specs/employees/`
- `all` / empty → no path filter (run all)

### 2. Run the tests and capture all output

```bash
npx playwright test <path> 2>&1
```

Read the full output. Extract every failure:
- Test name and TC ID
- Error type (TimeoutError, expect failure, selector not found, etc.)
- File path and line number of the failure
- Screenshot path if available (open and view it to understand the page state)

If all tests pass, tell the user and stop.

### 3. For each failing test — diagnose the root cause

**Pattern A — Selector/locator not found or timeout:**
1. Identify the page URL the test was on when it failed
2. Write and run a targeted headless inspection for that URL (using the same pattern as `/inspect-page`)
3. Find the actual current selector for the element
4. Compare it to the selector in the POM file

**Pattern B — Assertion value mismatch:**
1. Read what value the test expected vs what was received
2. Navigate to the page headlessly and extract the actual value from the live app
3. Determine whether the test data or the assertion needs updating

**Pattern C — Navigation / URL mismatch:**
1. Check what URL the page actually lands on
2. Update `waitForURL` patterns or navigation methods in the POM

**Pattern D — Race condition (element found but action fails):**
1. Add `waitForVisible()` before the failing action in the POM method
2. Or increase timeout on the specific locator
3. Or change `waitForLoadState('domcontentloaded')` to `waitForLoadState('networkidle')`

**Pattern E — Native confirm dialog blocks navigation:**
1. Add `page.once('dialog', d => d.accept())` immediately before the click that triggers the dialog

### 4. Apply fixes

Edit the relevant POM or spec file. Common fix locations:
- Selector change → `tests/pages/<module>.page.ts`
- Assertion value → `tests/specs/<module>/<module>.spec.ts`
- Test data value → `config/test-data.json`

### 5. Rerun only the fixed tests

```bash
npx playwright test <path> -g "TC_XXX_NN" 2>&1
```

Verify the fixed test now passes. If it still fails, repeat steps 3–5.

### 6. Run the full module suite to confirm no regressions

```bash
npx playwright test <path> 2>&1
```

All tests must pass before reporting done.

### 7. Report results to the user

Tell the user:
- How many tests were failing and are now fixed
- What the root cause was for each failure
- Which files were changed
- Suggested next step: `/commit-module <module>` or `/run-tests <module>`
