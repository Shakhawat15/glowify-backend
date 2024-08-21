import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ProductModel from "../models/product.model.js";
import MediaModel from "../models/media.model.js";
import ProductDetailModel from "../models/product_detail.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const {
    category_id,
    brand_id,
    title,
    sku,
    rrp,
    quantity,
    discounted_price,
    discount_type,
    discount_price,
    attributes,
  } = req.body;

  if (
    [category_id, brand_id, title, sku, rrp, quantity].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedProduct = await ProductModel.findOne({ sku });

  if (existedProduct) {
    throw new ApiError(409, "Product already exists");
  }

  let parsedAttributes = [];
  if (typeof attributes === "string") {
    console.log("attributes", attributes);
    try {
      parsedAttributes = JSON.parse(attributes);
    } catch (error) {
      throw new ApiError(400, "Invalid format for attributes");
    }
  } else {
    parsedAttributes = attributes;
  }

  let product;
  try {
    product = await ProductModel.create({
      category_id,
      brand_id,
      title,
      sku,
      rrp,
      quantity,
      discounted_price,
      discount_type,
      discount_price,
    });

    if (!product) {
      throw new ApiError(500, "Product not created");
    }

    // Handling Media Uploads
    if (req.files?.length > 0) {
      try {
        await Promise.all(
          req.files.map((file) =>
            MediaModel.create({
              media_type: "image",
              mediable_type: "product",
              mediable_id: product._id,
              path: file.path,
            })
          )
        );
      } catch (error) {
        // If there is an error in uploading media, delete the product
        await ProductModel.findByIdAndDelete(product._id);
        throw new ApiError(
          500,
          "Failed to add media. Product creation rolled back."
        );
      }
    }

    // Handling Attributes
    if (parsedAttributes?.length > 0) {
      try {
        await Promise.all(
          parsedAttributes.map((attribute) =>
            ProductDetailModel.create({
              product_id: product._id,
              attribute_type: attribute.attribute_type,
              attribute_title: attribute.attribute_title,
              attribute_description: attribute.attribute_description,
            })
          )
        );
      } catch (error) {
        // If there is an error in adding attributes, delete the media and product
        await MediaModel.deleteMany({ mediable_id: product._id });
        await ProductModel.findByIdAndDelete(product._id);
        throw new ApiError(
          500,
          "Failed to add attributes. Product creation rolled back."
        );
      }
    }

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Product creation failed");
  }
});

// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      // Lookup for media
      {
        $lookup: {
          from: "media",
          localField: "_id",
          foreignField: "mediable_id",
          as: "media",
        },
      },
      // Lookup for product details
      {
        $lookup: {
          from: "productdetails",
          localField: "_id",
          foreignField: "product_id",
          as: "product_details",
        },
      },
      // Lookup for category
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category", // Unwind the category array to get a single object
      },
      // Lookup for brand
      {
        $lookup: {
          from: "brands",
          localField: "brand_id",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand", // Unwind the brand array to get a single object
      },
      {
        $project: {
          _id: 1,
          title: 1,
          sku: 1,
          rrp: 1,
          quantity: 1,
          discount_type: 1,
          discount_price: 1,
          media: {
            $map: {
              input: "$media",
              as: "m",
              in: {
                _id: "$$m._id",
                mediable_id: "$$m.mediable_id",
                path: "$$m.path",
              },
            },
          },
          product_details: {
            $map: {
              input: "$product_details",
              as: "product_details",
              in: {
                attribute_type: "$$product_details.attribute_type",
                attribute_title: "$$product_details.attribute_title",
                attribute_description:
                  "$$product_details.attribute_description",
              },
            },
          },
          category: {
            _id: "$category._id",
            name: "$category.category_name",
          },
          brand: {
            _id: "$brand._id",
            name: "$brand.brand_name",
          },
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiResponse(200, products, "Products retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to retrieve products");
  }
});

// Get Product By Id
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  // Convert the ID to ObjectId
  const objectId = new mongoose.Types.ObjectId(id);

  try {
    const product = await ProductModel.aggregate([
      {
        $match: { _id: objectId },
      },
      // Lookup for media
      {
        $lookup: {
          from: "media",
          localField: "_id",
          foreignField: "mediable_id",
          as: "media",
        },
      },
      // Lookup for product details
      {
        $lookup: {
          from: "productdetails",
          localField: "_id",
          foreignField: "product_id",
          as: "product_details",
        },
      },
      // Lookup for category
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category", // Unwind the category array to get a single object
      },
      // Lookup for brand
      {
        $lookup: {
          from: "brands",
          localField: "brand_id",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand", // Unwind the brand array to get a single object
      },
      {
        $project: {
          _id: 1,
          title: 1,
          sku: 1,
          rrp: 1,
          quantity: 1,
          discount_type: 1,
          discount_price: 1,
          media: {
            $map: {
              input: "$media",
              as: "m",
              in: {
                _id: "$$m._id",
                mediable_id: "$$m.mediable_id",
                path: "$$m.path",
              },
            },
          },
          product_details: {
            $map: {
              input: "$product_details",
              as: "product_details",
              in: {
                attribute_type: "$$product_details.attribute_type",
                attribute_title: "$$product_details.attribute_title",
                attribute_description:
                  "$$product_details.attribute_description",
              },
            },
          },
          category: {
            _id: "$category._id",
            name: "$category.category_name",
          },
          brand: {
            _id: "$brand._id",
            name: "$brand.brand_name",
          },
        },
      },
    ]);

    if (!product || product.length === 0) {
      throw new ApiError(404, "Product not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, product, "Product retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to retrieve product");
  }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    category_id,
    brand_id,
    title,
    sku,
    rrp,
    quantity,
    discounted_price,
    discount_type,
    discount_price,
    attributes,
  } = req.body;

  if (
    [category_id, brand_id, title, sku, rrp, quantity].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  // Convert the ID to ObjectId
  const objectId = new mongoose.Types.ObjectId(id);

  let parsedAttributes = [];
  if (typeof attributes === "string") {
    try {
      parsedAttributes = JSON.parse(attributes);
    } catch (error) {
      throw new ApiError(400, "Invalid format for attributes");
    }
  } else {
    parsedAttributes = attributes;
  }

  try {
    const product = await ProductModel.findByIdAndUpdate(
      objectId,
      {
        category_id,
        brand_id,
        title,
        sku,
        rrp,
        quantity,
        discounted_price,
        discount_type,
        discount_price,
      },
      { new: true }
    );

    if (!product) {
      throw new ApiError(500, "Product not updated");
    }

    // // Handling Media Uploads
    // if (req.files?.length > 0) {
    //   try {
    //     await Promise.all(
    //       req.files.map((file) =>
    //         MediaModel.create({
    //           media_type: "image",
    //           mediable_type: "product",
    //           mediable_id: product._id,
    //           path: file.path,
    //         })
    //       )
    //     );
    //   } catch (error) {
    //     throw new ApiError(500, "Failed to add media");
    //   }
    // }

    // Handle Media Updates
    if (req.files?.length > 0) {
      // Delete existing media for the product
      await MediaModel.deleteMany({ mediable_id: product._id });

      // Add new media
      await Promise.all(
        req.files.map((file) =>
          MediaModel.create({
            media_type: "image",
            mediable_type: "product",
            mediable_id: product._id,
            path: file.path,
          })
        )
      );
    }

    // Handling Attributes
    if (parsedAttributes?.length > 0) {
      try {
        await ProductDetailModel.deleteMany({ product_id: product._id });
        await Promise.all(
          parsedAttributes.map((attribute) =>
            ProductDetailModel.create({
              product_id: product._id,
              attribute_type: attribute.attribute_type,
              attribute_title: attribute.attribute_title,
              attribute_description: attribute.attribute_description,
            })
          )
        );
      } catch (error) {
        throw new ApiError(500, "Failed to add attributes");
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Product update failed");
  }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
