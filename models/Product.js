const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        image: {
            type: String,
            // required: true
        },
        price: {
            type: Number,
            required: true
        },
        inStock: {
            type: Boolean,
            default: true
        },
        categories: {
            type: Array,
            required: true
        },
        color: {
            type: Array,
            required: true
        },
        size: {
            type: Array,
            required: true
        },
        brand: {
            type: String,
            default: "unknowing"
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("product", productsSchema);