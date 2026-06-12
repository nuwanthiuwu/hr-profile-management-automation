# User Story: 07

# **Smart HR Profile Management System \- Admin**

## **Application URL:**

# [https://smart-hr-fe.vercel.app/](https://smart-hr-fe.vercel.app/)

## **Test Credentials: Admin**

* # Username: alex.morgan@smart-hr.com

* # Password: 8A1HdsuUgrZR

# **01\. MY PROFILE MENU (Header right corner)**

## **TC\_PROFILE\_01 – Open My Profile**

Scenario: Open profile page

GIVEN I am logged into the application  
WHEN I click My Profile from the profile menu  
THEN My Profile page should open successfully

## **TC\_PROFILE\_02 – Reset Password Navigation**

Scenario: Navigate to Reset Password

GIVEN I opened the profile menu  
WHEN I select Reset Password  
THEN Reset Password page should open

## **TC\_PROFILE\_03 – Help & Support**

Scenario: Open Help & Support

GIVEN I opened the profile menu  
WHEN I select Help & Support  
THEN Help page should open successfully

## **TC\_PROFILE\_04 – Sign Out**

Scenario: User logs out

GIVEN I am logged in  
WHEN I click Sign Out  
THEN my session should terminate  
AND Login page should appear

# **02\. DESIGNATION MODULE**

## **TC\_DES\_01 – Search designation**

Scenario: Search designation by name

GIVEN I am on the Designation page  
WHEN I enter a designation name  
THEN matching results should be displayed

## **TC\_DES\_02 – Filter by status**

Scenario: Filter designations by status

GIVEN Designation page is loaded  
WHEN I select Active status  
THEN only active designations should appear

WHEN I select Inactive status  
THEN only inactive designations should appear

WHEN I select All statuses  
THEN all designations should appear

## **TC\_DES\_03 – Upload CSV file**

Scenario: Bulk upload designations

GIVEN I am on Designation page  
WHEN I upload a valid CSV file  
THEN designations should be imported successfully

## **TC\_DES\_04 – Create designation**

Scenario: Add new designation

GIVEN I am on Designation page  
WHEN I enter designation details  
AND click Create  
THEN designation should be created successfully

## **TC\_DES\_05 – Pagination 10 records**

Scenario: View 10 records per page

GIVEN designation list is displayed  
WHEN I select 10 records per page  
THEN only 10 records should appear

## **TC\_DES\_06 – Pagination 20 records**

Scenario: View 20 records per page

GIVEN designation list is displayed  
WHEN I select 20 records per page  
THEN 20 records should appear

## **TC\_DES\_07 – Pagination 50 records**

Scenario: View 50 records per page

GIVEN designation list is displayed  
WHEN I select 50 records per page  
THEN 50 records should appear

## **TC\_DES\_08 – Sort Last Modified**

Scenario: Sort by Last modified

GIVEN designation list is displayed  
WHEN I sort by last modified  
THEN records should sort correctly

