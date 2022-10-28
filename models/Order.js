const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema(
  {
    name: {type: String},
    email: {type: String},
    status: {
      type: String,
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    products: [
      {
        productId: {
          type: mongoose.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
