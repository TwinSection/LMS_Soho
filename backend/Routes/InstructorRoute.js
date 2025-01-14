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

    InstructorMiddleWare : async (ctx, next) => {
        
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
            if (data.Role != "Egitmen") {
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
    GetCourses : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let course = db.Models["Course"];
        let id = ctx.params.id;

        try{
            let courses = (id != undefined) ?
                            await course.find({_id : id}).populate('LessonList').populate("EnrolledUsers").populate("Instructor").populate("Category"):
                            await course.find({}).populate('LessonList').populate("EnrolledUsers").populate("Instructor").populate("Category")
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
    ModifyCourse : async (ctx) => {
        /**
         * @type {import('../Database/Database')}
         */
        const db = ctx.db;
        let user = db.Models["User"];
        let course = db.Models["Course"];
        let lessonModel = db.Models["Lesson"];

        let { id } = ctx.params;
        let { Title, Description, Category, Instructor, LessonList } = ctx.request.body;
        console.log(Instructor);
        let InstructorID = Instructor._id;

        
        if ( !id ) {
            return ctx.body = {
                status : 0,
                message : "Kurs güncellenemedi. ID eksik."
            }
        }

        let instructor = await user.findOne({ _id: InstructorID });
        let findedCourse = await course.findOne({ _id: id }).populate('LessonList').populate("EnrolledUsers").populate("Instructor").populate("Category");

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
        updateFields.Category = Category._id;
        updateFields.InstructorID = InstructorID;

        updateFields.LessonList = [];

        if (Object.keys(updateFields).length < 1) {
            return ctx.body = {
                status: "warning",
                message: "Kurs güncellenemedi. Güncelleme için geçerli bir bilgi yok."
            };
        }

        if(LessonList){
            let existsIDs = findedCourse.LessonList.map(lesson => lesson._id.toString());
            console.log(existsIDs);

            
            let newLessonsIDs = [];
            
            LessonList.map((lesson) => {
                if(!existsIDs.includes(lesson._id.toString())) newLessonsIDs.push(lesson._id.toString());
            })

            for (let i = 0; i < LessonList.length; i++) {
                const lesson = LessonList[i];
                try{
                    if(newLessonsIDs.includes(lesson._id.toString())){
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
    // Courses -end-
}