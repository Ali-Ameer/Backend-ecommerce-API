const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

// Get all users
const getUsers = async (req, res) => {
  const user = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.status(200).json(user);
};

// Get a single user
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "user id is wrong!" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "no such user" });
  }
  const { password, ...others } = user._doc;
  res.status(200).json({...others});
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "user id is wrong!" });
  }
  const user = await User.findByIdAndDelete({ _id: id })
    .then((user) => {
      const { password, ...others } = user._doc;
      return res.status(200).json({ message: "user deleted!", ...others });
    })
    .catch((err) => {
      return res.status(500).json({ message: "no user found!", err: err });
    });
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "user id is wrong!" });
  }
  const user = await User.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!user) {
    return res.status(500).json({ message: "no user found!" });
  }
  const { password, ...others } = user._doc;
  return res.status(200).json({ message: "user updated!", ...others });
};

module.exports = { getUsers, getUser, deleteUser, updateUser };