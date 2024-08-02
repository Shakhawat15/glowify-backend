import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../contollers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", upload.single("photo_path"), registerUser);
router.post("/login", loginUser);

// secure route
router.get("/logout", verifyJWT, logoutUser);
router.get("/refresh-token", refreshAccessToken);

export default router;
