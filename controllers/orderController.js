const mongoose = require("mongoose");
const Order = require("../models/Order");

// add a product
const newOrder = async (req, res) => {
  const newOrder = new Order({
    ...req.body,
  });
  newOrder
    .save()
    .then((order) => {
      res.status(200).json({ message: "new order is added" });
      console.log(order)
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
// Get all orders
const getOrders = async (req, res) => {
  try {
      const order = await Order.find().sort({ createdAt: -1 })
      res.status(200).json(order);
    }
 catch (err) {
    res.status(500).json({message: err.message});
  }
}

// Get a single order
const getOrder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ error: "no order id found!" });
  }
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ error: "no such order" });
  }
  res.status(200).json( [order] );
};

// Delete a order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "order id is wrong!" });
  }
  const order = await Order.findByIdAndDelete({ _id: id })
    .then((order) => {
      return res.status(200).json({ message: "order deleted!", order });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

// Update a product
const updateOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "order id is wrong!" });
  }
  const order = await Order.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  )
    .then((order) => {
      return res.status(200).json({ message: "order updated!", order });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
  if (!order) {
    return res.status(500).json({ message: "no order found!" });
  }
};

module.exports = {
  newOrder, getOrders, getOrder, deleteOrder, updateOrder
};
