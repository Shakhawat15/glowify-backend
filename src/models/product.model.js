import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    rrp: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    discounted_price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_type: {
      type: String,
      trim: true,
    },
    discount_price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Product", productSchema);

export { Product };
