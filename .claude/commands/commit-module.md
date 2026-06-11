---
description: Stage the correct files for a given module, write a properly formatted commit message, and push to GitHub.
---

Stage and commit the files for the given module following the project's commit conventions, then push to origin/main.

## Arguments

`$ARGUMENTS` — Module name to commit. Accepted values: `login`, `menu`, `dashboard`, `employees`, `create-employee`, `docs`, `config`, `all`. Required.

## File map per module

| Module | Files to stage |
|--------|---------------|
| `login` | `tests/pages/login.page.ts` `tests/specs/login/login.spec.ts` |
| `menu` | `tests/pages/navigation.page.ts` `tests/specs/menu/menu.spec.ts` |
| `dashboard` | `tests/pages/dashboard.page.ts` `tests/specs/dashboard/dashboard.spec.ts` |
| `employees` | `tests/pages/employee.page.ts` `tests/specs/employees/employee.spec.ts` `config/test-data.json` `tests/fixtures/` |
| `create-employee` | `tests/specs/employees/create-employee.spec.ts` |
| `docs` | `Docs/DELIVERABLES_SUMMARY.md` `Docs/test-data.json` `Docs/README.md` |
| `config` | `config/test-data.json` |
| `all` | Stage everything: `git add -A` (review with `git status` first) |

For a brand-new module not in this list: stage `tests/pages/<module>.page.ts` and `tests/specs/<module>/`.

## Steps to follow exactly

### 1. Check git status

```bash
git status
```

Review which files are modified or untracked. Confirm they match the expected files for the module.

### 2. Stage the files

Stage only the files listed in the map above for `$ARGUMENTS`. Do NOT use `git add .` unless `$ARGUMENTS` is `all` and you have reviewed every file first.

```bash
git add <file1> <file2> ...
```

### 3. Confirm what is staged

```bash
git diff --staged --stat
```

Tell the user what is about to be committed.

### 4. Write the commit message

Use this format exactly:

```
feat: add <Module> module E2E tests (<TC range>)

<One sentence describing what the tests cover — search, filters,
form validation, creation flow, etc.>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Examples:
- `feat: add Login module E2E tests (TC_LOGIN_01-04, TC_FP_01-03)`
- `feat: add Employee list module E2E tests (TC_EMP_01-18)`
- `feat: add Create Employee module E2E tests (TC_CREATE_EMP_01-12)`
- `docs: update DELIVERABLES_SUMMARY and test-data for all modules`

For a fix commit use: `fix: heal <Module> tests after selector/behavior change`

### 5. Commit

```bash
git commit -m "$(cat <<'EOF'
<commit message here>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### 6. Push

```bash
git push origin main 2>&1
```

### 7. Report to the user

Tell the user:
- The commit hash (from `git rev-parse --short HEAD`)
- Files committed
- Push status
- Suggested next step: `/update-docs` if this was the last module, or `/run-tests` to verify
