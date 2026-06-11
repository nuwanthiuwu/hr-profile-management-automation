---
description: Run the Playwright test suite, then organize all evidence (reports, screenshots, videos) into a timestamped session folder under test-results/.
---

Run the Smart HR Playwright test suite and organize all evidence into a clean, timestamped session folder.

## Arguments

`$ARGUMENTS` — Optional module name to target. Accepted values: `login`, `menu`, `dashboard`, `employees`, `all` (default).

## Steps to follow exactly

### 1. Resolve the target module

- If `$ARGUMENTS` is empty or `all` → run all specs: no path filter
- If `$ARGUMENTS` is `login`     → path: `tests/specs/login/`
- If `$ARGUMENTS` is `menu`      → path: `tests/specs/menu/`
- If `$ARGUMENTS` is `dashboard` → path: `tests/specs/dashboard/`
- If `$ARGUMENTS` is `employees` → path: `tests/specs/employees/`
- Otherwise tell the user the valid values and stop.

### 2. Capture git commit hash

```bash
git rev-parse --short HEAD 2>/dev/null || echo "no-git"
```

Store this as `GIT_HASH`.

### 3. Run the tests

Run the appropriate command. Capture the full terminal output (it will be needed for the summary).

```bash
# All modules — note the start time:
START_TIME=$(date '+%Y-%m-%d %H:%M:%S') && npx playwright test 2>&1

# Single module — substitute the correct path from Step 1:
START_TIME=$(date '+%Y-%m-%d %H:%M:%S') && npx playwright test tests/specs/login/ 2>&1
```

Note the start and end time using `date`.

### 4. Create the timestamped session folder — AFTER the test run

**Important:** create the folder ONLY after tests finish. Playwright wipes test-results/ at the start of a run, which would delete any folder created before.

```bash
SESSION="$(date '+%Y-%m-%d_%H-%M-%S')" && \
SESSION_DIR="test-results/${SESSION}" && \
mkdir -p "${SESSION_DIR}/reports" "${SESSION_DIR}/evidence" && \
echo "Session folder: ${SESSION_DIR}"
```

### 5. Move the HTML/JSON/JUnit reports into the session folder

```bash
cp -r test-results/reports/. "${SESSION_DIR}/reports/"
echo "Reports moved"
ls "${SESSION_DIR}/reports/"
```

### 6. Collect screenshots and videos from individual test folders into evidence/

```bash
SESSION_BASENAME=$(basename "${SESSION_DIR}")
find test-results -mindepth 2 \( -name "*.png" -o -name "*.webm" \) \
  -not -path "test-results/reports/*" \
  -not -path "test-results/${SESSION_BASENAME}/*" | while IFS= read -r f; do
  parent=$(basename "$(dirname "$f")")
  ext="${f##*.}"
  fname="${parent}.${ext}"
  cp "$f" "${SESSION_DIR}/evidence/${fname}"
done
echo "Evidence files collected: $(ls "${SESSION_DIR}/evidence/" | wc -l | tr -d ' ')"
```

### 7. Delete the raw per-test folders and the now-copied reports folder

```bash
SESSION_BASENAME=$(basename "${SESSION_DIR}")
find test-results -mindepth 1 -maxdepth 1 -type d ! -name "${SESSION_BASENAME}" -exec rm -rf {} +
echo "Cleanup done. test-results/ now contains:"
ls test-results/
```

### 8. Generate session-summary.md using the summary script

```bash
node scripts/generate-summary.js "${SESSION_DIR}" "<module>" "${GIT_HASH}" "<duration in seconds>"
```

Example for a login run that took 19.2 seconds:
```bash
node scripts/generate-summary.js "test-results/2026-06-11_14-30-00" "login" "03b6be7" "19.2"
```

The script writes `${SESSION_DIR}/session-summary.md` containing:
- Date/Time, Module, Git Commit, Duration
- Results summary table (Total / Passed / Failed / Skipped)
- Full test results table with ✅ / ❌ per test
- Failed Tests section (only if failures exist) with error messages
- Evidence section listing all output files

### 9. Print a final summary to the user

Tell the user:
- The session folder path (absolute)
- Total / Passed / Failed counts
- Whether any tests failed, and which ones
- Command to open the HTML report: `npx playwright show-report <SESSION_DIR>/reports`
