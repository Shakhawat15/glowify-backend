import express from "express";
import {
  getAllUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
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

export default router;
