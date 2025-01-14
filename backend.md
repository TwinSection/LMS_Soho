## User Management [ADMIN]

### Service:
- [GET] **/api/admin/users**: Returns all users.
- [POST] **/api/admin/user**: Creates a new user.
- [PUT] **/api/admin/users/:id:** Updates user information.
- [DELETE] **/api/admin/users/:id:** Deletes a user.
- [GET] **/api/admin/user/:id**: Retrieves specific user details.

## User Login and Profile Management [User Only]

### Service:
- [POST] **/api/auth/profile**: Logs the user in.
- [GET] **/api/auth/getprofile**: Returns user profile information.
- [PUT] **/api/auth/profile**: Updates user profile information.
- [POST] **/api/register**: Allows users to register.

## Course Management [ADMIN and Instructor]

### Service:
- [GET] **/api/admin/courses**: Returns all courses (Admin).
- [POST] **/api/admin/courses**: Creates a new course (Admin).
- [PUT] **/api/admin/courses/:id:** Updates course details (Admin).
- [DELETE] **/api/admin/courses/:id:** Deletes a course (Admin).
- [GET] **/api/admin/courses/:id**: Retrieves course details (Admin).
- [GET] **/api/instructor/courses**: Returns all courses managed by the instructor.
- [PUT] **/api/instructor/courses/:id:** Updates course details (Instructor).

## Course Viewing and Tracking [User Only]

### Service:
- [GET] **/api/courses**: Returns courses accessible by the user.
- [GET] **/api/courses/:id:** Returns details of a specific course.
- [POST] **/api/progress**: Records the completion of a lesson by the user.
- [GET] **/api/progress/:id:** Returns the user's progress for a specific course.

## Subscription Management [ADMIN]

### Service:
- [GET] **/api/admin/subscriptionplans**: Returns all subscription plans.
- [POST] **/api/admin/subscriptionplans**: Creates a new subscription plan.
- [PUT] **/api/admin/subscriptionplans/:id:** Updates a subscription plan.
- [DELETE] **/api/admin/subscriptionplans/:id:** Deletes a subscription plan.

## Notification System [User Only]

### Service:
- [GET] **/api/notifications**: Returns notifications sent to the user.
- [PUT] **/api/notifications/:id:** Marks a notification as read.

## Notification Management [ADMIN]

### Service:
- [GET] **/api/admin/notifications**: Returns all notifications.
- [GET] **/api/admin/notifications/:id**: Retrieves specific notification details.
- [POST] **/api/admin/notifications**: Creates a new notification.
- [PUT] **/api/admin/notifications/:id:** Updates notification details.
- [DELETE] **/api/admin/notifications/:id:** Deletes a notification.

## Category Management [ADMIN]

### Service:
- [GET] **/api/admin/categories**: Returns all categories.
- [POST] **/api/admin/categories**: Creates a new category.
- [PUT] **/api/admin/categories/:id:** Updates category details.

## Lesson Management [ADMIN]

### Service:
- [POST] **/api/admin/lessons**: Creates a new lesson.
- [DELETE] **/api/admin/lessons/:id:** Deletes a lesson.

## User Types
- Admin
- Trainer (Instructor)
- User

### User Attributes:
- Username
- First Name
- Last Name
- Email
- Password
- Role (Admin/Trainer/User)

## Notifications
- Title
- Date
- Status (Read/Unread)

## Course
- Course Name
- Course Description
- Category (Dropdown)
- Trainer
- Creation Date

## Subscriptions
- Plan Name
- Price
- Duration
