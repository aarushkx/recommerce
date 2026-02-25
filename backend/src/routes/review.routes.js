import express from "express";
import {
    postReview,
    getAllReviews,
    getSingleReview,
    deleteReview,
} from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

//POST
router.post("/:bookingId", protect, upload.single("image"), postReview);

//GET
router.get("/:buyerId",protect, getAllReviews);
router.get("/:reviewId", protect, getSingleReview);

//DELETE
router.delete("/:reviewId", protect, deleteReview);

export default router;
