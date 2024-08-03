import express from "express";
import {
  createUserRole,
  deleteUserRole,
  getAllUserRoles,
  getUserRoleById,
  updateUserRole,
} from "../contollers/user_role.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// secure routes
router.post("/create", verifyJWT, createUserRole);
router.get("/all", verifyJWT, getAllUserRoles);
router.get("/:id", verifyJWT, getUserRoleById);
router.put("/update/:id", verifyJWT, updateUserRole);
router.delete("/delete/:id", verifyJWT, deleteUserRole);

export default router;
