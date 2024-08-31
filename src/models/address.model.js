import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    first_line: {
      type: String,
      trim: true,
    },
    second_line: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    post_code: {
      type: String,
      trim: true,
    },
    address_type: {
      type: String,
      trim: true,
    },
    addressable_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    addressable_type: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
