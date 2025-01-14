const mongoose = require("mongoose");
const { HashMyPassword } = require("../utils/PasswordManagment");

module.exports = class Database {

    /**
     * @typedef {Object} MongooseModel
     * @property {string} name - Model adı
     * @property {Object} schema - Mongoose şeması
     */

    /**
     * Bir model nesnesi sözlüğü. Anahtarlar model adları, değerler Mongoose modelleridir.
     * @type {Object<string, import('mongoose').Model<any>>}
     */
    Models = {};

    constructor(mongostring = "mongodb://localhost:27017/LMS") {
        this.MONGOSTRING = mongostring;
        this.Connected = false;
        this.DB = null;
    }

    async Connect(){
        try {
            this.DB = await mongoose.connect(this.MONGOSTRING);
            this.Connected = true;
        } catch (error) {
            console.log(error);
            this.Connected = false;
        }
        return this.Connected;
    }

    async Start(){
        await this.Connect();
        await this.LoadModels();
    }

    async LoadModels(){
        this.Models = {};
        
        let UserS = require("./User.Schema");
        let CourseS = require("./Course.Schema");
        let UsersCoursesS = require("./UsersCourses.Schema");
        let NotifyS = require("./Notify.Schema");
        let SubscriptionS = require("./Subscription.Schema");
        let LessonS = require("./Lesson.Schema");
        let CategoryS = require("./Category.Schema");

        this.Models[UserS.Name] = mongoose.model(UserS.Name, UserS.Schema);
        this.Models[CourseS.Name] = mongoose.model(CourseS.Name, CourseS.Schema);
        this.Models[UsersCoursesS.Name] = mongoose.model(UsersCoursesS.Name, UsersCoursesS.Schema);
        this.Models[NotifyS.Name] = mongoose.model(NotifyS.Name, NotifyS.Schema);
        this.Models[SubscriptionS.Name] = mongoose.model(SubscriptionS.Name, SubscriptionS.Schema);
        this.Models[LessonS.Name] = mongoose.model(LessonS.Name, LessonS.Schema);
        this.Models[CategoryS.Name] = mongoose.model(CategoryS.Name, CategoryS.Schema);
    
        this.StartUp();
    }

    async StartUp(){
        let User = this.Models["User"];

        let admin = new User({
            Username: "Admin",
            Name: "Mr",
            Surname: "Admin",
            Email: "admin@admin.admin",
            Role : "Admin",
            Password: HashMyPassword("123456")
        });

        let isAdminExists = await User.findOne({ Role: "Admin" });
        if(!isAdminExists) await admin.save();

    }

    async Disconnect(){
        this.Connected = false;
        try {
            await mongoose.disconnect();
        } catch (error) {
        }
        return !this.Connected;
    }

}