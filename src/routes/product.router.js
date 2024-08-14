import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../contollers/product.controller.js";

const router = express.Router();

// routes
router.get("/all", getAllProducts);
router.get("/:id", getProductById);

// secure routes
router.post("/create", verifyJWT, upload.array("images", 5), createProduct);
router.put("/update/:id", verifyJWT, upload.array("images", 5), updateProduct);

export default router;
