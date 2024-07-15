import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    total_amount: {
      type: Number,
      required: true,
    },
    discount_amount: {
      type: Number,
      required: true,
    },
    gross_amount: {
      type: Number,
      required: true,
    },
    shipping_cost: {
      type: Number,
      required: true,
    },
    net_amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      trim: true,
    },
    payment_status: {
      type: String,
      trim: true,
    },
    payment_type: {
      type: String,
      trim: true,
    },
    payment_transaction_id: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Order = mongoose.model("Order", orderSchema);

export { Order };
