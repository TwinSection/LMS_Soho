const { default: mongoose } = require("mongoose");

module.exports = {
    Name : "Notify",
    Schema : new mongoose.Schema({
        Title : { type: mongoose.Schema.Types.String },
        Description : { type: mongoose.Schema.Types.String },
        CreatedAt : { type: mongoose.Schema.Types.Date, default: Date.now }
    })
}