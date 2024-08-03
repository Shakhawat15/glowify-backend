import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../contollers/category.controller.js";

const router = express.Router();

// secure routes
router.post(
  "/create",
  verifyJWT,
  upload.fields([
    { name: "icon_path", maxCount: 1 },
    { name: "image_path", maxCount: 1 },
  ]),
  createCategory
);
router.get("/all", verifyJWT, getAllCategories);
router.get("/:id", verifyJWT, getCategoryById);
router.put(
  "/update/:id",
  verifyJWT,
  upload.fields([
    { name: "icon_path", maxCount: 1 },
    { name: "image_path", maxCount: 1 },
  ]),
  updateCategory
);

router.delete("/delete/:id", verifyJWT, deleteCategory);

export default router;
