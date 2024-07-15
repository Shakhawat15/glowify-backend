import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const UserRole = mongoose.model("UserRole", userRoleSchema);

export { UserRole };
