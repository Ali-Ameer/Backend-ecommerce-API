const mongoose = require("mongoose");


const MessageSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: [true, "please enter an first name"],
    },
    lastName: {
        type: String, 
        required: [true, "please enter an last name"],
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email address"],
    },
    title: {
        type: String,
        required: [true, "Please enter a title"],
    },
    message: {
        type: String,
        required: [true, "Please enter a message"],
    },
},
{ timestamps: true }

)

module.exports = mongoose.model("message", MessageSchema);