# User Story: 04

# **Smart HR Profile Management System \- Admin**

## **Application URL:**

# [https://smart-hr-fe.vercel.app/](https://smart-hr-fe.vercel.app/)

## **Test Credentials: Admin**

* # Username: alex.morgan@smart-hr.com

* # Password: 8A1HdsuUgrZR

# **01\. CV TEMPLATES**

## **TC\_CV\_01 – Upload template successfully**

Scenario: Upload a valid CV template

GIVEN I am on the CV Templates page  
WHEN I upload a valid template file  
THEN the file should be uploaded successfully  
AND it should appear in the template list

## **TC\_CV\_02 – Invalid file type validation**

Scenario: Upload an unsupported file type

GIVEN I am on the CV Templates page  
WHEN I upload an invalid file type  
THEN system should reject the file  
AND show validation error message

## **TC\_CV\_03 – Cancel upload**

Scenario: Cancel upload process

GIVEN I am uploading a CV template  
WHEN I click Cancel  
THEN upload modal should close  
AND no file should be saved

## **TC\_CV\_04 – View CV Template**

Scenario: View CV Template

GIVEN I am on the CV Templates page  
WHEN I click on the three dots icon on the CV Template  
AND I click on the View Details  
THEN I can see the details of the template

# **02\. MY PROFILE**

## **TC\_MP\_01 – Update profile photo**

Scenario: Change profile picture

GIVEN I am on My Profile page  
WHEN I upload a new profile photo  
THEN profile picture should be updated successfully

## **TC\_MP\_02 – Edit personal Information**

Scenario: Update personal information

GIVEN I am on My Profile page  
WHEN I edit personal information  
AND click Save Changes  
THEN updated details should be saved successfully

## **TC\_MP\_03 – Add Work & Contact**

Scenario: Add work and contact details

GIVEN I am on My Profile page  
AND I click on the work and contact tab  
WHEN I add work and contact details  
THEN work and contact should be stored successfully

## **TC\_MP\_04 – Add education and skills**

Scenario: Add education details

GIVEN I am on My Profile page  
AND I click on the education and skills tab  
WHEN I add education details  
THEN education should be saved successfully

## **TC\_MP\_05 – Add accomplishments**

Scenario: Add accomplishment details

GIVEN I am on My Profile page  
AND I click on the accomplishment tab  
WHEN I add accomplishment details  
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
