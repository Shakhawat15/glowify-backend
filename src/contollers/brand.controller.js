import fs from "fs";
import path from "path";
import BrandModel from "../models/brand.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Brand
const createBrand = asyncHandler(async (req, res) => {
  const { brand_name, is_active } = req.body;

  if ([brand_name].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedBrand = await BrandModel.findOne({ brand_name });

  if (existedBrand) {
    throw new ApiError(409, "Brand already exists");
  }

  const photoLocalPath = req.file?.path;

  const brand = await BrandModel.create({
    brand_name,
    logo_path: photoLocalPath || "",
    is_active,
  });

  if (!brand) {
    throw new ApiError(500, "Brand not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, brand, "Brand created successfully"));
});

// Get All Brands
const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await BrandModel.find();

  if (!brands) {
    throw new ApiError(404, "No brand found");
  }

  return res.status(200).json(new ApiResponse(200, brands, "All brands"));
});

// Get Brand By Id
const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await BrandModel.findById(id);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  return res.status(200).json(new ApiResponse(200, brand, "Brand found"));
});

// Update Brand
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { brand_name, is_active } = req.body;

  if (!brand_name?.trim()) {
    throw new ApiError(400, "Brand name is required");
  }

  const brand = await BrandModel.findById(id);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  const photoLocalPath = req.file?.path;

  console.log("photoLocalPath", photoLocalPath);

  const updatedBrand = await BrandModel.findByIdAndUpdate(
    id,
    {
      brand_name,
      logo_path: photoLocalPath || brand.logo_path,
      is_active,
    },
    { new: true }
  );

  if (!updatedBrand) {
    throw new ApiError(500, "Brand not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBrand, "Brand updated successfully"));
});

// Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await BrandModel.findById(id);

  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  // Delete the image file if it exists
  const imagePath = path.join("./", brand.logo_path);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  const deletedBrand = await BrandModel.findByIdAndDelete(id);

  if (!deletedBrand) {
    throw new ApiError(500, "Brand not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedBrand, "Brand deleted successfully"));
});

export { createBrand, deleteBrand, getAllBrands, getBrandById, updateBrand };
