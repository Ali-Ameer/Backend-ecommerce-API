const express = require("express");
const router = express.Router();
const { EditorRole, UserRole } = require("../auth/VerifyToken");
const {
  getNotifications,
  getNotification,
  postNotification,
  deleteNotification,
  deleteNotifications,
} = require("../controllers/notificationController");

// get all Notification
router.get("/", getNotifications);

// get one Notification
router.get("/:id", EditorRole, getNotification);

// create Notification
router.post("/", UserRole, postNotification);

// delete one Notification
router.delete("/:id", EditorRole, deleteNotification);

// delete all Notification
router.delete("/", EditorRole, deleteNotifications);

module.exports = router;
