# User Story: 05

# **Smart HR Profile Management System \- Admin**

## **Application URL:**

# [https://smart-hr-fe.vercel.app/](https://smart-hr-fe.vercel.app/)

## **Test Credentials: Admin**

* # Username: alex.morgan@smart-hr.com

* # Password: 8A1HdsuUgrZR

# **01\. WALL MODULE**

## **TC\_WALL\_01 – Create Post**

Scenario: Create a new post with title and category

GIVEN I am logged into the application  
AND I am on the Wall page  
WHEN I enter a post title and select a category  
AND I click Post  
THEN the post should be created successfully  
AND it should appear in the feed

## **TC\_WALL\_02 – Validate 700 character limit**

Scenario: Post content validation

GIVEN I am on Wall page  
WHEN I enter post content exceeding 700 characters  
THEN system should prevent submission  
AND show validation error message

## **TC\_WALL\_03 – Upload document**

Scenario: Attach document to post

GIVEN I am creating a post  
WHEN I upload a valid document file  
THEN the file should be attached successfully  
AND visible in post preview

## **TC\_WALL\_04 – Switch between All Posts and My Posts**

Scenario: Post filter switching

GIVEN I am on Wall page  
WHEN I switch to My Posts tab  
THEN only my posts should be displayed

WHEN I switch to All Posts tab  
THEN all posts should be displayed

## **TC\_WALL\_05 – Sort posts**

Scenario: Sort posts by recent and popular

GIVEN I am on Wall page  
WHEN I select Recent sorting  
THEN newest posts should appear first

WHEN I select Popular sorting  
THEN most reacted posts should appear first

# **02\. POST INTERACTIONS**

## **TC\_POST\_01 – React to post**

Scenario: Add a reaction to a post

GIVEN I am viewing posts on Wall  
WHEN I click a reaction icon  
THEN reaction should be added successfully  
AND the reaction count should update

## **TC\_POST\_02 – Add comment**

Scenario: Comment on a post

GIVEN I am viewing a post  
WHEN I enter a comment and submit  
THEN comment should be added successfully  
AND visible under the post

## **TC\_POST\_03 – Reply to comment**

Scenario: Reply to a comment

GIVEN a post has comments  
WHEN I reply to an existing comment  
THEN reply should be displayed under the comment

## **TC\_POST\_04 – Like comment**

Scenario: Like a comment

GIVEN a comment exists  
WHEN I click like on comment  
THEN like count should increase

## **TC\_POST\_05 – Reaction count validation**

Scenario: Verify reaction updates

GIVEN a post has reactions  
WHEN I add or remove reaction  
THEN reaction count should update correctly

## **TC\_POST\_06 – Comment count validation**

Scenario: Verify comment counter

GIVEN a post has comments  
WHEN a new comment is added  
THEN comment count should update correctly

## **TC\_POST\_07 – Edit post**

Scenario: Verify edit post

GIVEN I am viewing a post  
WHEN I click on the edit icon  
AND I edit the post  
THEN The post should update properly

## **TC\_POST\_07 – Delete post**

Scenario: Verify delete post

GIVEN I am viewing a post  
WHEN I click on the delete icon  
AND I click the Delete post button  
THEN The post should be deleted

