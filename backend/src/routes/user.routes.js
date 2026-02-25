import express from "express";
import {
    getUser,
    updateProfile,
    deleteAccount,
    getUserProducts,
    getUserBookings,
    getUserSales,
    getReviewsAboutUser,
} from "../controllers/user.controller.js";
import {
    addToFavorites,
    removeFromFavorites,
    getAllFavorites,
} from "../controllers/favorites.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

//User favorites
//GET
router.get("/favorites", protect, getAllFavorites);

//POST
router.post("/favorites/:productId", protect, addToFavorites);

//DELETE
router.delete("/favorites/:productId", protect, removeFromFavorites);

// User profile
//GET
router.get("/:userId", protect, getUser);

//PATCH
router.patch(
    "/update-profile",
    protect,
    upload.single("avatar"),
    updateProfile,
);

//DELETE
router.delete("/delete-account", protect, deleteAccount);

// User activity
// GET
router.get("/:userId/products", getUserProducts);
router.get("/:userId/reviews", getReviewsAboutUser);
router.get("/:userId/bookings", protect, getUserBookings);
router.get("/:userId/sales", protect, getUserSales);

export default router;
