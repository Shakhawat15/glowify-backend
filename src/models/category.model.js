import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    // parent_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    // },
    category_name: {
      type: String,
      required: true,
      trim: true,
    },
    icon_path: {
      type: String,
      default: "",
    },
    image_path: {
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

const Category = mongoose.model("Category", categorySchema);

export default Category;
