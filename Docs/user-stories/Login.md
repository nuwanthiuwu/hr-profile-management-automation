# User Story: 01

# **Smart HR Profile Management System \- Admin**

## **Application URL:**

# [https://smart-hr-fe.vercel.app/](https://smart-hr-fe.vercel.app/)

## **Test Credentials: Admin**

* # Username: alex.morgan@smart-hr.com

* # Password: 8A1HdsuUgrZR

# **01\. LOGIN (Admin)**

## **TC\_LOGIN\_01 – Password visibility**

Scenario: Toggle password visibility

GIVEN I entered a password  
WHEN I click the eye icon  
THEN password should become visible

WHEN I click the eye icon again  
THEN password should become hidden

## **TC\_LOGIN\_02 – Login with empty credentials**

Scenario: Error validation

GIVEN I am on the login page  
WHEN mandatory fields are empty  
AND I click Sign In  
THEN appropriate error message should be displayed

## **TC\_LOGIN\_03 – Login with valid credentials**

Scenario: Successful Admin Login

GIVEN I am on the Login page  
WHEN I enter valid admin credentials  
AND I click Sign In  
THEN I should be redirected to the Dashboard  
AND the user session should be created

## **TC\_LOGIN\_04 – Remember Me**

Scenario: Verify Remember Me functionality

GIVEN I am on the login page  
WHEN I enter valid credentials  
AND select Remember Me  
AND login successfully  
THEN session should persist after reopening the application

# **02\. FORGOT PASSWORD (LOGIN PAGE)**

## **TC\_FP\_01 – Valid email reset**

Scenario: Send reset link successfully

GIVEN I am on Forgot Password page  
WHEN I enter a valid registered email  
AND click Send Reset Link  
THEN reset email should be sent successfully  
AND confirmation message should appear

## **TC\_FP\_02 – Invalid email validation**

Scenario: Enter invalid email

GIVEN I am on Forgot Password page  
WHEN I enter an invalid email  
AND submit request  
THEN system should show validation error  
AND reset link should not be sent

## **TC\_FP\_03 – Back to login navigation**

Scenario: Navigate back to login page

GIVEN I am on Forgot Password page  
WHEN I click Back to Login  
THEN I should be redirected to Login page

