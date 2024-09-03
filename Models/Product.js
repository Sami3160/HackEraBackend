const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim:true,
    },
    price: {
      type: Number,
      required: true,
      trim:true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
    category: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category",
      trim:true,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
