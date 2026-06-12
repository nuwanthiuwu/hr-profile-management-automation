# User Story: 06

# **Smart HR Profile Management System \- Admin**

## **Application URL:**

# [https://smart-hr-fe.vercel.app/](https://smart-hr-fe.vercel.app/)

## **Test Credentials: Admin**

* # Username: alex.morgan@smart-hr.com

* # Password: 8A1HdsuUgrZR 

# **01\. PEOPLE MODULE**

## **TC\_PEOPLE\_01 – Search by People name**

Scenario: Search for an employee using their name

GIVEN I opened the People page  
WHEN I search using the employee name  
THEN matching people should appear

## **TC\_PEOPLE\_02 – Search by Roles**

Scenario: Search for employees using roles

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

# **02\. OPPORTUNITIES MODULE**

## **TC\_OPP\_01 – Create a post**

Scenario: Create a post successfully

GIVEN Opportunities page is opened  
WHEN I click the Post opportunity button  
AND Publish the form  
THEN Post should be created successfully

## **TC\_OPP\_02 – Reopen the post**

Scenario: Reopen the post

GIVEN Opportunities page is opened  
WHEN I click on the Reopen button  
AND Post should be reopened  
THEN  the button should be changed to “Close”

## **TC\_OPP\_03 – Close the post**

Scenario: Reopen the post

GIVEN Opportunities page is opened  
WHEN I click on the close button  
AND Post should be closed  
THEN  the button should be changed to “Reopen”

