import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { EmployeePage } from '../../pages/employee.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

test.describe('Employees Module - Smart HR Admin', () => {
  let loginPage: LoginPage;
  let empPage: EmployeePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    empPage = new EmployeePage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fill(loginPage.emailInput, testData.testUsers.admin.username);
    await loginPage.fill(loginPage.passwordInput, testData.testUsers.admin.password);
    await loginPage.click(loginPage.signInButton);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await empPage.navigateToEmployees();
  });

  // ────────────────────────────────────────────────────────
  // TC_EMP_01–03  Search
  // ────────────────────────────────────────────────────────

  test.describe('TC_EMP_01 – Search by Name', () => {
    test('TC_EMP_01.1 - Should return matching employees when searching by name', async () => {
      await empPage.searchFor(testData.employees.searchByName);

      const count = await empPage.getRowCount();
      expect(count).toBeGreaterThan(0);

      const firstCell = await empPage.tableRows.first().locator('td').first().textContent();
      expect(firstCell?.toLowerCase()).toContain(testData.employees.searchByName.toLowerCase());

      console.log(`✅ Search by name "${testData.employees.searchByName}" returned ${count} result(s)`);
    });
  });

  test.describe('TC_EMP_02 – Search by Email', () => {
    test('TC_EMP_02.1 - Should return exact employee when searching by email', async () => {
      await empPage.searchFor(testData.employees.searchByEmail);

      const count = await empPage.getRowCount();
      expect(count).toBeGreaterThan(0);

      const firstCell = await empPage.tableRows.first().locator('td').first().textContent();
      expect(firstCell).toContain(testData.employees.expectedNameForEmailSearch);

      console.log(`✅ Search by email "${testData.employees.searchByEmail}" returned: ${firstCell?.trim()}`);
    });
  });

  test.describe('TC_EMP_03 – Search by Employee ID', () => {
    test('TC_EMP_03.1 - Should return matching employee when searching by employee ID', async () => {
      await empPage.searchFor(testData.employees.searchByEmployeeId);

      const count = await empPage.getRowCount();
      expect(count).toBeGreaterThan(0);

      const firstCell = await empPage.tableRows.first().locator('td').first().textContent();
      expect(firstCell).toContain(testData.employees.expectedNameForIdSearch);

      console.log(`✅ Search by employee ID returned: ${firstCell?.trim()}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_EMP_04–06  Role Filter
  // ────────────────────────────────────────────────────────

  test.describe('TC_EMP_04 – Filter All Roles', () => {
    test('TC_EMP_04.1 - Should display all employees when All Roles is selected', async () => {
      // Set admin first, then reset to all
      await empPage.selectRole('admin');
      await empPage.selectRole('all');

      const count = await empPage.getRowCount();
      expect(count).toBeGreaterThan(0);

      console.log(`✅ All Roles filter shows ${count} employee(s)`);
    });
  });

  test.describe('TC_EMP_05 – Filter Admin', () => {
    test('TC_EMP_05.1 - Should display only admin users when Admin role is selected', async () => {
      await empPage.selectRole('admin');

      const roleValues = await empPage.getColumnValues(2);
      expect(roleValues.length).toBeGreaterThan(0);
      roleValues.forEach(role => expect(role.toLowerCase()).toBe('admin'));

      console.log(`✅ Admin filter shows ${roleValues.length} admin(s)`);
    });
  });

  test.describe('TC_EMP_06 – Filter Employee', () => {
    test('TC_EMP_06.1 - Should display only employee role users when Employee is selected', async () => {
      await empPage.selectRole('employee');

      const roleValues = await empPage.getColumnValues(2);
      expect(roleValues.length).toBeGreaterThan(0);
      roleValues.forEach(role => expect(role.toLowerCase()).toBe('employee'));

      console.log(`✅ Employee filter shows ${roleValues.length} employee(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_EMP_07–09  Status Filter
  // ────────────────────────────────────────────────────────

  test.describe('TC_EMP_07 – Filter All Statuses', () => {
    test('TC_EMP_07.1 - Should display all employees when All Statuses is selected', async () => {
      await empPage.selectStatus('active');
      await empPage.selectStatus('all');

      const count = await empPage.getRowCount();
      expect(count).toBeGreaterThan(0);

      console.log(`✅ All Statuses filter shows ${count} employee(s)`);
    });
  });

  test.describe('TC_EMP_08 – Filter Active', () => {
    test('TC_EMP_08.1 - Should display only active employees when Active status is selected', async () => {
      await empPage.selectStatus('active');

      const statusValues = await empPage.getColumnValues(3);
      expect(statusValues.length).toBeGreaterThan(0);
      statusValues.forEach(s => expect(s.toLowerCase()).toBe('active'));

      console.log(`✅ Active filter shows ${statusValues.length} active employee(s)`);
    });
  });

  test.describe('TC_EMP_09 – Filter Inactive', () => {
    test('TC_EMP_09.1 - Should display only inactive employees when Inactive status is selected', async () => {
      await empPage.selectStatus('inactive');

      const count = await empPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);

      if (count > 0) {
        const statusValues = await empPage.getColumnValues(3);
        statusValues.forEach(s => expect(s.toLowerCase()).toBe('inactive'));
      }

      console.log(`✅ Inactive filter shows ${count} inactive employee(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_EMP_10–14  Sort
  // ────────────────────────────────────────────────────────

  test.describe('TC_EMP_10 – Sort by Name', () => {
    test('TC_EMP_10.1 - Should sort records when Name header is clicked', async () => {
      await empPage.clickSortHeader(empPage.sortByName);
      const sortState = await empPage.getSortState(empPage.sortByName);
      expect(['ascending', 'descending']).toContain(sortState);

      console.log(`✅ Sort by Name: aria-sort="${sortState}"`);
    });
  });

  test.describe('TC_EMP_11 – Sort by Designation', () => {
    test('TC_EMP_11.1 - Should sort records when Designation header is clicked', async () => {
      await empPage.clickSortHeader(empPage.sortByDesignation);
      const sortState = await empPage.getSortState(empPage.sortByDesignation);
      expect(['ascending', 'descending']).toContain(sortState);

      console.log(`✅ Sort by Designation: aria-sort="${sortState}"`);
    });
  });

  test.describe('TC_EMP_12 – Sort by Role', () => {
    test('TC_EMP_12.1 - Should sort records when Role header is clicked', async () => {
      await empPage.clickSortHeader(empPage.sortByRole);
      const sortState = await empPage.getSortState(empPage.sortByRole);
      expect(['ascending', 'descending']).toContain(sortState);

      console.log(`✅ Sort by Role: aria-sort="${sortState}"`);
    });
  });

  test.describe('TC_EMP_13 – Sort by Status', () => {
    test('TC_EMP_13.1 - Should sort records when Status header is clicked', async () => {
      await empPage.clickSortHeader(empPage.sortByStatus);
      const sortState = await empPage.getSortState(empPage.sortByStatus);
      expect(['ascending', 'descending']).toContain(sortState);

      console.log(`✅ Sort by Status: aria-sort="${sortState}"`);
    });
  });

  test.describe('TC_EMP_14 – Sort by Completion', () => {
    test('TC_EMP_14.1 - Should sort records when Completion header is clicked', async () => {
      await empPage.clickSortHeader(empPage.sortByCompletion);
      const sortState = await empPage.getSortState(empPage.sortByCompletion);
      expect(['ascending', 'descending']).toContain(sortState);

      console.log(`✅ Sort by Completion: aria-sort="${sortState}"`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_EMP_15–17  Pagination
  // ────────────────────────────────────────────────────────

  test.describe('TC_EMP_15 – Pagination 10', () => {
    test('TC_EMP_15.1 - Should show at most 10 records when 10 per page is selected', async () => {
      await empPage.selectPageSize('10');

      const count = await empPage.getRowCount();
      expect(count).toBeLessThanOrEqual(10);
      expect(count).toBeGreaterThan(0);

      console.log(`✅ Page size 10: showing ${count} record(s)`);
    });
  });

  test.describe('TC_EMP_16 – Pagination 20', () => {
    test('TC_EMP_16.1 - Should show at most 20 records when 20 per page is selected', async () => {
      await empPage.selectPageSize('20');

      const count = await empPage.getRowCount();
      expect(count).toBeLessThanOrEqual(20);
      expect(count).toBeGreaterThan(0);

      console.log(`✅ Page size 20: showing ${count} record(s)`);
    });
  });

  test.describe('TC_EMP_17 – Pagination 50', () => {
    test('TC_EMP_17.1 - Should show at most 50 records when 50 per page is selected', async () => {
      await empPage.selectPageSize('50');

      const count = await empPage.getRowCount();
      expect(count).toBeLessThanOrEqual(50);
      expect(count).toBeGreaterThan(0);

      console.log(`✅ Page size 50: showing ${count} record(s)`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_EMP_18  Data Validation
  // ────────────────────────────────────────────────────────

  test.describe('TC_EMP_18 – Employee Data Validation', () => {
    test('TC_EMP_18.1 - Should display valid employee data in all columns', async () => {
      const count = await empPage.getRowCount();
      expect(count).toBeGreaterThan(0);

      // Verify each row has non-empty name, valid role, valid status, and percentage completion
      for (let i = 0; i < count; i++) {
        const cells = await empPage.tableRows.nth(i).locator('td').allTextContents();
        expect(cells[0].trim().length).toBeGreaterThan(0); // name+email
        expect(cells[1].trim().length).toBeGreaterThan(0); // designation
        expect(['admin', 'employee']).toContain(cells[2].trim().toLowerCase()); // role
        expect(['active', 'inactive']).toContain(cells[3].trim().toLowerCase()); // status
        expect(cells[4].trim()).toMatch(/\d+%/); // completion percentage
      }

      console.log(`✅ Data validation passed for ${count} row(s)`);
    });
  });
});
