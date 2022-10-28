const express = require("express");
const router = express.Router();
const { UserRole, EditorRole } = require("../auth/VerifyToken");
const {
  getContacts,
  getContact,
  postContact,
  deleteContact,
  deleteContacts,
} = require("../controllers/contactController");

// get all contact
router.get("/", EditorRole, getContacts);

// get one contact
router.get("/:id", EditorRole, getContact);

// create contact
router.post("/", postContact);

// delete one Contact
router.delete("/:id", EditorRole, deleteContact);

// delete all contacts
router.delete("/", EditorRole, deleteContacts);

module.exports = router;
