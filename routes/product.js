const express = require("express");
const router = express.Router();
const { VerifyToken, UserRole, EditorRole, AdminRole } = require("../auth/VerifyToken");
const { newProduct ,getProducts, getProduct, deleteProduct, updateProduct } = require('../controllers/productsController')

// add a new product
router.post("/newproduct", EditorRole, newProduct )

// get all products
router.get("/",  getProducts )

// get one product 
router.get("/:id", getProduct )

// delete product 
router.delete("/:id", AdminRole, deleteProduct )

// update product
router.patch("/:id",  EditorRole, updateProduct )

module.exports = router;
