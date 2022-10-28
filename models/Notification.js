const mongoose = require("mongoose");


const NotificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
    },
    message: {
        type: String,
        required: [true, "Please enter a message notification"],
    },
    notification: {
        type: String,
        required: [true, "Please enter notification content"],
    },
    id: {
        type: String,
        required: [false, "Please enter id if exit"],
    },
},
{ timestamps: true }

)

module.exports = mongoose.model("notification", NotificationSchema);