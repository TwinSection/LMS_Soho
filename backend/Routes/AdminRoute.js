const jwt = require("jose");
const { HashMyPassword } = require("../utils/PasswordManagment");
const { default: mongoose } = require("mongoose");
const SecretKey = require("./APIRoute").SecretKey;

// TEST EDİLECEK
/*
"success" = 1
"error" = 0
*/

module.exports = {

    AdminMiddleWare : async (ctx, next) => {
        
        return next(); //For Test

        try {
            const token = ctx.request.headers["authorization"];
            if (!token) {
                ctx.status = 401;
                ctx.body = {
                    status : 0,
                    message : "Authorization token eksik."
                };
                return;
            }
    
            let ID = jwt.decodeJwt(token).ID;
            let user = ctx.db.Models["User"];

            const data = await user.findOne({ _id: ID });
            console.log(data);
            if (data.Role != "Admin") {
                ctx.status = 403;
                ctx.body = { 
                    status : 0,
                    message : "Buraya erişme izniniz yok."
                };
                return;
            }
        } catch (error) {
            console.log(error);
            ctx.status = 401;
            ctx.body = {
                status : 0,
                message : "Geçersiz token"
            };
            return;
        }
    
        return next();
    },
    GetLesson : async (ctx, id = undefined) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        
        try{
            let data = id != undefined ?  await db.Models["Lesson"].find({_id : id}) : await db.Models["Lesson"].find({});
            return ctx.body = {
                status : 1,
                message : "Dersler",
                data : data
            }
        }catch(error){
            return ctx.body = {
                status : 0,
                message : "Dersler getirilemedi."
            }
        }
    },
    CreateLesson : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        
        const { Title, Description, Content } = ctx.request.body;

        try{
            let Lesson = db.Models["Lesson"];

            let newLesson = new Lesson({
                Title: Title,
                Description : Description,
                Content : Content,
                CreatedAt : Date.now()
            });

            await newLesson.save();
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "DB ile alakalı bir hata oluştu."
            }
        }

        ctx.body = {
            status : 1,
            message : "Ders Oluşturuldu"
        }
    },
    DeleteLesson : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        const id = ctx.params.id;
        
        let Course = db.Models["Course"];
        let Lesson = db.Models["Lesson"];
        
        if(id === undefined || id === null)
        {
            console.log("ID bulunamadı.");
            return ctx.body = {
                status : 0,
                message : "Ders silinemedi"
            }
        }
        
        try {
            await Course.updateOne({ LessonList: id }, { $pull: { LessonList: id } });
            await Lesson.deleteOne({ _id: id });

            console.log("id3", id);
            return ctx.body = {
                status : 1,
                message : "Ders silindi"
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                status : 0,
                message : "Ders silinemedi"
            }
        }
        
    },
    GetCategory : async (ctx, id = undefined) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        
        try{
            let data = id != undefined ?  await db.Models["Category"].find({_id : id}) : await db.Models["Category"].find({});
            return ctx.body = {
                status : 1,
                message : "Kategoriler",
                data : data
            }
        }catch(error){
            return ctx.body = {
                status : 0,
                message : "Kategoriler getirilemedi."
            }
        }
    },
    CreateCategory : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        
        const { CategoryName } = ctx.request.body;

        let category = db.Models["Category"];
        let dataCat = await category.findOne({ CategoryName: CategoryName });

        if(dataCat)
        {
            return ctx.body = {
                status : 0,
                message : "Bu kategori ismi kullanılıyor."
            }
        }
        
        let myCat = {};

        try{
            let newCategory = new category({
                CategoryName: CategoryName
            });

            await newCategory.save();
            myCat = await category.findOne({ CategoryName: CategoryName });
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "DB ile alakalı bir hata oluştu."
            }
        }

        ctx.body = {
            status : 1,
            message : "Kategori Oluşturuldu",
            data : myCat
        }
    },
    ModifyCategory : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        
        let { id } = ctx.params;
        const { CategoryName } = ctx.request.body;

        let Category = db.Models["Category"];
        const data = await Category.findOne({ _id: id }).findOne;

        if(!data)
        {
            return ctx.body = {
                status : 0,
                message : "Bu kategori bulunamadi."
            }
        }

        let updateFields = {};

        if(CategoryName) updateFields.CategoryName = CategoryName;
        
        if (Object.keys(updateFields).length < 1) {
            return ctx.body = {
                status: "warning",
                message: "Güncelleme için geçerli bir bilgi yok."
            };
        }

        try {
            await Category.updateOne({ _id: id }, { $set: updateFields });
            return ctx.body = {
                status: 1,
                message: "Kategori güncellendi."
            };
        } catch (error) {
            console.log(error)
            return ctx.body = {
                status: 0,
                message: "Güncelleme sırasında bir hata oluştu."
            };
        }
    },
    DeleteCategory : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        const { ID } = ctx.request.body;
        
        let Category = db.Models["Category"];
        
        try {
            await Category.deleteOne({ _id: ID });
            return ctx.body = {
                status : 1,
                message : "Kategori silindi"
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                status : 0,
                message : "Kategori silinemedi"
            }
        }
        
    },
    GetNotifications: async (ctx, id = undefined) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        
        try{
            let data = []
            if(id != undefined) data = await db.Models["Notify"].find({_id : id});
            else data = await db.Models["Notify"].find({}).sort({createdAt : -1});

            return ctx.body = {
                status : 1,
                message : "Bildirimler",
                data : data
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Bildirimler getirilemedi."
            }
        }
    },
    CreateNotification: async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;

        
        const { Title, Description } = ctx.request.body;
        let notify = db.Models["Notify"];
        
        try{
            let newNotify = new notify({
                Title: Title,
                Description: Description,
                CreatedAt: Date.now()
            });

            return ctx.body = {
                status : 1,
                message : "Notify eklendi.",
                data : await newNotify.save()
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "DB ile alakalı bir hata oluştu."
            }
        }
    },

    // User -start-
    GetUsers : async (ctx, id = undefined) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;

        try{
            let data = id != undefined ?  await db.Models["User"].find({_id : id}) : await db.Models["User"].find({});
            return ctx.body = {
                status : 1,
                message : "Kullanıcılar",
                data : data
            }
        }catch(error){
            return ctx.body = {
                status : 0,
                message : "Kullanıcılar getirilemedi."
            }
        }
        
    },
    CreateUser : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let User = db.Models["User"];
        
        let { Username, Name, Surname, Email, Password, Role } = ctx.request.body;

        let dataUsername = await User.findOne({ Username: Username });
        let dataEMail = await User.findOne({ Email: Email });

        console.log(dataUsername, dataEMail);

        if(dataUsername != null || dataEMail != null)
        {
            return ctx.body = {
                status : 0,
                message : "Bu username veya EMail kullanılıyor."
            }
        }

        Role = (!(Role == "Kullanici" || Role == "Egitmen" || Role == "Admin")) ? "Kullanici" : Role;
        
        try{

            let newUser = new User({
                Username: Username,
                Name: Name,
                Surname: Surname,
                Email: Email,
                Role : !Role ? "Kullanici" : Role,
                Password: HashMyPassword(Password ?? "")
            });

            await newUser.save();
            
            ctx.body = {
                status : 1,
                message : "Kullanıcı Oluşturuldu",
                data : {...newUser, Password : ""}
            }
        }catch(error){
            
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Bir hata oluştu."
            }
        }

    },
    ModifyUser : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        
        let { id } = ctx.params;
        const { Username, Name, Surname, Email, Password, Role } = ctx.request.body;

        let user = db.Models["User"];
        const data = await user.findOne({ _id: id }).findOne;

        if(!data)
        {
            return ctx.body = {
                status : 0,
                message : "Bu kullanıcı bulunamadi."
            }
        }

        let updateFields = {};

        if(Username) updateFields.Username = Username;
        if(Name) updateFields.Name = Name;
        if(Surname) updateFields.Surname = Surname;
        if(Email) updateFields.Email = Email;
        if(Role) updateFields.Role = Role;
        if(Password) updateFields.Password = HashMyPassword(Password.trim());
        
        if (Object.keys(updateFields).length < 1) {
            return ctx.body = {
                status: "warning",
                message: "Güncelleme için geçerli bir bilgi yok."
            };
        }

        try {
            await user.updateOne({ _id: id }, { $set: updateFields });
            let newdata = await user.findOne({ _id: id });
            if(newdata.Password) newdata.Password = "";
            return ctx.body = {
                status: 1,
                message: "Kullanıcı bilgileri güncellendi.",
                data : newdata
            };
        } catch (error) {
            console.log(error)
            return ctx.body = {
                status: 0,
                message: "Güncelleme sırasında bir hata oluştu."
            };
        }
    },
    DeleteUser : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        const id = ctx.params.id;
        
        let user = db.Models["User"];
        
        try {
            await user.deleteOne({ _id: id });
            return ctx.body = {
                status : 1,
                message : "Kullanıcı silindi"
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                status : 0,
                message : "Kullanıcı silinemedi"
            }
        }
        
    },
    // User -end-

    // Courses -start-
    GetCourses : async (ctx, id = undefined) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let course = db.Models["Course"];

        try{
            let courses = (id != undefined) ?
                            await course.find({_id : id}).populate('LessonList') :
                            await course.find({}).populate('LessonList');
            return ctx.body = {
                status : 1,
                message : "Kurslar",
                data : courses
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Kurslar getirilemedi",
            }
        }
    },
    CreateCourse : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let user = db.Models["User"];
        let course = db.Models["Course"];
        let lessonModel = db.Models["Lesson"];
        let category = db.Models["Category"];

        let { Title, Description, CategoryID, InstructorID, LessonList } = ctx.request.body;
        console.log(ctx.request.body);

        if ( !Title || !Description || !CategoryID || !InstructorID ) {
            return ctx.body = {
                status : 0,
                message : "Kurs oluşturulamadı. Eksik bilgiler var."
            }
        }

        let cat = await category.findOne({_id: CategoryID});
        let instructor = await user.findOne({ _id: InstructorID });

        if(!instructor){
            return ctx.body = {
                status : 0,
                message : "Eğitmen bulunamadı."
            }
        }

        if(!cat){
            return ctx.body = {
                status : 0,
                message : "Kategori bulunamadı."
            }
        }

        let newCourse = new course({ Title, Description, Category: cat, Instructor: instructor, LessonList:[] });

        if(LessonList){
            console.log("LessonList: ",LessonList);
            await LessonList.map(async (lesson) => {
                if(lesson._id) delete lesson._id;
                if(lesson.CreatedAt) delete lesson.CreatedAt;
                //OLUŞTUR

                try{
                    let newLesson = new lessonModel(lesson);
                    let ID = (await newLesson.save())._id;
                    newCourse.LessonList.push(ID);
                }catch(error){
                    console.log(error);
                }
            });
        }

        try{
            let c = await newCourse.save();
            
            return ctx.body = {
                status : 1,
                message : "Kurs oluşturuldu",
                data : await newCourse.save()
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Kurs oluşturulamadı."
            }
        }
    },
    ModifyCourse : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let user = db.Models["User"];
        let course = db.Models["Course"];
        let lessonModel = db.Models["Lesson"];

        let { id } = ctx.params;
        let { Title, Description, Category, InstructorID, LessonList } = ctx.request.body;

        
        if ( !id ) {
            return ctx.body = {
                status : 0,
                message : "Kurs güncellenemedi. ID eksik."
            }
        }

        let instructor = await user.findOne({ _id: InstructorID });
        let findedCourse = await course.findOne({ _id: id });

        if(!instructor){
            return ctx.body = {
                status : 0,
                message : "Eğitmen bulunamadı."
            }
        }

        if(!findedCourse)
        {
            return ctx.body = {
                status : 0,
                message : "Kurs bulunamadı."
            }
        }
        
        let updateFields = {};

        updateFields.Title = Title;
        updateFields.Description = Description;
        updateFields.Category = Category;
        updateFields.InstructorID = InstructorID;

        updateFields.LessonList = [];

        if (Object.keys(updateFields).length < 1) {
            return ctx.body = {
                status: "warning",
                message: "Kurs güncellenemedi. Güncelleme için geçerli bir bilgi yok."
            };
        }

        if(LessonList){
            
            let existsIDs = findedCourse.LessonList;
            let newLessonsIDs = [];
            
            LessonList.map((lesson) => {
                if(!existsIDs.includes(lesson._id)) newLessonsIDs.push(lesson._id);
            })

            for (let i = 0; i < LessonList.length; i++) {
                const lesson = LessonList[i];
                try{
                    if(newLessonsIDs.includes(lesson._id)){
                        delete lesson._id;
                        delete lesson.CreatedAt;

                        let newLesson = new lessonModel(lesson);
                        let ID = (await newLesson.save())._id;
                        console.log("new ID", ID);
                        updateFields.LessonList.push(ID);
                    }else{
                        await lessonModel.updateOne({ _id: lesson._id }, { $set: lesson });
                    }
                }catch(error){
                    console.log(error);
                }
            }

            updateFields.LessonList = updateFields.LessonList.concat(existsIDs);
        }

        console.log("updateFields.LessonList", updateFields.LessonList);

        try{
            await course.updateOne({ _id: id }, { $set: updateFields });
            return ctx.body = {
                status : 1,
                message : "Kurs güncellendi",
                
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Kurs güncellenemedi."
            }
        }
    },
    DeleteCourse : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        const { ID } = ctx.request.body;
        
        let course = db.Models["Course"];
        
        try {
            await course.deleteOne({ _id: ID });
            return ctx.body = {
                status : 1,
                message : "Kurs silindi"
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                status : 0,
                message : "Kurs silinemedi"
            }
        }
    },
    // Courses -end-

    // Subscription -start-
    GetSubscriptionPlans : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let id = ctx.body?.id ?? undefined;

        let sub = db.Models["Subscription"];

        try{

            let subData = id == undefined ? await sub.find({}) : await sub.find({_id : id})

            return ctx.body = {
                status : 1,
                message : "Abonelikler",
                data : subData
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Abonelikler getirilemedi",
            }
        }
    },
    CreateSubscriptionPlan : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;

        let sub = db.Models["Subscription"];


        try {
            let subData = await sub.find({PlanName : PlanName})

            if(subData)
            {
                return ctx.body = {
                    status : 0,
                    message : "Plan oluşturulamadı. Aynı plan adına sahip bir başka plan mevcut."
                }
            }
        }catch(err) {
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Plan oluşturulamadı. Bir hata oluştu."
            }
        }

        let { PlanName, Price, DurationDays } = ctx.request.body;

        if ( !PlanName || Price===undefined || DurationDays===undefined ) {
            return ctx.body = {
                status : 0,
                message : "Plan oluşturulamadı. Eksik bilgiler var."
            }
        }
        
        let newSub = new sub({
            PlanName: PlanName,
            Price: Price,
            DurationDays: DurationDays,
            IsDeleted: false
        });

        try{
            return ctx.body = {
                status : 1,
                message : "Plan oluşturuldu",
                data : await newSub.save()
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Plan oluşturulamadı."
            }
        }
    },
    ModifySubscriptionPlan : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let sub = db.Models["Subscription"];
        
        let { id } = ctx.params;
        let { PlanName, Price, DurationDays, IsDeleted } = ctx.request.body;
        
        if ( !id ) {
            return ctx.body = {
                status : 0,
                message : "Plan güncellenemedi. ID eksik."
            }
        }

        if(IsDeleted === undefined)
        {
            IsDeleted = false;
        }

        let findedSub = await sub.findOne({ _id: id });

        if(!findedSub)
            {
                return ctx.body = {
                    status : 0,
                    message : "Abonelik bulunamadı."
                }
            }

        let updateFields = {};

        updateFields.PlanName = PlanName;
        updateFields.Price = Price;
        updateFields.DurationDays = DurationDays;
        updateFields.IsDeleted = IsDeleted;

        if (Object.keys(updateFields).length < 1) {
            return ctx.body = {
                status: "warning",
                message: "Abonelik güncellenemedi. Güncelleme için geçerli bir bilgi yok."
            };
        }
    
        try{
            await sub.updateOne({ _id: id }, { $set: updateFields });
            return ctx.body = {
                status : 1,
                message : "Abonelik güncellendi",
                
            }
        }catch(error){
            console.log(error);
            return ctx.body = {
                status : 0,
                message : "Abonelik güncellenemedi."
            }
        }
    },
    DeleteSubscriptionPlan : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        const { ID } = ctx.request.body;
    
        let sub = db.Models["Subscription"];
    
        try {
            await sub.updateOne({ _id: ID }, { $set: { IsDeleted: true } });
            
            return ctx.body = {
                status: 1,
                message: "Subscription silindi"
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                status: 0,
                message: "Subscription silinemedi"
            };
        }
    }
    // Subscription -end-
}