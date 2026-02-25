import express from "express";
import {
    getAllUsers,
    getAllProducts,
    toggleBlockUser,
    deleteProductByAdmin,
} from "../controllers/admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

// GET
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/products", protect, adminOnly, getAllProducts);

// PATCH
router.patch("/users/:userId/block", protect, adminOnly, toggleBlockUser);

// DELETE
router.delete("/products/:productId", protect, adminOnly, deleteProductByAdmin);

export default router;
