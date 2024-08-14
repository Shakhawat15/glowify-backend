import mongoose from "mongoose";

const productDetailSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    attribute_type: {
      type: String,
      required: true,
      trim: true,
    },
    attribute_title: {
      type: String,
      required: true,
      trim: true,
    },
    attribute_description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const ProductDetail = mongoose.model("ProductDetail", productDetailSchema);

export default ProductDetail;
