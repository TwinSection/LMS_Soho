const { default: mongoose, set } = require("mongoose");

module.exports = {
    Name : "UsersCourses",
    Schema : new mongoose.Schema({
        User : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        Course : { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        Progress : { type: mongoose.Schema.Types.Number,
            set : v => Math.min(Math.max(v, 0), 100),
            default : 0
         },
        LessonsProgress : [{
            Lesson : { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
            IsChecked : { type: mongoose.Schema.Types.Boolean, default: false }
        }]
    })
}