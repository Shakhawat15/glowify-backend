import fs from "fs";
import CategoryModel from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { category_name, is_active } = req.body;

  if ([category_name].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedCategory = await CategoryModel.findOne({ category_name });

  if (existedCategory) {
    throw new ApiError(409, "Category already exists");
  }

  console.log("req.files", req.files);

  const icon_path = req.files?.icon_path ? req.files.icon_path[0]?.path : null;
  const image_path = req.files?.image_path
    ? req.files.image_path[0]?.path
    : null;

  console.log("icon_path", req.files?.icon_path[0].path);
  console.log("image_path", image_path);

  const category = await CategoryModel.create({
    category_name,
    icon_path: icon_path || "",
    image_path: image_path || "",
    is_active,
  });

  if (!category) {
    throw new ApiError(500, "Category not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

// Get All Categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.find();

  if (!categories) {
    throw new ApiError(404, "No category found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "All categories"));
});

// Get Category By Id
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res.status(200).json(new ApiResponse(200, category, "Category found"));
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category_name, is_active } = req.body;

  if (!category_name?.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const icon_path = req.files?.icon_path ? req.files.icon_path[0]?.path : null;
  const image_path = req.files?.image_path
    ? req.files.image_path[0]?.path
    : null;

  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    id,
    {
      category_name,
      icon_path: icon_path || category.icon_path,
      image_path: image_path || category.image_path,
      is_active,
    },
    { new: true }
  );

  if (!updatedCategory) {
    throw new ApiError(500, "Category not updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Delete the image file if it exists
  if (category.icon_path) {
    fs.unlinkSync(category.icon_path);
  }

  if (category.image_path) {
    fs.unlinkSync(category.image_path);
  }

  const deletedCategory = await CategoryModel.findByIdAndDelete(id);

  if (!deletedCategory) {
    throw new ApiError(500, "Category not deleted");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedCategory, "Category deleted successfully")
    );
});

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
};
