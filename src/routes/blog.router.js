import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUserId,
  updateBlog,
  updateBlogStatus,
} from "../contollers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// route
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);

// secure routes
router.post(
  "/create",
  verifyJWT,
  upload.single("cover_photo_path"),
  createBlog
);
router.put(
  "/update/:id",
  verifyJWT,
  upload.single("cover_photo_path"),
  updateBlog
);
router.patch("/status/:id", verifyJWT, updateBlogStatus);
router.delete("/delete/:id", verifyJWT, deleteBlog);
router.get("/user/:id", verifyJWT, getBlogsByUserId);

export default router;
