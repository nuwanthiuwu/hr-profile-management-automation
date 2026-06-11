# User Story: 03

# **Smart HR Profile Management System \- Admin**

## **Application URL:**

# [https://smart-hr-fe.vercel.app/](https://smart-hr-fe.vercel.app/)

## **Test Credentials: Admin**

* # Username: alex.morgan@smart-hr.com

* # Password: 8A1HdsuUgrZR 

# **01\. EMPLOYEES MODULE**

## **TC\_EMP\_01 – Search by Name**

Scenario: Search for an employee using their name

GIVEN I opened the Employees page  
WHEN I search using the employee name  
THEN matching employees should appear

## **TC\_EMP\_02 – Search by Email**

Scenario: Search employee using email

GIVEN the Employees page is opened  
WHEN I enter employee's email  
THEN exact employee should display

## **TC\_EMP\_03 – Search by Employee ID**

Scenario: Search using employee ID

GIVEN the Employees page is opened  
WHEN I enter the employee ID  
THEN corresponding employee should display

## **TC\_EMP\_04 – Filter All Roles**

Scenario: View all roles

GIVEN Employees page is loaded  
WHEN I select All Roles  
THEN all employee records should display

## **TC\_EMP\_05 – Filter Admin**

Scenario: Filter Admin users

GIVEN Employees page is loaded  
WHEN I filter by Admin role  
THEN only Admin users should appear

## **TC\_EMP\_06 – Filter Employee**

Scenario: Filter Employee role

GIVEN Employees page is loaded  
WHEN I filter Employee role  
THEN only Employee users should appear

## **TC\_EMP\_07 – Filter All Statuses**

Scenario: View all statuses

GIVEN Employees page is opened  
WHEN I select All Statuses  
THEN active and inactive employees should display

## **TC\_EMP\_08 – Filter Active**

Scenario: Filter active employees

GIVEN Employees page is opened  
WHEN Active status is selected  
THEN only active employees should appear

## **TC\_EMP\_09 – Filter Inactive**

Scenario: Filter inactive employees

GIVEN Employees page is opened  
WHEN Inactive status is selected  
THEN inactive employees should display

## **TC\_EMP\_10 – Sort Name**

Scenario: Sort by employee name

GIVEN employee list is displayed  
WHEN I sort by Name  
THEN records should sort correctly

## **TC\_EMP\_11 – Sort Designation**

Scenario: Sort by designation

GIVEN employee list is loaded  
WHEN I sort by Designation  
THEN records should display accordingly

## **TC\_EMP\_12 – Sort Role**

Scenario: Sort by role

GIVEN Employees page is opened  
WHEN I sort by Role  
THEN records should display correctly

## **TC\_EMP\_13 – Sort Status**

Scenario: Sort by status

GIVEN Employees page is loaded  
WHEN status sorting is applied  
THEN records should reorder correctly

## **TC\_EMP\_14 – Sort Completion**

Scenario: Sort by completion

GIVEN employee list exists  
WHEN completion sorting is applied  
THEN results should sort correctly

## **TC\_EMP\_15 – Pagination 10**

Scenario: View 10 records

GIVEN employee list is displayed  
WHEN I select 10 records per page  
THEN only 10 records should appear

## **TC\_EMP\_16 – Pagination 20**

Scenario: View 20 records

GIVEN employee list exists  
WHEN I select 20 records per page  
THEN 20 records should display

## **TC\_EMP\_17 – Pagination 50**

Scenario: View 50 records

GIVEN employee list exists  
WHEN I select 50 records per page  
THEN 50 records should display

## **TC\_EMP\_18 – Employee data validation**

Scenario: Validate employee information

GIVEN employee records are displayed  
WHEN I review employee details  
THEN displayed data should match the stored information

# **02\. CREATE EMPLOYEE (CRITICAL MODULE)**

## **TC\_CREATE\_EMP\_01 – Open form**

Scenario: Open employee form

GIVEN I am on the Employees page  
WHEN I click Create Employee  
THEN employee creation form should appear

## **TC\_CREATE\_EMP\_02 – Close form**

Scenario: Close employee form

GIVEN employee form is opened  
WHEN I click the close icon  
THEN form should close

## **TC\_CREATE\_EMP\_03 – Validation**

Scenario: Submit an empty employee form

GIVEN employee form is opened  
WHEN I submit without the required values  
THEN validation errors should appear

## **TC\_CREATE\_EMP\_04 – Create employee**

Scenario: Create an employee successfully

GIVEN employee form is opened  
WHEN I enter valid employee details  
AND submit the form  
THEN employee should be created successfully

## **TC\_CREATE\_EMP\_05 – Upload profile picture**

Scenario: Upload employee image

GIVEN employee form is opened  
WHEN I upload a valid profile image  
THEN image should upload successfully

## **TC\_CREATE\_EMP\_06 – Upload CV**

Scenario: Upload employee CV

GIVEN employee form is opened  
WHEN I upload the CV file  
THEN file upload should succeed

## **TC\_CREATE\_EMP\_07 – Add education**

Scenario: Add education details

GIVEN employee form is opened  
WHEN I add education information  
THEN details should be saved correctly

**TC\_CREATE\_EMP\_08 – Add certification**

Scenario: Add certification

GIVEN employee form is opened  
WHEN certification details are entered  
THEN certification should save successfully

## **TC\_CREATE\_EMP\_09 – Add achievements**

Scenario: Add achievements

GIVEN employee form is opened  
WHEN achievement details are entered  
THEN achievement should save successfully

## **TC\_CREATE\_EMP\_10 – Add experience**

Scenario: Add work experience

GIVEN employee form is opened  
WHEN experience details are entered  
THEN experience should be saved correctly

## **TC\_CREATE\_EMP\_11 – Cancel form**

Scenario: Cancel employee creation

GIVEN employee form contains entered data  
WHEN I click Cancel  
THEN form should close  
AND unsaved changes should be discarded

## **TC\_CREATE\_EMP\_12 – Success confirmation**

Scenario: Verify creation confirmation

GIVEN employee is created successfully  
WHEN submission completes  
THEN success confirmation should appear

