---
description: Sync Docs/test-data.json with config/test-data.json and rewrite Docs/DELIVERABLES_SUMMARY.md to reflect the current state of all modules, test counts, and files.
---

Keep the documentation in sync with the actual codebase: update the reference test-data file and rewrite the deliverables summary to reflect every module currently automated.

## Arguments

None. This skill always updates both doc files.

## Steps to follow exactly

### 1. Read the source of truth

Run these in parallel:

```bash
cat config/test-data.json
```

```bash
find tests/specs -name "*.spec.ts" | sort
```

```bash
grep -r "test\(" tests/specs --include="*.spec.ts" -l | xargs grep -c "^  test(" | sort
```

```bash
find tests/pages -name "*.page.ts" | sort
```

```bash
find tests/fixtures -type f | sort
```

Also read `Docs/user-stories/` to get the current list of user story files.

### 2. Count tests per module accurately

For each spec file, count the actual number of `test(` calls:

```bash
grep -c "  test(" tests/specs/login/login.spec.ts
grep -c "  test(" tests/specs/menu/menu.spec.ts
grep -c "  test(" tests/specs/dashboard/dashboard.spec.ts
grep -c "  test(" tests/specs/employees/employee.spec.ts
grep -c "  test(" tests/specs/employees/create-employee.spec.ts
```

Sum for total.

### 3. Overwrite Docs/test-data.json

Copy the full contents of `config/test-data.json` exactly into `Docs/test-data.json`. They must be identical.

### 4. Rewrite Docs/DELIVERABLES_SUMMARY.md

Write a fresh `Docs/DELIVERABLES_SUMMARY.md` that accurately reflects:
- All page object files currently in `tests/pages/`
- All spec files currently in `tests/specs/`
- All fixture files in `tests/fixtures/`
- All user story files in `Docs/user-stories/`
- Accurate test counts per module (from step 2)
- Accurate total test count
- All passing status (run a quick check or state "last verified: <today's date>")
- The available npm commands
- The available Claude Code skills (all 7: `/run-tests`, `/inspect-page`, `/automate-module`, `/fix-tests`, `/commit-module`, `/update-docs`, `/new-module`)
- Key technical notes about the project (headless mode, screenshot/video recording, XPath for duplicate IDs, etc.)

Structure the summary as:
1. File Inventory (config, pages, specs, fixtures, docs)
2. Total Test Coverage table
3. Test case listing per module
4. NPM Commands
5. Claude Code Skills
6. Key Technical Notes

### 5. Commit the doc changes

```bash
git add Docs/test-data.json Docs/DELIVERABLES_SUMMARY.md
git commit -m "$(cat <<'EOF'
docs: sync test-data and update DELIVERABLES_SUMMARY

Reflects current module count, test counts, file inventory,
and available Claude Code skills.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin main 2>&1
```

### 6. Report to the user

Tell the user:
- What changed in each file
- New total test count
- Commit hash and push status
