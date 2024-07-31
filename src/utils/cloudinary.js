import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "glowify",
    });
    console.log("Image uploaded on Cloudinary", result.url);
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath);
  }
};

export { uploadOnCloudinary };
