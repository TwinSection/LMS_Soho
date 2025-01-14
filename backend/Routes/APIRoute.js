const JWT = require("jose");
const { HashMyPassword } = require("../utils/PasswordManagment");
const crypto = require('crypto');

const SecretKey = "ToOSeCrEtKeY";

module.exports = {

    SecretKey : SecretKey,

    UserMW : async (ctx, next) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;

        const Token = ctx.request.headers["authorization"];

        if (!Token) {
            ctx.User = false;
            return next();
        }

        let user = db.Models["User"];
        let ID = JWT.decodeJwt(Token).ID;

        const data = await user.findOne({ _id: ID }).populate({
            path: "MyCourses",
            populate: {
                path: "CategoryID"
            }
        });

        if (!data) {
            ctx.User = false;
            return next();
        }

        if (data.SubscriptionEndDate) {
            const endDate = new Date(data.SubscriptionEndDate);
            const now = new Date();

            console.log(endDate, now);
        
            if (endDate < now) {
                data.SubscriptionEndDate = 0;
                user.updateOne({ _id: ID }, { $set: { SubscriptionEndDate: 0 } }).then(() => {}).catch((error) => {
                    console.log(error);
                });
            }
        }else{
            data.SubscriptionEndDate = 0;
        }

        ctx.User = data;
        return next();
    },

    // User -start-
    RegisterUser: async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;

        let User = db.Models["User"];

        let newUser = new User({
            Username: (ctx.request.body?.Username ?? "").trim(),
            Name: ctx.request.body?.Name ?? "",
            Surname: ctx.request.body?.Surname ?? "",
            Email: ctx.request.body?.Email ?? "",
            Password: ctx.request.body?.Password ?? "",
            SubscriptionEndDate : new Date(0),
        });

        if (newUser.Username == "" || newUser.Password == "" || newUser.Email == "" || newUser.Name == "" || newUser.Surname == "") {
            return ctx.body = {
                status: 0,
                message: "Kullanıcı Oluşturulamadı. Bilgiler eksik."
            }
        }

        newUser.Password = HashMyPassword(ctx.request.body?.Password ?? "-".trim());

        try {
            let check = await User.findOne({ $or:[ {'Username':newUser.Username}, {'Email':newUser.Email} ] });
            if (!check) {
                let x = await newUser.save();
            }else{
                return ctx.body = {
                    status: 0,
                    message: "Kullanıcı adı veya Eposta kullanılıyor."
                }
            }
        } catch (error) {
            console.log(error);
            return ctx.body = {
                status: 0,
                message: "Kullanıcı Oluşturulamadı. Sistem hatası."
            }
        }

        ctx.body = {
            status: 1,
            message: "Kullanıcı oluşturuldu."
        }
    },
    LoginUser: async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;

        const { Username, Password } = ctx.request.body;

        if (!Username || !Password) {
            ctx.status = 400;
            return ctx.body = {
                status: 0,
                message: "Kullanıcı yok veya bilgiler eksik."
            }
        }

        let user = db.Models["User"];

        const data = await user.findOne({ Username: Username });

        if (!data) {
            return ctx.body = {
                status: 0,
                message: "Kullanıcı yok veya bilgiler eksik."
            }
        }

        let hashed = HashMyPassword(Password.trim());
        
        if (hashed != data.Password) {
            return ctx.body = {
                status: 0,
                message: "Kullanıcı yok veya bilgiler hatalı."
            }
        }

        const secret = crypto.createSecretKey(Buffer.from(SecretKey));
        const token = await new JWT.SignJWT({
            ID: data._id,
            role: data.Role
        }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("4h").sign(secret);


        if(data.SubscriptionPlanID !== undefined && data.SubscriptionEndDate < new Date())
        {
            data.SubscriptionPlanID = undefined;
            data.SubscriptionEndDate = new Date(0);
        }

        return ctx.body = {
            status: 1,
            message: "Kullanıcı Girişi Yapıldı.",
            token: token
        }

    },
    GetUserInfo: async (ctx) => {
        if(!ctx.User)
        {
            ctx.status = 400;
            return ctx.body = {
                status: 0,
                message: "Aktif kullanıcı mevcut değil."
            }
        }
        
        return ctx.body = {
            status: 1,
            message: "Aktif kullanıcı bulundu.",
            user: ctx.User
        }
    },
    ModifyUser: async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;

        const { NewName, NewSurname, NewPassword } = ctx.request.body;

        if (!ctx.User) {
            ctx.status = 400;
            return ctx.body = {
                status: 0,
                message: "Aktif kullanıcı bulunamadı."
            }
        }

        let user = db.Models["User"];
        let ID = ctx.User._id;
        /*
        let ID = JWT.decodeJwt(Token).ID;

        const data = await user.findOne({ _id: ID });
        
        if(!data)
        {
        ctx.status = 400;
        return ctx.body = {
            status: 0,
            message: "Aktif kullanıcı mevcut değil."
        }
    }
    */

        let updateFields = {};

        if (NewName) updateFields.Name = NewName;
        if (NewSurname) updateFields.Surname = NewSurname;
        if (NewPassword) {
            const hashedPassword = HashMyPassword(NewPassword.trim());
            updateFields.Password = hashedPassword;
        }
        
        if (Object.keys(updateFields).length < 1) {
            return ctx.body = {
                status: "warning",
                message: "Güncelleme için geçerli bir bilgi yok."
            };
        }

        try {
            await user.updateOne({ _id: ID }, { $set: updateFields });
            return ctx.body = {
                status: 1,
                message: "Kullanıcı bilgileri güncellendi."
            };
        } catch (error) {
            console.log(error)
            return ctx.body = {
                status: 0,
                message: "Güncelleme sırasında bir hata oluştu."
            };
        }
        
    },
    // User -end-

    // Subscription -start-
    GetSubscriptionPlans : async (ctx) => {
        let db = ctx.db;
        let subscription = db.Models["Subscription"];
        try {
            return ctx.body = {
                status: 1,
                message: "Abonelikler",
                data : await subscription.find({})
            }
        } catch (error) {
            console.log(error);
            return ctx.body = {
                status: 0,
                message: "Abonelikler getirilemedi."
            }
        }
    },
    SubToSubscriptionPlan : async (ctx) => {
        let db = ctx.db;
        let user = db.Models["User"];
        let subscription = db.Models["Subscription"];
        let { SubID } = ctx.request.body;
        ctx.User;
        
        try {
            let sub = await subscription.findOne({ _id: SubID });
            if(!sub || (sub?.IsDeleted ?? false))
            {
                return ctx.body = {
                    status: 0,
                    message: "Abonelik bulunamadı veya aktif olmayan bir plan seçtiniz."
                }
            }

            let date = new Date(new Date().getTime() + sub.DurationDays * 24 * 60 * 60 * 1000);
            console.log(date);
            let data = await user.updateOne({ _id: ctx.User._id }, { $set: { SubscriptionPlanID: SubID, SubscriptionEndDate: date } });
            
            return ctx.body = {
                status: 1,
                message: "Abonelik seçildi.",
                data : data
            }

        } catch (error) {
            console.log(error);
            return ctx.body = {
                status: 0,
                message: "Abonelik seçilemedi."
            }
        }
    },
    // Subscription -end-

    // Courses -start-
    GetNotifications: async (ctx) => {
        let db = ctx.db;
        let notify = db.Models["Notify"];
        ctx.body = {
            status: 1,
            message: "Bildirimler",
            data : await notify.find({})
        }
    },
    ReadedNotifications: (ctx) => {
        ctx.body = {
            status: 1,
            message: "Bildirim okundu."
        }
    },
    // Courses -end-

    // Courses -start-
    GetCourses: async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;

        let course = db.Models["Course"];

        try{
            return ctx.body = {
                status : 1,
                message : "Kurslar",
                data : await course.find({}).populate('LessonList').populate("EnrolledUsers").populate("Instructor").populate("Category")
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Kurslar getirilemedi",
            }
        }
    },
    GetCourse: async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let {id} = ctx.params;

        let course = db.Models["Course"];

        try{
            return ctx.body = {
                status : 1,
                message : "Kurs",
                data : await course.findOne({_id : id}).populate('LessonList').populate("EnrolledUsers").populate("Instructor").populate("Category")
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Kurs getirilemedi",
            }
        }
    },
    ModifyProgress: async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        const userM = db.Models["User"];
        const lessonM = db.Models["Lesson"];
        let {Course, lessonID, lessonIsComplete} = ctx.request.body;

        console.log("Lesson Is Complete: ",lessonIsComplete);

        if(!ctx.User){
            return ctx.body = {
                status: 0,
                message: "Aktif kullanıcı mevcut değil."
            }
        }

        const userId = ctx.User._id;
        let lesson = null;
        let userCourse = null;

        let courses = await db.Models["Course"].find({}).populate('LessonList');

        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];
            for (let j = 0; j < course.LessonList.length; j++) {
                let l = course.LessonList[j];
                if (l._id == lessonID) {
                    lesson = l;
                    userCourse = course;
                    break;
                }
            }
        }

        if (!userCourse) {
            return ctx.body = {
                status: 0,
                message: "Kursa kayıtlı değilsiniz."
            };
        }

        if(lesson == null)
        {
            return ctx.body = {
                status: 0,
                message: "Kursa kayıtlı değilsiniz veya kurs bilgileri değiştirilmiş."
            };
        }

        if(userId === null || userId === undefined)
        {
            return ctx.body = {
                status: 0,
                message: "Kullanıcı kimliğiniz alınamadı."
            };
        }

        if(
            (lessonIsComplete && !lesson.CompletedBy.includes(userId))
            ||
            (!lessonIsComplete && lesson.CompletedBy.includes(userId))
        ){
            if(lessonIsComplete) {
                lesson.CompletedBy.push(userId);
            } else {
                lesson.CompletedBy = lesson.CompletedBy.filter(item => item.toString() !== userId.toString());
            }

            try {
                await lessonM.updateOne({ _id: lessonID }, { $set: { CompletedBy: lesson.CompletedBy } });
            } catch (error) {
                console.log(error);
            }
        }

        const totalLessonLength = userCourse.LessonList.length;
        let totalCompleteByUser = 0;

        for (let lesson of userCourse.LessonList) {
            if (lesson.CompletedBy.includes(userId)) {
                totalCompleteByUser++;
            }
        }

        let progress = totalLessonLength > 0 ? (totalCompleteByUser / totalLessonLength) * 100 : 0;
        progress = Math.min(Math.max(progress, 0), 100);
        let formattedProgress = parseFloat(progress.toFixed(1));

        try{
            await ctx.User.save();
            return ctx.body = {
                status: 1,
                message: "Progress Saved.",
                data: formattedProgress 
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status: 0,
                message: "Progress Not Saved.",
                data: formattedProgress 
            }
        }
    },
    GetProgress: async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let {id} = ctx.params;

        if(!ctx.User){
            return ctx.body = {
                status: 0,
                message: "Aktif kullanıcı mevcut değil."
            }
        }

        if(!id){
            return ctx.body = {
                status: 0,
                message: "Aktif kurs bulunamadı."
            }
        }

        const userId = ctx.User._id;
        const user = ctx.User;
        
        let course = await db.Models["Course"].findOne({_id : id}).populate('LessonList').populate("EnrolledUsers").populate("Instructor").populate("Category");

        if(!course)
        {
            return ctx.body = {
                status: 0,
                message: "Kurs bulunamadı."
            }
        }

        let returnVals = {};

        console.log(course);

        for (let j = 0; j < course?.LessonList.length; j++) {
            if (course.LessonList[j].CompletedBy.includes(userId)) {
                returnVals = {...returnVals, [course.LessonList[j]._id]: true};
            }else{
                returnVals = {...returnVals, [course.LessonList[j]._id]: false};
            }
        }

        ctx.body = {
            status: 1,
            message: "Kurs bulundu.",
            data: {
                progressList: returnVals
            }
        }
    }
    // Courses -end-
}