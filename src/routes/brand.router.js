import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
} from "../contollers/brand.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// secure routes
router.post("/create", verifyJWT, upload.single("logo_path"), createBrand);
router.get("/all", verifyJWT, getAllBrands);
router.get("/:id", verifyJWT, getBrandById);
router.put("/update/:id", verifyJWT, upload.single("logo_path"), updateBrand);
router.delete("/delete/:id", verifyJWT, deleteBrand);

export default router;
