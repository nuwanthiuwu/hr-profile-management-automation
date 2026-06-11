import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../../pages/login.page';
import { EmployeePage } from '../../pages/employee.page';
import testData from '../../../config/test-data.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, '../../fixtures');

/** Unique email for each test run to avoid duplicates */
function uniqueEmail(): string {
  return `test.auto.${Date.now()}@automation.test`;
}

test.describe('Create Employee Module - Smart HR Admin', () => {
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
    await empPage.navigateToCreateEmployee();
  });

  // ────────────────────────────────────────────────────────
  // TC_CREATE_EMP_01–02  Open / Close
  // ────────────────────────────────────────────────────────

  test.describe('TC_CREATE_EMP_01 – Open Form', () => {
    test('TC_CREATE_EMP_01.1 - Should open employee creation form when Create Employee is clicked', async () => {
      await empPage.assertVisible(empPage.drawer);
      await empPage.assertVisible(empPage.drawerTitle);

      const title = await empPage.getText(empPage.drawerTitle);
      expect(title.trim()).toBe('Create Employee');

      console.log('✅ Create Employee drawer is open');
    });
  });

  test.describe('TC_CREATE_EMP_02 – Close Form', () => {
    test('TC_CREATE_EMP_02.1 - Should close form when the X button is clicked', async ({ page }) => {
      await empPage.assertVisible(empPage.drawer);
      await empPage.closeDrawerViaXButton();

      expect(page.url()).toContain('/employees');
      await empPage.assertHidden(empPage.drawer);

      console.log('✅ Drawer closed via X button');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_CREATE_EMP_03  Validation
  // ────────────────────────────────────────────────────────

  test.describe('TC_CREATE_EMP_03 – Validation', () => {
    test('TC_CREATE_EMP_03.1 - Should show validation errors when form is submitted empty', async () => {
      await empPage.click(empPage.submitButton);
      await empPage.page.waitForTimeout(500);

      const errorCount = await empPage.getValidationErrorCount();
      expect(errorCount).toBeGreaterThan(0);

      // Required: first name, last name, email, designation
      await empPage.assertVisible(
        empPage.page.locator('[class*="text-red-600"]:has-text("First name is required")')
      );
      await empPage.assertVisible(
        empPage.page.locator('[class*="text-red-600"]:has-text("Last name is required")')
      );
      await empPage.assertVisible(
        empPage.page.locator('[class*="text-red-600"]:has-text("Email is required")')
      );

      console.log(`✅ Validation triggered: ${errorCount} error(s) shown`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_CREATE_EMP_04  Create Employee
  // ────────────────────────────────────────────────────────

  test.describe('TC_CREATE_EMP_04 – Create Employee', () => {
    test('TC_CREATE_EMP_04.1 - Should create employee successfully with valid details', async ({ page }) => {
      const email = uniqueEmail();
      await empPage.fillRequiredFields(
        testData.createEmployee.firstName,
        testData.createEmployee.lastName,
        email,
        testData.createEmployee.designation
      );
      await empPage.submitCreateForm();

      expect(page.url()).toContain('/employees');
      console.log(`✅ Employee created successfully. Redirected to: ${page.url()}`);
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_CREATE_EMP_05–06  File Uploads
  // ────────────────────────────────────────────────────────

  test.describe('TC_CREATE_EMP_05 – Upload Profile Picture', () => {
    test('TC_CREATE_EMP_05.1 - Should accept a valid profile image upload', async () => {
      const imagePath = path.join(fixturesDir, 'test-image.png');
      await empPage.profilePictureUpload.setInputFiles(imagePath);
      await empPage.page.waitForTimeout(500);

      // After upload the label area should show the filename or a preview
      const uploadLabel = empPage.page.locator('label[for]:has-text("Upload file"), label:has-text("test-image")');
      const visible = await uploadLabel.first().isVisible();
      expect(visible).toBe(true);

      console.log('✅ Profile picture upload accepted');
    });
  });

  test.describe('TC_CREATE_EMP_06 – Upload CV', () => {
    test('TC_CREATE_EMP_06.1 - Should accept a CV file upload', async ({ page }) => {
      const cvPath = path.join(fixturesDir, 'test-cv.pdf');
      await empPage.cvUpload.setInputFiles(cvPath);
      await empPage.page.waitForTimeout(500);

      // React processes the file and shows the filename in the page after upload
      const bodyHasFilename = await page.evaluate(() =>
        document.body.textContent?.includes('test-cv') ?? false
      );
      expect(bodyHasFilename).toBe(true);

      console.log('✅ CV file upload accepted — filename visible in DOM');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_CREATE_EMP_07–10  Section Data Entry
  // ────────────────────────────────────────────────────────

  test.describe('TC_CREATE_EMP_07 – Add Education', () => {
    test('TC_CREATE_EMP_07.1 - Should accept education details in the Education section', async () => {
      await empPage.fill(empPage.degreeTitleInput, testData.createEmployee.educationDegree);
      await empPage.fill(empPage.institutionInput, testData.createEmployee.educationInstitution);
      await empPage.fill(empPage.fieldOfStudyInput, testData.createEmployee.educationField);
      await empPage.fill(empPage.yearOfCompletionInput, testData.createEmployee.educationYear);

      await expect(empPage.degreeTitleInput).toHaveValue(testData.createEmployee.educationDegree);
      await expect(empPage.institutionInput).toHaveValue(testData.createEmployee.educationInstitution);
      await expect(empPage.fieldOfStudyInput).toHaveValue(testData.createEmployee.educationField);
      await expect(empPage.yearOfCompletionInput).toHaveValue(testData.createEmployee.educationYear);

      console.log('✅ Education details entered successfully');
    });
  });

  test.describe('TC_CREATE_EMP_08 – Add Certification', () => {
    test('TC_CREATE_EMP_08.1 - Should accept certification details in the Certification section', async () => {
      await empPage.fill(empPage.certTitleInput, testData.createEmployee.certTitle);
      await empPage.fill(empPage.issuingOrgInput, testData.createEmployee.certOrganization);
      await empPage.fill(empPage.certDateIssuedInput, '2024-01-15');
      await empPage.fill(empPage.certificateIdInput, testData.createEmployee.certId);

      await expect(empPage.certTitleInput).toHaveValue(testData.createEmployee.certTitle);
      await expect(empPage.issuingOrgInput).toHaveValue(testData.createEmployee.certOrganization);
      await expect(empPage.certificateIdInput).toHaveValue(testData.createEmployee.certId);

      console.log('✅ Certification details entered successfully');
    });
  });

  test.describe('TC_CREATE_EMP_09 – Add Achievement', () => {
    test('TC_CREATE_EMP_09.1 - Should accept achievement details in the Achievement section', async () => {
      await empPage.fill(empPage.achievementTitleInput, testData.createEmployee.achievementTitle);
      await empPage.fill(empPage.achievementDateInput, '2024-06-01');
      await empPage.fill(empPage.achievementDescInput, 'Awarded for outstanding performance.');

      await expect(empPage.achievementTitleInput).toHaveValue(testData.createEmployee.achievementTitle);
      await expect(empPage.achievementDateInput).toHaveValue('2024-06-01');
      await expect(empPage.achievementDescInput).toHaveValue('Awarded for outstanding performance.');

      console.log('✅ Achievement details entered successfully');
    });
  });

  test.describe('TC_CREATE_EMP_10 – Add Experience', () => {
    test('TC_CREATE_EMP_10.1 - Should accept work experience details in the Experience section', async () => {
      await empPage.fill(empPage.organizationInput, testData.createEmployee.experienceOrganization);
      await empPage.fill(empPage.jobTitleInput, testData.createEmployee.experienceJobTitle);
      await empPage.fill(empPage.startDateInput, '2022-01-01');
      await empPage.fill(empPage.endDateInput, '2024-12-31');
      await empPage.fill(empPage.experienceDescInput, 'Developed software solutions.');

      await expect(empPage.organizationInput).toHaveValue(testData.createEmployee.experienceOrganization);
      await expect(empPage.jobTitleInput).toHaveValue(testData.createEmployee.experienceJobTitle);
      await expect(empPage.startDateInput).toHaveValue('2022-01-01');

      console.log('✅ Work experience details entered successfully');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_CREATE_EMP_11  Cancel
  // ────────────────────────────────────────────────────────

  test.describe('TC_CREATE_EMP_11 – Cancel Form', () => {
    test('TC_CREATE_EMP_11.1 - Should close form and discard data when Cancel is clicked', async ({ page }) => {
      // Enter some data first
      await empPage.fill(empPage.firstNameInput, 'Should');
      await empPage.fill(empPage.lastNameInput, 'BeDiscarded');

      await empPage.closeDrawerViaCancel();

      expect(page.url()).toContain('/employees');
      await empPage.assertHidden(empPage.drawer);

      console.log('✅ Form cancelled; unsaved data discarded');
    });
  });

  // ────────────────────────────────────────────────────────
  // TC_CREATE_EMP_12  Success Confirmation
  // ────────────────────────────────────────────────────────

  test.describe('TC_CREATE_EMP_12 – Success Confirmation', () => {
    test('TC_CREATE_EMP_12.1 - Should show success confirmation after employee is created', async ({ page }) => {
      const email = uniqueEmail();
      await empPage.fillRequiredFields(
        testData.createEmployee.firstName,
        testData.createEmployee.lastName,
        email,
        testData.createEmployee.designation
      );

      await empPage.click(empPage.submitButton);

      // Verify redirect to employees list
      await page.waitForURL('**/employees', { timeout: 15000 });

      // Verify success toast appears
      const toastText = await empPage.waitForSuccessToast();
      expect(toastText).toContain('Employee created');

      console.log(`✅ Success confirmation shown: "${toastText}"`);
    });
  });
});
