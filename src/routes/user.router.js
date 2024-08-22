import express from "express";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUser,
  updateUserStatus,
} from "../contollers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route
router.post("/register", upload.single("photo_path"), registerUser);
router.post("/login", loginUser);

// secure route
router.get("/logout", verifyJWT, logoutUser);
router.get("/refresh-token", refreshAccessToken);
router.get("/all", verifyJWT, getAllUsers);
router.patch("/status/:id", verifyJWT, updateUserStatus);
router.put("/update/:id", verifyJWT, upload.single("photo_path"), updateUser);
router.delete("/delete/:id", verifyJWT, deleteUser);

export default router;
