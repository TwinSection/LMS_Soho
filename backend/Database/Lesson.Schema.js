const { default: mongoose } = require("mongoose");

module.exports = {
    Name : "Lesson",
    Schema : new mongoose.Schema({
        Title : { type: mongoose.Schema.Types.String },
        Description : { type: mongoose.Schema.Types.String },
        Content : { type: mongoose.Schema.Types.String },
        CompletedBy : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    })
}