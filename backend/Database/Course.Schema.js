const { default: mongoose } = require("mongoose");

module.exports = {
    Name : "Course",
    Schema : new mongoose.Schema({
        Title : { type: mongoose.Schema.Types.String },
        Description : { type: mongoose.Schema.Types.String },
        Category : { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        CreatedAt : { type: mongoose.Schema.Types.Date, default: Date.now },
        Instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        EnrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        LessonList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
    })
}