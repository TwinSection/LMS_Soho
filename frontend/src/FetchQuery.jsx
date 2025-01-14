import axios from "axios"
import ConstValues from "./ConstValues";

export const HTTPMethods = Object.freeze({GET : "GET", POST : "POST", PUT : "PUT", DELETE : "DELETE"});

/**
 * 
 * @param {string} token 
 * @returns 
 */
export function SetDefaultHeaders(token) {
    return {
        authorization: token
    }
};

/**
 * 
 * @param {HTTPMethods} mType 
 * @param {string} url 
 * @param {object} headers 
 * @param {any} body 
 * @returns 
 */
export const MakeRequest = (mType = HTTPMethods.GET, url, headers = {}, body = undefined) => {
    return new Promise((A,B) => {
        (
            body == undefined ?
            (
                axios({
                    method : mType,
                    baseURL : url,
                    headers : headers
                })
            ):
            (
                axios({
                    method : mType,
                    baseURL : url,
                    headers : headers,
                    data : body
                })
            )
        ).then((res) => res?.data).then((res) => {
            console.log(res);
            A(res);
        }).catch((err) => {
            B(err);
        })
    })
}

export default {

    Admin : {
        GetUsers : (token, id = undefined) => {
            let url = (id == undefined) ? ConstValues.Admin.GetUsersURL : ConstValues.Admin.GetUserURL.replace(":id", id);
            return MakeRequest(HTTPMethods.GET, url, SetDefaultHeaders(token));
        },
        GetCourses : (token, id = undefined) => {
            let url = (id == undefined) ? ConstValues.Admin.GetCoursesURL : ConstValues.Admin.GetCourseURL.replace(":id", id);
            return MakeRequest(HTTPMethods.GET, url, SetDefaultHeaders(token));
        },
        GetCategories : (token, id = undefined) => {
            return MakeRequest(HTTPMethods.GET, ConstValues.Admin.GetAllCategories, SetDefaultHeaders(token));
        },
        GetSubPlans : (token, id = undefined) => {
            let url = (id == undefined) ? ConstValues.Admin.GetSubPlansURL : ConstValues.Admin.GetSubPlansURL.replace(":id", id);
            return MakeRequest(HTTPMethods.GET, url, SetDefaultHeaders(token));
        },
        GetNotifications : (token, id = undefined) => {
            let url = (id == undefined) ? ConstValues.Admin.GetNotificationsURL : ConstValues.Admin.GetNotificationURL.replace(":id", id);
            return MakeRequest(HTTPMethods.GET, url, SetDefaultHeaders(token));
        },

        ModifyUser : (token, user) => {
            let URL = ConstValues.Admin.ModifyUserURL.replace(":id", user._id);
            return MakeRequest(HTTPMethods.PUT, URL, SetDefaultHeaders(token), user);
        },
        ModifyCourse : (token, course) => {
            let URL = ConstValues.Admin.ModifyCourseURL.replace(":id", course._id);
            return MakeRequest(HTTPMethods.PUT, URL, SetDefaultHeaders(token), course);
        },
        ModifyCategory : (token, category) => {
            let URL = ConstValues.Admin.ModifyCategory.replace(":id", category._id);
            return MakeRequest(HTTPMethods.PUT, URL, SetDefaultHeaders(token), category);
        },

        CreateUser : (token, user) => {
            return MakeRequest(HTTPMethods.POST, ConstValues.Admin.CreateUserURL, SetDefaultHeaders(token), user);
        },
        CreateCourse : (token, course) => {
            return MakeRequest(HTTPMethods.POST, ConstValues.Admin.CreateCourseURL, SetDefaultHeaders(token), course);
        },
        CreateLesson : (token, lesson) => {
            return MakeRequest(HTTPMethods.POST, ConstValues.Admin.CreateLesson, SetDefaultHeaders(token), lesson);
        },
        CreateCategory : (token, category) => {
            return MakeRequest(HTTPMethods.POST, ConstValues.Admin.CreateCategory, SetDefaultHeaders(token), category);
        },
        CreateSubPlan : (token, sub) => {
            return MakeRequest(HTTPMethods.POST, ConstValues.Admin.CreateSubPlanURL, SetDefaultHeaders(token), sub);
        },
        CreateNotify : (token, sub) => {
            return MakeRequest(HTTPMethods.POST, ConstValues.Admin.CreateNotificationURL, SetDefaultHeaders(token), sub);
        },

        DeleteUser : (token, id) => {
            let URL = ConstValues.Admin.DeleteUserURL.replace(":id", id);
            return MakeRequest(HTTPMethods.DELETE, URL, SetDefaultHeaders(token));
        },
        DeleteLesson : (token, id) => {
            let URL = ConstValues.Admin.DeleteLessonURL.replace(":id", id);
            return MakeRequest(HTTPMethods.DELETE, URL, SetDefaultHeaders(token));
        },
        DeleteNotify : (token, sub) => {
            return MakeRequest(HTTPMethods.DELETE, ConstValues.Admin.DeleteNotificationURL, SetDefaultHeaders(token), sub);
        },
        
    },

    
    Instructor : {
        GetCourse : (token, id) => {
            let link = ConstValues.Instructor.GetCourseURL.replace(":id", id);
            return MakeRequest(HTTPMethods.GET, link, SetDefaultHeaders(token));
        },
        GetCourses : (token) => {
            return MakeRequest(HTTPMethods.GET, ConstValues.Instructor.GetCoursesURL, SetDefaultHeaders(token));
        },
        ModifyCourse : (token, course) => {
            let URL = ConstValues.Instructor.ModifyCourseURL.replace(":id", course._id);
            return MakeRequest(HTTPMethods.PUT, URL, SetDefaultHeaders(token), course);
        },
    },

    MakeLogin : (username, password) => {
        return MakeRequest(HTTPMethods.POST, ConstValues.LoginURL, undefined, {Username : username.trim(), Password : password.trim()})
    },

    MakeRegister : (username, password, email, name, surname) => {
        return MakeRequest(HTTPMethods.POST, ConstValues.RegisterURL, undefined, {
            Username: username.trim(),
            Password: password.trim(),
            Email: email.trim(),
            Name: name,
            Surname: surname
        })
    },

    GetMyInfo : (token) => {
        return MakeRequest(HTTPMethods.GET, ConstValues.GetProfileURL, SetDefaultHeaders(token));
    },

    GetCourses : (token) => {
        return MakeRequest(HTTPMethods.GET, ConstValues.GetCoursesURL, SetDefaultHeaders(token));
    },

    GetCourse : (token, courseID) => {
        let URL = ConstValues.GetCourseURL.replace(":id", courseID);
        return MakeRequest(HTTPMethods.GET, URL, SetDefaultHeaders(token));
    },

    GetSubPlans : (token) => {
        return MakeRequest(HTTPMethods.GET, ConstValues.GetSubscriptionsURL, SetDefaultHeaders(token));
    },

    SubToSubPlans : (token, subID) => {
        return MakeRequest(HTTPMethods.POST, ConstValues.SubToSubPlansURL, SetDefaultHeaders(token), {SubID : subID});
    },

    GetNotify : (token) => {
        return MakeRequest(HTTPMethods.GET, ConstValues.GetNotificationURL, SetDefaultHeaders(token));
    },

    ModifyProgress : (token, lessonID, lessonComplete) => {
        return MakeRequest(HTTPMethods.PUT, ConstValues.ModifyProgressURL, SetDefaultHeaders(token), {
            lessonID: lessonID,
            lessonIsComplete: lessonComplete
        });
    },

    GetProgress : (token, user, courseID) => {
        let URL = ConstValues.GetProgressURL.replace(":id", courseID);
        return MakeRequest(HTTPMethods.GET, URL, SetDefaultHeaders(token), {
            User: user,
        });
    },

    UpdateUserInfo : (token, data) => {
        return MakeRequest(HTTPMethods.PUT, ConstValues.UpdateProfileURL, SetDefaultHeaders(token), data);
    },

    Load : () => {
        return localStorage.getItem("LMStoken");
    },

    Update : (data) => {
        if(typeof data !== "string") data = JSON.stringify(data);
        localStorage.setItem("LMStoken", data);
    },

    Quit : () => {
        localStorage.removeItem("LMStoken");
    }

}