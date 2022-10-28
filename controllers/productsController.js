const mongoose = require("mongoose");
const Product = require("../models/Product");

// add a product
const newProduct = async (req, res) => {
  const newProduct = new Product({
    ...req.body,
  });
  newProduct
    .save()
    .then((product) => {
      res.status(200).json({ product });
    })
    .catch((err) => {
      res.status(500).json({ message: "can't create new product", err });
    });
};
// Get all products
const getProducts = async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get a one product
const getProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "product id is wrong!" });
  }
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "no such product" });
  }
  res.status(200).json({ product });
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "product id is wrong!" });
  }
  const product = await Product.findByIdAndDelete({ _id: id })
    .then((product) => {
      return res.status(200).json({ message: "product deleted!", product });
    })
    .catch((err) => {
      return res.status(500).json({ message: "no product found!", err: err });
    });
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "product id is wrong!" });
  }
  const product = await Product.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  )
    .then((product) => {
      return res.status(200).json({ message: "product updated!", product });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
  if (!product) {
    return res.status(500).json({ message: "no product found!" });
  }
};

module.exports = {
  newProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct
};
