import { useEffect, useState } from 'react';
import { useUserContext } from './context/UserContext';
import Login from './Login';
import Register from './Register';
import UserHome from './UserHome';
import AdminHome from "./Admin/AdminHome"

import { Routes,Route, Navigate, useNavigate, useLocation } from 'react-router';
import HomePage from './Pages/HomePage';
import ProfilePage from './Pages/ProfilePage';
import NotificationPage from './Pages/NotificationPage';
import CourseDetailPage from './Pages/CourseDetailPage';
import FetchQuery from './FetchQuery';
import AllUsers from './Admin/AllUsers';
import AllCourses from './Admin/AllCourses';
import AllCategories from './Admin/AllCategories';
import AllSubscriptions from './Admin/AllSubscriptions';
import AllNotifications from './Admin/AllNotifications';
import SubscriptionPage from './Pages/SubscriptionPage';
import InstructorHome from './Instructor/InstructorHome';
import InstructorCourses from './Instructor/InstructorCourses';
import InstructorHomePage from './Instructor/InstructorHomePage';
import UserAllCourses from './Pages/UserAllCourses';

import "./App.css"

export const Pages = {
    Login: '/login',
    Home: '/',
    Courses : '/courses',
    Register: '/register',
    Profile: '/profile',
    Notifications: '/notifications',
    Course: '/course',
    Subscriptions: '/subscriptions',
};

export const NavbarUrls = [
    {
        name: "Ana Sayfa",
        url: Pages.Home
    },
    {
        name: "Kurslar",
        url: Pages.Courses
    },
    {
        name: "Bildirimler",
        url: Pages.Notifications
    },
    {
        name: "Abonelikler",
        url: Pages.Subscriptions
    },
    {
        name: "Profil",
        url: Pages.Profile
    },
    {
        name: "Çıkış Yap",
        url: Pages.Login,
        f : (setUser) => {
            setUser(undefined);
            localStorage.removeItem("LMStoken");
        }
    }
]

export const AdminNavbarUrls = [
    {
        name : "Kullanıcı Yönetimi",
        Items : [
            { name : "Tüm Kullanıcılar", url : "/users" },
            { name : "Kullanıcı Ekle", url : "/users/new" },
        ]
    },
    {
        name : "Eğitim Yönetimi",
        Items : [
            { name : "Tüm Eğitimler", url : "/courses" },
            { name : "Eğitim Ekle", url : "/courses/new" },
        ]
    },
    {
        name : "Kategori Yönetimi",
        Items : [
            { name : "Tüm Kategoriler", url : "/categories" },
            { name : "Kategori Ekle", url : "/categories/new" },
        ]
    },
    {
        name : "Bildirim Yönetimi",
        Items : [
            { name : "Tüm Bildirimler", url : "/notifications" },
            { name : "Bildirim Yolla", url : "/notifications/new" },
        ]
    },
    {
        name : "Abonelik Yönetimi",
        Items : [
            { name : "Tüm Abonelikler", url : "/subscriptions" },
            { name : "Abonelik Ekle", url : "/subscriptions/new" },
        ]
    },
    {
        name : "Diğer",
        Items : [
            { name : "Çıkış Yap", url : "/",
                f : (setUser) => {
                    setUser(undefined);
                    localStorage.removeItem("LMStoken");
                }}
        ]
    }
]

export const InstructorNavbarUrls = [
    {
        name : "Genel",
        Items : [
            { name : "Profil", url : "/profile" },
            { name : "Bildirimler", url : "/notifications" },
        ]
    },
    {
        name : "Kurs Yönetimi",
        Items : [
            { name : "Tüm Kurslarım", url : "/mycourses" }
        ]
    },
    {
        name : "Diğer",
        Items : [
            { name : "Çıkış Yap", url : "/",
                f : (setUser) => {
                    setUser(undefined);
                    localStorage.removeItem("LMStoken");
                }}
        ]
    }
]

export const AdminPages = {
    Home: '/',
    Users: '/users',
    Subscriptions: '/subscriptions',
    Courses: '/courses',
    Category: '/categories',
    Notifications : "/notifications"
}

export const InstructorPages = {
    Home: '/',
    MyCourses: '/mycourses'
}

export default function App() {

    let { user, setUser } = useUserContext();
    let [loading, setLoading] = useState(true);

    let nav = useNavigate();
    let loc = useLocation();

    useEffect(() => {
        let UserData = FetchQuery.Load();

        if (UserData) {
            try{
                UserData = JSON.parse(UserData);

                if(UserData.token){
                    FetchQuery.GetMyInfo(UserData.token).then((x) => {
                        if(x.user){
                            UserData = {
                                ...UserData,
                                user : x.user
                            };
                            return UserData;
                        }
                        return undefined;
                    }).then((x) => {
                        if(x == undefined){
                            FetchQuery.Quit();
                            setUser(undefined);
                            return;
                        }

                        FetchQuery.Update(UserData);
                        setUser(UserData);
                        setLoading(false);
                    })
                }

            }catch(error){
                UserData = undefined;
                FetchQuery.Quit();
                setUser(UserData);
                setLoading(false);
            }
        }else{
            setLoading(false);
        }

    }, [loc]);

    useEffect(() => {

        if((user?.user ?? false) && user.user.Role === "User"){
            let userTime = new Date(user.user?.SubscriptionEndDate ?? 0);
            let today = new Date();
            userTime.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            if(userTime < today && !loc.pathname.includes("subscriptions")){
                nav("/subscriptions");
            }
        }

    }, [user]);

    if(loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
    </div>;

    return (
        <Routes>
            {
                user === undefined ? (
                    <>
                        <Route path={Pages.Login} element={<Login />} />
                        <Route path={Pages.Register} element={<Register />} />
                        <Route path="*" element={<Navigate to={Pages.Login} replace />} />
                    </>
                ) : (user?.user?.Role === "Admin") ? (
                    <>
                        <Route path="/" element={<AdminHome />}>
                            <Route index element={<AllUsers />} />
                            
                            <Route path="users" element={<AllUsers />} />
                            <Route path="users/:id" element={<AllUsers />} />
                            <Route path="users/new" element={<AllUsers />} />
                            
                            <Route path="courses" element={<AllCourses />} />
                            <Route path="courses/:id" element={<AllCourses />} />
                            <Route path="courses/new" element={<AllCourses />} />
                            
                            <Route path="categories" element={<AllCategories />} />
                            <Route path="categories/:id" element={<AllCategories />} />
                            <Route path="categories/new" element={<AllCategories />} />

                            <Route path="subscriptions" element={<AllSubscriptions />} />
                            <Route path="subscriptions/new" element={<AllSubscriptions />} />

                            <Route path="notifications" element={<AllNotifications />} />
                            <Route path="notifications/new" element={<AllNotifications />} />
                            <Route path="*" element={<Navigate to={Pages.Home} replace />} />
                        </Route>
                    </>
                ) : (user?.user?.Role === "Egitmen") ? (
                    <>
                        <Route path="/" element={<InstructorHome />}>
                            <Route index element={<InstructorHomePage />} />
                            <Route path="notifications" element={<NotificationPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="mycourses" element={<InstructorCourses />} />
                            <Route path="mycourses/:id" element={<InstructorCourses />} />
                            <Route path="*" element={<Navigate to={Pages.Home} replace />} />
                        </Route>
                    </>
                ) : (
                    <>
                        <Route path="/" element={<UserHome />}>
                            <Route index element={<HomePage />} />
                            <Route path="courses" element={<UserAllCourses />} />
                            <Route path="notifications" element={<NotificationPage />} />
                            <Route path="subscriptions" element={<SubscriptionPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="course/:id" element={<CourseDetailPage />} />
                            <Route path="*" element={<Navigate to={Pages.Home} replace />} />
                        </Route>
                    </>
                )
            }
        </Routes>
    );
}
