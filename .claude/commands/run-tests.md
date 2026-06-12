---
description: Run Playwright tests for a specific module (or all modules) and store results in a timestamped, module-wise folder under test-results/. Each run is preserved so previous results remain accessible.
---

Run Smart HR Playwright tests and store all evidence (HTML report, JSON, JUnit XML, screenshots, videos) in a dedicated timestamped folder organised by module.

## Arguments

`$ARGUMENTS` — The module to test. Accepted values:

| Value | Spec path |
|---|---|
| `login` | `tests/specs/login/` |
| `menu` | `tests/specs/menu/` |
| `dashboard` | `tests/specs/dashboard/` |
| `employees` | `tests/specs/employees/` |
| `cv-templates` | `tests/specs/cv-templates/` |
| `profile` | `tests/specs/profile/` |
| `wall` | `tests/specs/wall/` |
| `people` | `tests/specs/people/` |
| `opportunities` | `tests/specs/opportunities/` |
| `designations` | `tests/specs/designations/` |
| `profile-menu` | `tests/specs/profile-menu/` |
| `global-search` | `tests/specs/global-search/` |
| `notifications` | `tests/specs/notifications/` |
| `all` | *(no filter — runs every spec)* |

If `$ARGUMENTS` is empty, default to `all`.
If `$ARGUMENTS` is not one of the values above, tell the user the valid values and stop.

---

## Steps to follow exactly

### 1. Resolve the target

Map `$ARGUMENTS` to a spec path using the table above.
Store the module label (e.g. `wall`) as `MODULE`.
Store the spec path (e.g. `tests/specs/wall/`) as `SPEC_PATH` (empty string for `all`).

### 2. Capture the git commit hash

```bash
git rev-parse --short HEAD 2>/dev/null || echo "no-git"
```

Store as `GIT_HASH`.

### 3. Build the run folder path

```bash
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
RUN_DIR="test-results/${MODULE}/run_${TIMESTAMP}"
REPORT_DIR_PATH="${RUN_DIR}/reports"
ARTIFACTS_DIR="${RUN_DIR}/.artifacts"
SCREENSHOTS_DIR="${RUN_DIR}/screenshots"
VIDEOS_DIR="${RUN_DIR}/videos"
```

### 4. Create the folder structure

```bash
mkdir -p "${REPORT_DIR_PATH}" "${SCREENSHOTS_DIR}" "${VIDEOS_DIR}"
```

Do NOT create `.artifacts/` manually — Playwright creates it.

### 5. Run the tests

Playwright is told to:
- Write all reports directly into the timestamped `reports/` folder via `REPORT_DIR`
- Write raw artifacts (screenshots, videos per test) into `.artifacts/` via `--output`
- Leave all previously organised run folders untouched (it only clears `--output` dir)

**For a single module:**
```bash
START=$(date '+%Y-%m-%d %H:%M:%S') && \
REPORT_DIR="${REPORT_DIR_PATH}" npx playwright test "${SPEC_PATH}" \
  --output "${ARTIFACTS_DIR}" 2>&1
END=$(date '+%Y-%m-%d %H:%M:%S')
```

**For `all`:**
```bash
START=$(date '+%Y-%m-%d %H:%M:%S') && \
REPORT_DIR="${REPORT_DIR_PATH}" npx playwright test \
  --output "${ARTIFACTS_DIR}" 2>&1
END=$(date '+%Y-%m-%d %H:%M:%S')
```

Capture the full terminal output. Note the exit code (`0` = all passed, non-zero = failures).

### 6. Collect screenshots into `screenshots/`

Prefix each file with its parent test-folder name to avoid overwrites (every test produces `test-failed-1.png`).

```bash
find "${ARTIFACTS_DIR}" -name "*.png" | while IFS= read -r f; do
  parent=$(basename "$(dirname "$f")")
  cp "$f" "${SCREENSHOTS_DIR}/${parent}-$(basename "$f")"
done
echo "Screenshots collected: $(ls "${SCREENSHOTS_DIR}" 2>/dev/null | wc -l | tr -d ' ')"
```

### 7. Collect videos into `videos/`

Same prefix strategy — every test produces `video.webm`, so use the test-folder name.

```bash
find "${ARTIFACTS_DIR}" -name "*.webm" | while IFS= read -r f; do
  parent=$(basename "$(dirname "$f")")
  cp "$f" "${VIDEOS_DIR}/${parent}.webm"
done
echo "Videos collected: $(ls "${VIDEOS_DIR}" 2>/dev/null | wc -l | tr -d ' ')"
```

### 8. Remove the raw `.artifacts/` folder

```bash
rm -rf "${ARTIFACTS_DIR}"
echo "Artifacts folder removed"
```

### 9. Show the final folder structure

```bash
echo ""
echo "── ${RUN_DIR}/"
echo "   ├── reports/"
echo "   │   ├── index.html"
echo "   │   ├── results.json"
echo "   │   └── junit.xml"
echo "   ├── screenshots/  ($(ls "${SCREENSHOTS_DIR}" 2>/dev/null | wc -l | tr -d ' ') files)"
echo "   └── videos/       ($(ls "${VIDEOS_DIR}" 2>/dev/null | wc -l | tr -d ' ') files)"
```

Also list all previous runs for this module so the user can see the history:

```bash
echo ""
echo "All runs for module '${MODULE}':"
ls -1 "test-results/${MODULE}/" 2>/dev/null | sort
```

### 10. Parse and report results

Parse the Playwright terminal output to extract:
- Total tests
- Passed count
- Failed count
- Skipped count
- Duration

Then print a summary in this format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Module   : wall
  Run      : run_2026-06-12_14-30-00
  Commit   : a1b2c3d
  Started  : 2026-06-12 14:30:00
  Finished : 2026-06-12 14:32:19

  Total    : 13
  ✅ Passed : 13
  ❌ Failed : 0
  ⏭  Skipped: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Reports  : test-results/wall/run_2026-06-12_14-30-00/reports/
  View HTML: npx playwright show-report test-results/wall/run_2026-06-12_14-30-00/reports
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If any tests failed, also list them:

```
  ❌ Failed tests:
     - TC_PROFILE_03.1 - Should navigate to the Help & Support page
```

### 11. Handle failures

If any tests failed:
- Tell the user which tests failed and what errors were reported
- Ask whether to re-run only the failing tests or create JIRA bug tickets
- Do NOT automatically re-run or create tickets without user confirmation
