import BlogModel from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create blog
export const createBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user._id;

  if ([title, description, user_id].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const cover_photo_path = req.files?.cover_photo_path
    ? req.files.cover_photo_path[0]?.path
    : null;

  const blog = await BlogModel.create({
    title,
    description,
    user_id,
    cover_photo_path: cover_photo_path || "",
  });

  if (!blog) {
    throw new ApiError(500, "Blog not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, blog, "Blog created successfully"));
});

// Get All Blogs
export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await BlogModel.find();

  if (!blogs) {
    throw new ApiError(404, "No blog found");
  }

  return res.status(200).json(new ApiResponse(200, blogs, "All blogs"));
});

// Get Blog By Id
export const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await BlogModel.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res.status(200).json(new ApiResponse(200, blog, "Blog"));
});

// Update Blog
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const blog = await BlogModel.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const cover_photo_path = req.files?.cover_photo_path
    ? req.files.cover_photo_path[0]?.path
    : null;

  const updatedBlog = await BlogModel.findByIdAndUpdate(
    id,
    {
      title,
      description,
      cover_photo_path: cover_photo_path || blog.cover_photo_path,
    },
    { new: true }
  );

  if (!updatedBlog) {
    throw new ApiError(500, "Blog not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
});

// Update Blog Status
export const updateBlogStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  const blog = await BlogModel.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(
    id,
    { is_active },
    { new: true }
  );

  if (!updatedBlog) {
    throw new ApiError(500, "Blog status not updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedBlog, "Blog status updated successfully")
    );
});

// Delete Blog
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await BlogModel.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.cover_photo_path) {
    fs.unlinkSync(blog.cover_photo_path);
  }

  const deletedBlog = await BlogModel.findByIdAndDelete(id);

  if (!deletedBlog) {
    throw new ApiError(500, "Blog not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog deleted successfully"));
});

// Get Blogs By User Id
export const getBlogsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const blogs = await BlogModel.find({ user_id });

  if (!blogs) {
    throw new ApiError(404, "No blog found");
  }

  return res.status(200).json(new ApiResponse(200, blogs, "Blogs"));
});
