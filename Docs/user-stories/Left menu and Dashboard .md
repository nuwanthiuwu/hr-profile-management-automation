# User Story: 01

# **Smart HR Profile Management System \- Admin**

## **Application URL:**

# [https://smart-hr-fe.vercel.app/](https://smart-hr-fe.vercel.app/)

## **Test Credentials: Admin**

* # Username: alex.morgan@smart-hr.com

* # Password: 8A1HdsuUgrZR

# **01\. LEFT MENU NAVIGATION**

## **TC\_MENU\_01 – Dashboard navigation**

Scenario: Open Dashboard

GIVEN I am logged in  
WHEN I select the Dashboard menu  
THEN Dashboard page should open

## **TC\_MENU\_02 – Employees page**

Scenario: Navigate to Employees

GIVEN I am logged in  
WHEN I select the Employees menu  
THEN Employees page should load

## **TC\_MENU\_03 – Wall page**

Scenario: Navigate to Wall

GIVEN I am logged in  
WHEN I click the Wall menu  
THEN Wall page should open

## **TC\_MENU\_03 – People page**

Scenario: Navigate to People

GIVEN I am logged in  
WHEN I click the People menu  
THEN People page should open

## **TC\_MENU\_03 – Opportunities page**

Scenario: Navigate to opportunities

GIVEN I am logged in  
WHEN I click the Opportunities menu  
THEN Opportunities page should open

## **TC\_MENU\_04 – Designation page**

Scenario: Navigate to Designation

GIVEN I am logged in  
WHEN I click the Designation menu  
THEN Designation page should load

## **TC\_MENU\_05 – CV Templates**

Scenario: Navigate to CV Templates

GIVEN I am logged in  
WHEN I click CV Templates  
THEN Templates page should load

## **TC\_MENU\_06 – My Profile**

Scenario: Open My Profile

GIVEN I am logged in  
WHEN I click My Profile  
THEN profile page should load successfully

# **02\. DASHBOARD**

## **TC\_DASH\_01 – Total employees**

Scenario: Verify total employee count

GIVEN I am on Dashboard  
WHEN employee statistics load  
THEN total employee count should display correctly

## **TC\_DASH\_02 – Active employees**

Scenario: Verify active employee count

GIVEN Dashboard is opened  
WHEN statistics load  
THEN active employee count should match the available records

## **TC\_DASH\_03 – Inactive employees**

Scenario: Verify inactive employee count

GIVEN Dashboard is opened  
WHEN statistics load  
THEN inactive employee count should display correctly

## **TC\_DASH\_04 – Average profile completion**

Scenario: Validate profile completion

GIVEN Dashboard is loaded  
WHEN profile metrics are displayed  
THEN average profile completion percentage should appear correctly

## **TC\_DASH\_05 – Manage Designation**

Scenario: Navigate to Designation

GIVEN I am on Dashboard  
WHEN I click Manage Designation  
THEN Designation page should open

## **TC\_DASH\_06 – Create Employee**

Scenario: Open employee creation form

GIVEN I am on Dashboard  
WHEN I click Create Employee  
THEN employee creation form should appear

## **TC\_DASH\_07 – Recent employees**

Scenario: Verify the recent employees section

GIVEN Dashboard is loaded  
WHEN recent employees are displayed  
THEN employee information should appear correctly

## **TC\_DASH\_08 – Needs Attention**

Scenario: Verify needs attention list

GIVEN Dashboard is loaded  
WHEN Needs Attention section loads  
THEN relevant employee records should appear

## **TC\_DASH\_09 – View All**

Scenario: Open complete list

GIVEN Dashboard contains summary widgets  
WHEN I click View All  
THEN Employee page should open

rocess

GIVEN I am uploading a CV templateWHEN I click Cancel  
THEN upload modal should close  
AND no file should be savedWHEN I add accomplishment details  
THEN accomplishment should be saved successfully

## **TC\_MP\_05 – Add work experience**

Scenario: Add experience details

GIVEN I am on My Profile page  
AND I click on the work experience tab  
WHEN I add work experience  
THEN experience should be stored successfully

## **TC\_MP\_06 – Add documents**

Scenario: Upload CV from profile

GIVEN I am on My Profile page  
AND I click on the documents tab  
WHEN I upload a CV file  
THEN file should be uploaded successfully

## **TC\_MP\_07 – Open CV**

Scenario: View uploaded CV

GIVEN I am on My Profile page  
AND I click on the documents tab  
AND a CV is uploaded  
WHEN I click View CV  
THEN CV should open correctly

## **TC\_MP\_08 – Reset password flow**

Scenario: Reset password from profile

GIVEN I am on My Profile page  
AND I click on the Security tab  
WHEN I select Reset Password  
THEN Reset Password page should open

## **TC\_MP\_09 – Save button behaviour**

Scenario: Save profile changes

GIVEN I have edited profile details  
WHEN I click Save Changes  
THEN changes should be saved successfully

## **TC\_MP\_10 – Cancel button behaviour**

Scenario: Discard changes

GIVEN I have unsaved changes in profile  
WHEN I click Cancel  
THEN changes should be discarded  
AND original data should remain

## **TC\_MP\_11 – Logout button behaviour**

Scenario: Logout from profile menu

GIVEN I am logged in  
AND I am on My Profile page  
WHEN I click Sign out  
THEN session should end

GIVEN the People page is opened  
WHEN I enter the employees' role  
THEN exact people should display

## **TC\_PEOPLE\_03 – Search by Department**

Scenario: Search using department

GIVEN the People page is opened  
WHEN I enter the department  
THEN corresponding people should display

## **TC\_PEOPLE\_04 – People cards**

Scenario: Verify the people cards

GIVEN the People page is opened  
WHEN I see the people page  
THEN People cards should display

## **TC\_PEOPLE\_05 – Access people profile**

Scenario: Access the people profile

GIVEN the People page is opened  
WHEN I see the people page  
AND I click on a people card  
THEN the corresponding people profile should open

