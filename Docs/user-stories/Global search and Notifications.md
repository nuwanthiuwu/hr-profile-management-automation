# User Story: 08

# **Smart HR Profile Management System \- Admin**

## **Application URL:**

# [https://smart-hr-fe.vercel.app/](https://smart-hr-fe.vercel.app/)

## **Test Credentials: Admin**

* # Username: alex.morgan@smart-hr.com

* # Password: 8A1HdsuUgrZR

# **01\. GLOBAL SEARCH**

## **TC\_SEARCH\_01 – Search employee by name**

GIVEN I am logged into the application  
WHEN I search using the employee name  
THEN matching employee results should display

## **TC\_SEARCH\_02 – Search by email**

GIVEN I am logged in  
WHEN I search using employee's email  
THEN exact employee should appear

## **TC\_SEARCH\_03 – Search by employee ID**

GIVEN I am logged in  
WHEN I search using the employee ID  
THEN exact matching employee should appear

## **TC\_SEARCH\_04 – Search by designation**

GIVEN I am logged in  
WHEN I search using the designation

THEN exact matching employee should appear

## **TC\_SEARCH\_05 – Search an invalid keyword**

GIVEN I am logged in  
WHEN I enter an invalid search value  
THEN no results message should appear

# **04\. NOTIFICATIONS (Bell Icon)**

## **TC\_NOTIF\_01 – Notification count**

Scenario: Validate notification count updates

GIVEN notifications are available  
WHEN new notifications are received  
THEN notification count should update automatically

## **TC\_NOTIF\_02 – Refresh notifications**

Scenario: Refresh notifications

GIVEN I clicked notification panel (Bell icon)  
WHEN I click Refresh notifications  
THEN latest notifications should load

## **TC\_NOTIF\_03 – View notifications**

Scenario: View notification details

GIVEN notifications exist  
WHEN I open notifications  
THEN notification details should display correctly

## **TC\_NOTIF\_04 – Mark all read**

Scenario: Verify the behavior of marking all read

GIVEN notifications exist  
WHEN I click on " Mark all read”  
THEN all notifications should mark as all read