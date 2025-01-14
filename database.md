# Database Schema Documentation

## Category Schema

- **Name**: `Category`
- **Description**: Stores information about course categories.

| Field Name   | Type       | Description |
|--------------|------------|-------------|
| `CategoryName` | `String`   | The name of the category. |

---

## Course Schema

- **Name**: `Course`
- **Description**: Stores details of courses available in the system.

| Field Name     | Type         | Description                                   |
|----------------|--------------|-----------------------------------------------|
| `Title`        | `String`     | Title of the course.                         |
| `Description`  | `String`     | Brief description of the course.             |
| `Category`     | `ObjectId`   | Reference to the `Category` schema.          |
| `CreatedAt`    | `Date`       | Creation date of the course. Default is now. |
| `Instructor`   | `ObjectId`   | Reference to the `User` schema.              |
| `EnrolledUsers`| `ObjectId[]` | Array of references to `User` schema.        |
| `LessonList`   | `ObjectId[]` | Array of references to `Lesson` schema.      |

---

## Lesson Schema

- **Name**: `Lesson`
- **Description**: Represents individual lessons within a course.

| Field Name     | Type         | Description                                |
|----------------|--------------|--------------------------------------------|
| `Title`        | `String`     | Title of the lesson.                      |
| `Description`  | `String`     | Description of the lesson content.        |
| `Content`      | `String`     | Content of the lesson.                    |
| `CompletedBy`  | `ObjectId[]` | Array of references to `User` schema.     |

---

## Notify Schema

- **Name**: `Notify`
- **Description**: Stores notifications for users.

| Field Name     | Type         | Description                                |
|----------------|--------------|--------------------------------------------|
| `Title`        | `String`     | Notification title.                       |
| `Description`  | `String`     | Detailed description of the notification. |
| `CreatedAt`    | `Date`       | Date the notification was created.        |

---

## Subscription Schema

- **Name**: `Subscription`
- **Description**: Represents subscription plans for users.

| Field Name       | Type         | Description                                      |
|------------------|--------------|--------------------------------------------------|
| `PlanName`       | `String`     | Name of the subscription plan.                  |
| `Price`          | `Number`     | Price of the subscription plan.                 |
| `DurationDays`   | `Number`     | Duration of the subscription in days.           |
| `IsDeleted`      | `Boolean`    | Indicates if the subscription plan is deleted. Default is true. |

---

## User Schema

- **Name**: `User`
- **Description**: Represents users of the LMS system.

| Field Name           | Type         | Description                                  |
|----------------------|--------------|----------------------------------------------|
| `Username`           | `String`     | Unique username for the user.               |
| `Name`               | `String`     | First name of the user.                     |
| `Surname`            | `String`     | Last name of the user.                      |
| `Email`              | `String`     | Email address of the user.                  |
| `Role`               | `String`     | Role of the user (Admin, Instructor, User). |
| `Password`           | `String`     | Encrypted password.                         |
| `CreatedAt`          | `Date`       | Date when the user was created.             |
| `MyCourses`          | `Array`      | Embedded schema for user-course progress.   |
| `SubscriptionPlanID` | `ObjectId`   | Reference to the `Subscription` schema.     |
| `SubscriptionEndDate`| `Date`       | End date of the user’s subscription.       |

---

## UsersCourses Schema

- **Name**: `UsersCourses`
- **Description**: Tracks progress of users in courses.

| Field Name       | Type         | Description                                   |
|------------------|--------------|-----------------------------------------------|
| `User`           | `ObjectId`   | Reference to the `User` schema.              |
| `Course`         | `ObjectId`   | Reference to the `Course` schema.            |
| `Progress`       | `Number`     | Progress percentage (0-100).                 |
| `LessonsProgress`| `Array`      | Array of lessons with progress details.      |

---

## Relationships

### User and Course
- A user can enroll in multiple courses (`EnrolledUsers` in `Course` schema).

### Course and Lesson
- A course can have multiple lessons (`LessonList` in `Course` schema).

### User and Subscription
- A user can have one subscription plan (`SubscriptionPlanID` in `User` schema).

### User and Notifications
- Notifications can be sent to multiple users (`CompletedBy` in `Lesson` schema).

---
