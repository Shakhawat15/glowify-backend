import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "glowify",
    });
    fs.unlinkSync(localFilePath); // Remove the local file after upload
    return result; // Return the Cloudinary upload result
  } catch (error) {
    console.error("Cloudinary upload error:", error); // Log the error
    fs.unlinkSync(localFilePath); // Remove the local file even if upload fails
    return null; // Return null in case of failure
  }
};

export { uploadOnCloudinary };
