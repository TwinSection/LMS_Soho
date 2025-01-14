const { default: mongoose } = require("mongoose");
const UsersCoursesSchema = require("./UsersCourses.Schema");
const SubscriptionSchema = require("./Subscription.Schema");

module.exports = {
    Name : "User",
    Schema : new mongoose.Schema({
        Username : { type: mongoose.Schema.Types.String },
        Name : { type: mongoose.Schema.Types.String },
        Surname : { type: mongoose.Schema.Types.String },
        Email : { type: mongoose.Schema.Types.String },
        Role : { type: mongoose.Schema.Types.String, default: "Kullanici", enum : ["Kullanici", "Egitmen", "Admin"] },
        Password : { type: mongoose.Schema.Types.String },
        CreatedAt : { type: mongoose.Schema.Types.Date, default: Date.now },
        MyCourses : [ UsersCoursesSchema.Schema ],
        SubscriptionPlanID : { type: mongoose.Schema.Types.ObjectId, ref: SubscriptionSchema.Name },
        SubscriptionEndDate : { type: mongoose.Schema.Types.Date }
    })
}