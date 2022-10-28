const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// get all notification
const getNotifications = async (req, res) => {
  try {
    const notification = await Notification.find({}).sort({ createdAt: -1 });
    res.status(200).json({ notification });
  } catch (error) {
    res.status(500).json(error);
  }
};

//get one notification
const getNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.find({ _id: id });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json(error);
  }
};

// create a notification
const postNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(200).json({ notification });
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete one notification
const deleteNotification = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "notification id is wrong!" });
  }
  const notification = await Notification.findByIdAndDelete({ _id: id })
    .then((notification) => {
      return res
        .status(200)
        .json({ message: "notification deleted!", notification });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "no notification found!", err: err });
    });
};

// delete all notification
const deleteNotifications = async (req, res) => {
  const notification = await Notification.deleteMany({})
    .then((notification) => {
      return res
        .status(200)
        .json({ message: "notifications deleted!", notification });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "no notifications found!", err: err });
    });
};

module.exports = {
  getNotifications,
  getNotification,
  postNotification,
  deleteNotification,
  deleteNotifications,
};
