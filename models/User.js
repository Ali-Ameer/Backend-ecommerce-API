const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter an full name"],
  },
  username: {
    type: String,
    required: [true, "please enter an username"],
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "please enter an email"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
  },
  image: {
    type: String,
    default: "https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png",
  },
  role: {
    type: String,
    default: "User",
    enum: ["Admin", "Editor", "User"]
  },
  refreshToken: [String]
},
 { timestamps: true }

);


module.exports = mongoose.model("user", userSchema);
