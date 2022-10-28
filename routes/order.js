const express = require("express");
const router = express.Router();
const { EditorRole, AdminRole } = require("../auth/VerifyToken");
const { newOrder, getOrders, getOrder, deleteOrder, updateOrder } = require('../controllers/orderController')

// add a new order
router.post("/", newOrder )

// get all orders
router.get("/",  EditorRole, getOrders )

// get one order 
router.get("/:id", EditorRole, getOrder )

// delete order 
router.delete("/:id", AdminRole, deleteOrder )

// update order
router.patch("/:id",  EditorRole, updateOrder )

module.exports = router;
