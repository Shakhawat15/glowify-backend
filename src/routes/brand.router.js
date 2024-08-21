import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  updateBrandStatus,
} from "../contollers/brand.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// routes
router.get("/all", getAllBrands);
router.get("/:id", getBrandById);

// secure routes
router.post("/create", verifyJWT, upload.single("logo_path"), createBrand);
router.put("/update/:id", verifyJWT, upload.single("logo_path"), updateBrand);
router.delete("/delete/:id", verifyJWT, deleteBrand);
router.patch("/status/:id", verifyJWT, updateBrandStatus);

export default router;
