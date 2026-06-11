import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class EmployeePage extends BasePage {
  // ===== EMPLOYEES LIST PAGE =====

  readonly pageHeading: Locator = this.page.locator('h1:has-text("Employees")');
  readonly searchInput: Locator = this.page.locator('input[placeholder*="Search"]');
  // Scoped by unique option text so they don't collide with the page-size select
  readonly roleFilterSelect: Locator = this.page.locator('select:has(option:text-is("All Roles"))');
  readonly statusFilterSelect: Locator = this.page.locator('select:has(option:text-is("All Statuses"))');
  readonly pageSizeSelect: Locator = this.page.locator('#page-size-select');
  readonly createEmployeeButton: Locator = this.page.locator('main button:has-text("Create Employee")');
  readonly showingText: Locator = this.page.locator('p:has-text("Showing")');
  readonly paginationRange: Locator = this.page.locator('nav[aria-label="Pagination"] p');
  readonly tableRows: Locator = this.page.locator('tbody tr');

  // Sortable column headers — aria-sort toggles: "none" → "ascending" → "descending"
  readonly sortByName: Locator = this.page.locator('th:has-text("Name")');
  readonly sortByDesignation: Locator = this.page.locator('th:has-text("Designation")');
  readonly sortByRole: Locator = this.page.locator('th:has-text("Role")');
  readonly sortByStatus: Locator = this.page.locator('th:has-text("Status")');
  readonly sortByCompletion: Locator = this.page.locator('th:has-text("Completion")');

  // ===== CREATE EMPLOYEE DRAWER =====

  readonly drawer: Locator = this.page.locator('[role="dialog"]');
  readonly drawerTitle: Locator = this.page.locator('#drawer-title');
  readonly closePanelButton: Locator = this.page.locator('button[aria-label="Close panel"]');
  readonly cancelButton: Locator = this.page.locator('[role="dialog"] button[type="button"]:has-text("Cancel")');
  readonly submitButton: Locator = this.page.locator('[role="dialog"] button[type="submit"]');

  // Required fields
  readonly firstNameInput: Locator = this.page.locator('#first-name');
  readonly lastNameInput: Locator = this.page.locator('#last-name');
  // Scoped to dialog — login page has #email-address; form has #email
  readonly formEmailInput: Locator = this.page.locator('[role="dialog"] #email');
  readonly designationSelect: Locator = this.page.locator('#designation');

  // Optional fields
  readonly employeeIdInput: Locator = this.page.locator('#employee-id');
  readonly departmentInput: Locator = this.page.locator('#department');
  readonly dateOfJoiningInput: Locator = this.page.locator('#date-of-joining');
  readonly addressInput: Locator = this.page.locator('#address');

  // File uploads — IDs are dynamic; use accept attribute as a stable selector
  readonly profilePictureUpload: Locator = this.page.locator('input[accept*="image/png"]');
  // First pdf/doc accept input in the form is the CV upload
  readonly cvUpload: Locator = this.page.locator('[role="dialog"] input[accept*=".pdf,.doc,.docx"]').first();

  // Validation error messages (.text-red-600 that are not the required-field asterisk)
  readonly validationErrors: Locator = this.page.locator('[class*="text-red-600"]:not([aria-hidden="true"])');

  // Education section (all fields have unique IDs)
  readonly degreeTitleInput: Locator = this.page.locator('#degree-title');
  readonly institutionInput: Locator = this.page.locator('#institution');
  readonly fieldOfStudyInput: Locator = this.page.locator('#field-of-study');
  readonly yearOfCompletionInput: Locator = this.page.locator('#year-of-completion');

  // Certification section — #title and #description are duplicated across sections; use XPath to scope
  readonly certTitleInput: Locator = this.page.locator(
    'xpath=//p[normalize-space()="Certification"]/following::input[@id="title"][1]'
  );
  readonly issuingOrgInput: Locator = this.page.locator('#issuing-organization');
  readonly certDateIssuedInput: Locator = this.page.locator('#date-issued');
  readonly certificateIdInput: Locator = this.page.locator('#certificate-id');

  // Achievement section
  readonly achievementTitleInput: Locator = this.page.locator(
    'xpath=//p[normalize-space()="Achievement"]/following::input[@id="title"][1]'
  );
  readonly achievementDateInput: Locator = this.page.locator('#date');
  readonly achievementDescInput: Locator = this.page.locator(
    'xpath=//p[normalize-space()="Achievement"]/following::input[@id="description"][1]'
  );

  // Experience section
  readonly organizationInput: Locator = this.page.locator('#organization');
  readonly jobTitleInput: Locator = this.page.locator('#job-title');
  readonly startDateInput: Locator = this.page.locator('#start-date');
  readonly endDateInput: Locator = this.page.locator('#end-date');
  readonly experienceDescInput: Locator = this.page.locator(
    'xpath=//p[normalize-space()="Experience"]/following::input[@id="description"][1]'
  );

  // Success toast after creation
  readonly successToast: Locator = this.page.locator('[role="alert"]:has-text("Employee created")');

  constructor(page: Page) {
    super(page);
  }

  // ===== LIST PAGE METHODS =====

  async navigateToEmployees(): Promise<void> {
    await this.goto('/employees');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.pageHeading);
  }

  async navigateToCreateEmployee(): Promise<void> {
    await this.goto('/employees/new');
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.drawer);
  }

  async searchFor(term: string): Promise<void> {
    await this.fill(this.searchInput, term);
    await this.page.waitForTimeout(700); // debounce
  }

  async clearSearch(): Promise<void> {
    await this.fill(this.searchInput, '');
    await this.page.waitForTimeout(700);
  }

  async selectRole(role: 'all' | 'admin' | 'employee'): Promise<void> {
    await this.roleFilterSelect.selectOption(role);
    await this.page.waitForTimeout(400);
  }

  async selectStatus(status: 'all' | 'active' | 'inactive'): Promise<void> {
    await this.statusFilterSelect.selectOption(status);
    await this.page.waitForTimeout(400);
  }

  async selectPageSize(size: '10' | '20' | '50'): Promise<void> {
    await this.pageSizeSelect.selectOption(size);
    await this.page.waitForTimeout(400);
  }

  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getColumnValues(colIndex: number): Promise<string[]> {
    return await this.tableRows.evaluateAll((rows, idx) =>
      rows.map(row => row.querySelectorAll('td')[idx]?.textContent?.trim() || ''),
      colIndex
    );
  }

  async clickSortHeader(header: Locator): Promise<void> {
    await this.click(header);
    await this.page.waitForTimeout(400);
  }

  async getSortState(header: Locator): Promise<string | null> {
    return await header.getAttribute('aria-sort');
  }

  // ===== CREATE FORM METHODS =====

  async openCreateEmployeeDrawer(): Promise<void> {
    await this.click(this.createEmployeeButton);
    await this.waitForVisible(this.drawer);
  }

  async closeDrawerViaXButton(): Promise<void> {
    await this.click(this.closePanelButton);
    await this.page.waitForURL('**/employees', { timeout: 8000 });
  }

  async closeDrawerViaCancel(): Promise<void> {
    // When the form has data, a native confirm dialog appears: "You have unsaved changes. Close without saving?"
    this.page.once('dialog', dialog => dialog.accept());
    await this.click(this.cancelButton);
    await this.page.waitForURL('**/employees', { timeout: 10000 });
  }

  async fillRequiredFields(
    firstName: string,
    lastName: string,
    email: string,
    designation: string
  ): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.formEmailInput, email);
    await this.designationSelect.selectOption(designation);
  }

  async submitCreateForm(): Promise<void> {
    await this.click(this.submitButton);
    await this.page.waitForURL('**/employees', { timeout: 15000 });
  }

  async waitForSuccessToast(): Promise<string> {
    await this.waitForVisible(this.successToast, 10000);
    return (await this.getText(this.successToast)).trim();
  }

  async getValidationErrorCount(): Promise<number> {
    return await this.validationErrors.count();
  }
}
