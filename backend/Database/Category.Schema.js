const { default: mongoose } = require("mongoose");

module.exports = {
    Name : "Category",
    Schema : new mongoose.Schema({
        CategoryName : { type: mongoose.Schema.Types.String }
    })
}