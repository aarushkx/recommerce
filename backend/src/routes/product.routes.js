import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getAllProducts,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// POST
router.post("/", protect, upload.array("images"), createProduct);

// PATCH
router.patch("/:productId", protect, upload.array("images"), updateProduct);

// DELETE
router.delete("/:productId", protect, deleteProduct);

// GET
router.get("/:productId", getProduct);
router.get("/", getAllProducts);

export default router;
