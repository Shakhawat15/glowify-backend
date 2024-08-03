import UserRoleModel from "../models/user_role.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create User Role
const createUserRole = asyncHandler(async (req, res) => {
  const { role_name, is_active } = req.body;

  if (!role_name) {
    throw new ApiError(400, "Role name is required");
  }

  const existedUserRole = await UserRoleModel.findOne({ role_name });

  if (existedUserRole) {
    throw new ApiError(409, "Role already exists");
  }

  const userRole = await UserRoleModel.create({ role_name, is_active });

  return res
    .status(201)
    .json(new ApiResponse(201, userRole, "Role created successfully"));
});

// Get All User Roles
const getAllUserRoles = asyncHandler(async (req, res) => {
  const userRoles = await UserRoleModel.find();

  if (!userRoles) {
    throw new ApiError(404, "No roles found");
  }

  return res.status(200).json(new ApiResponse(200, userRoles, "Roles found"));
});

// Get User Role By ID
const getUserRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userRole = await UserRoleModel.findById(id);

  if (!userRole) {
    throw new ApiError(404, "Role not found");
  }

  return res.status(200).json(new ApiResponse(200, userRole, "Role found"));
});

// Update User Role
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role_name, is_active } = req.body;

  if (!role_name) {
    throw new ApiError(400, "Role name is required");
  }

  const userRole = await UserRoleModel.findById(id);

  if (!userRole) {
    throw new ApiError(404, "Role not found");
  }

  const existedUserRole = await UserRoleModel.findOne({ role_name });

  if (existedUserRole && existedUserRole._id.toString() !== id) {
    throw new ApiError(409, "Role already exists");
  }

  userRole.role_name = role_name;
  userRole.is_active = is_active;

  await userRole.save();

  return res
    .status(200)
    .json(new ApiResponse(200, userRole, "Role updated successfully"));
});

// Delete User Role
const deleteUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userRole = await UserRoleModel.findById(id);

  if (!userRole) {
    throw new ApiError(404, "Role not found");
  }

  const deletedUserRole = await UserRoleModel.findByIdAndDelete(id);

  if (!deletedUserRole) {
    throw new ApiError(500, "Role not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedUserRole, "Role deleted successfully"));
});

export {
  createUserRole,
  getAllUserRoles,
  getUserRoleById,
  updateUserRole,
  deleteUserRole,
};
