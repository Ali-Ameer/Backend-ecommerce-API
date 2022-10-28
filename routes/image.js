const express = require("express");
const router = express.Router();
const { EditorRole } = require("../auth/VerifyToken");
const { uploadImage, getImages, getImage, deleteImage, updateImage } = require("../controllers/imageController");

// post contact
router.post("/", EditorRole, uploadImage);

// get all images
router.get("/", getImages);

// get one image
router.get("/:id", EditorRole, getImage);

// update image
router.patch("/", EditorRole, updateImage);

// delete image
router.delete("/:id", EditorRole, deleteImage);

module.exports = router;
