import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to convert buffer to stream
const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Signal the end of the stream
  return stream;
};

// Upload an image buffer directly to Cloudinary
const uploadOnCloudinary = async (buffer) => {
  try {
    return await new Promise((resolve, reject) => {
      const stream = bufferToStream(buffer);
      const streamUpload = cloudinary.uploader.upload_stream(
        { folder: "glowify" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.pipe(streamUpload);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null; // Return null in case of failure
  }
};

export { uploadOnCloudinary };
