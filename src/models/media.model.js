import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    media_type: {
      type: String,
      required: true,
      trim: true,
    },
    mediable_type: {
      type: String,
      required: true,
      trim: true,
    },
    mediable_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Media = mongoose.model("Media", mediaSchema);

export { Media };
