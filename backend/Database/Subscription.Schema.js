const { default: mongoose } = require("mongoose");

module.exports = {
    Name : "Subscription",
    Schema : new mongoose.Schema({
        PlanName : { type: mongoose.Schema.Types.String },
        Price : { type: mongoose.Schema.Types.Number },
        DurationDays : { type: mongoose.Schema.Types.Number },
        IsDeleted : { type: mongoose.Schema.Types.Boolean, default: true }
    })
}