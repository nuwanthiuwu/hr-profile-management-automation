---
description: Run a headless Playwright inspection script against a given app page and return all interactive elements with their stable selectors.
---

Inspect the Smart HR application page at the given URL path and return a structured map of all interactive elements suitable for writing Playwright selectors.

## Arguments

`$ARGUMENTS` — The URL path to inspect (e.g. `/employees/new`, `/dashboard`, `/login`). Required.

## Steps to follow exactly

### 1. Validate the argument

If `$ARGUMENTS` is empty, tell the user to provide a URL path (e.g. `/dashboard`) and stop.

The full URL will be `https://smart-hr-fe.vercel.app$ARGUMENTS`.

### 2. Write and run a headless inspection script

Create a temporary file `scripts/_inspect_tmp.mjs` with the content below, substituting the actual path for `TARGET_PATH`:

```javascript
import { chromium } from '@playwright/test';

const BASE = 'https://smart-hr-fe.vercel.app';
const TARGET_PATH = '$ARGUMENTS';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Log in first (required to access protected pages)
await page.goto(`${BASE}/login`);
await page.fill('#email-address', 'alex.morgan@smart-hr.com');
await page.fill('#password', '8A1HdsuUgrZR');
await page.click('button[type="submit"]');
await page.waitForURL('**/dashboard', { timeout: 15000 });

// Navigate to target
await page.goto(`${BASE}${TARGET_PATH}`);
await page.waitForLoadState('networkidle');

const elements = await page.evaluate(() => {
  const result = {};

  // Headings
  result.headings = Array.from(document.querySelectorAll('h1,h2,h3')).map(el => ({
    tag: el.tagName.toLowerCase(),
    text: el.textContent?.trim().substring(0, 80),
    id: el.id || null,
  }));

  // Inputs
  result.inputs = Array.from(document.querySelectorAll('input')).map(el => ({
    type: el.type,
    id: el.id || null,
    name: el.getAttribute('name') || null,
    placeholder: el.placeholder || null,
    accept: el.getAttribute('accept') || null,
    ariaLabel: el.getAttribute('aria-label') || null,
    value: el.value || null,
  }));

  // Selects
  result.selects = Array.from(document.querySelectorAll('select')).map(el => ({
    id: el.id || null,
    name: el.getAttribute('name') || null,
    ariaLabel: el.getAttribute('aria-label') || null,
    options: Array.from(el.options).map(o => o.text.trim()).filter(Boolean),
  }));

  // Textareas
  result.textareas = Array.from(document.querySelectorAll('textarea')).map(el => ({
    id: el.id || null,
    placeholder: el.placeholder || null,
    ariaLabel: el.getAttribute('aria-label') || null,
  }));

  // Buttons
  result.buttons = Array.from(document.querySelectorAll('button')).map(el => ({
    type: el.getAttribute('type') || null,
    text: el.textContent?.trim().substring(0, 60),
    ariaLabel: el.getAttribute('aria-label') || null,
    disabled: el.disabled,
  })).filter(b => b.text || b.ariaLabel);

  // Links (nav items)
  result.navLinks = Array.from(document.querySelectorAll('a[href]')).map(el => ({
    href: el.getAttribute('href'),
    text: el.textContent?.trim().substring(0, 60),
    ariaLabel: el.getAttribute('aria-label') || null,
  })).filter(l => l.text || l.ariaLabel);

  // Tables
  result.tables = Array.from(document.querySelectorAll('table')).map(table => ({
    headers: Array.from(table.querySelectorAll('th')).map(th => ({
      text: th.textContent?.trim(),
      ariaSort: th.getAttribute('aria-sort') || null,
    })),
    rowCount: table.querySelectorAll('tbody tr').length,
  }));

  // Roles (dialogs, alerts, etc.)
  result.roles = ['dialog','alertdialog','alert','status','navigation','main'].map(role => {
    const el = document.querySelector(`[role="${role}"]`);
    return el ? { role, text: el.textContent?.trim().substring(0, 80) } : null;
  }).filter(Boolean);

  return result;
});

console.log(JSON.stringify(elements, null, 2));
await browser.close();
```

Run it:

```bash
node scripts/_inspect_tmp.mjs 2>&1
```

### 3. Clean up the temporary file

```bash
rm -f scripts/_inspect_tmp.mjs
```

### 4. Present results to the user

Format the output as a structured summary grouped by element type. For each element, suggest the most stable Playwright selector to use:

- Prefer `#id` for elements with unique IDs
- Prefer `input[placeholder*="..."]` when no ID
- Prefer `input[accept*="..."]` for file inputs
- Prefer `select:has(option:text-is("..."))` for selects scoped by unique option
- Prefer `button:has-text("...")` or `button[aria-label="..."]` for buttons
- Prefer `a[href="/path"]` for nav links
- Prefer `th:has-text("...")` for sortable table headers
- Use XPath `//p[normalize-space()="Section"]/following::input[@id="title"][1]` when the same ID appears multiple times
