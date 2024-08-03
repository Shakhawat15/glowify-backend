import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: true,
      trim: true,
    },
    logo_path: {
      type: String,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
