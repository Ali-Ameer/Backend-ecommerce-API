const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    imgURL: {
        required: true,
        type: String
    },
    link: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    }
}, 
    { timestamps: true }
    );

module.exports = mongoose.model("image", ImageSchema);
