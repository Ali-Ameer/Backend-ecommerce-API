const express = require("express");
const router = express.Router();
const { UserRole, AdminRole, EditorRole } = require("../auth/VerifyToken");
const { getUsers, getUser, deleteUser, updateUser } = require('../controllers/userController')


// get all users
router.get("/", EditorRole, getUsers )

// get one user
router.get("/:id", UserRole, getUser )

// delete user
router.delete("/:id", AdminRole, deleteUser )

// update user
router.patch("/:id",  updateUser )

module.exports = router;
