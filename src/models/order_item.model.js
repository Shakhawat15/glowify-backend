import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    product_title: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export { OrderItem };
