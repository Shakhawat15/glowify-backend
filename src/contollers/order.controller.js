import OrderModel from "../models/order.model.js";
import OrderItemModel from "../models/order_item.model.js";
import AddressMode from "../models/address.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Order
export const createOrder = asyncHandler(async (req, res) => {});

// Get All Orders
export const getAllOrders = asyncHandler(async (req, res) => {});

// Get Order By Id
export const getOrderById = asyncHandler(async (req, res) => {});

// Update Order
export const updateOrder = asyncHandler(async (req, res) => {});

// Delete Order
export const deleteOrder = asyncHandler(async (req, res) => {});
