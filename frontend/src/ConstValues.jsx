const URL = "http://localhost:9090/";

export default {
    URL : URL,
    LoginURL : URL + "api/auth/profile",
    RegisterURL : URL + "api/register",
    GetProfileURL : URL + "api/auth/getprofile",
    UpdateProfileURL : URL + "api/auth/profile",
    GetCoursesURL : URL + "api/courses",
    GetCourseURL : URL + "api/courses/:id",
    ModifyProgressURL : URL + "api/progress",
    GetProgressURL : URL + "api/progress/:id",
    GetNotificationURL : URL + "api/notifications",
    GetSubscriptionsURL : URL + "api/subscriptionplans",
    SubToSubPlansURL : URL + "api/subscription",
    Admin : {
        GetUsersURL : URL + "api/admin/users",
        GetUserURL : URL + "api/admin/user/:id",
        DeleteUserURL : URL + "api/admin/users/:id",
        CreateUserURL : URL + "api/admin/user",
        ModifyUserURL : URL + "api/admin/users/:id",

        GetCoursesURL : URL + "api/admin/courses",
        GetCourseURL : URL + "api/admin/courses/:id",
        CreateCourseURL : URL + "api/admin/courses",
        DeleteCourseURL : URL + "api/admin/courses/:id",
        ModifyCourseURL : URL + "api/admin/courses/:id",

        GetNotificationsURL : URL + "api/admin/notifications",
        GetNotificationURL : URL + "api/admin/notifications/:id",
        CreateNotificationURL : URL + "api/admin/notifications",
        ModifyNotificationURL : URL + "api/admin/notifications/:id",
        DeleteNotificationURL : URL + "api/admin/notifications/:id",

        DeleteLessonURL : URL + "api/admin/lessons/:id",

        GetSubPlansURL : URL + "api/admin/subscriptionplans",
        CreateSubPlanURL : URL + "api/admin/subscriptionplans",
        ModifySubPlanURL : URL + "api/admin/subscriptionplans/:id",
        DeleteSubPlanURL : URL + "api/admin/subscriptionplans/:id",

        GetAllCategories : URL + "api/admin/categories",
        CreateCategory : URL + "api/admin/categories",
        ModifyCategory : URL + "api/admin/categories/:id",

        CreateLesson : URL + "api/admin/lessons"

    },
    Instructor : {
        GetCourseURL : URL + "api/instructor/courses/:id",
        GetCoursesURL : URL + "api/instructor/courses",
        ModifyCourseURL : URL + "api/instructor/courses/:id",
    }
}